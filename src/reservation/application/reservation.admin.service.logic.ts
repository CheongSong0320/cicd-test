import { ObjectCannedACL, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AdminTokenPayload } from '@backend-sw-development-team4/nestjs-authorization';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CommunityClub } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { NotificationRepository } from './../infrastructure/repository/notification.repository';

import { CommunityClubRepository } from '../infrastructure/repository/communityClub.repository';
import { ReservationRepository } from '../infrastructure/repository/reservation.repository';
import { applicationGroupBy } from '../infrastructure/util/applicationGroupBy';
import { calculateUsageMinute, createTimeString } from '../infrastructure/util/date.util';

import { CommunityClubValidator } from '../infrastructure/validator/communityClub.validator';
import { ReservationValidator } from '../infrastructure/validator/reservation.validator';

import { CommunityUsageStatusType, RegisterCommunityBody, UpdateCommunityBody } from '../interface/community.interface';

import { ReservationDto } from '../domain/prisma/reservation.dto';
import { ApiService } from '../infrastructure/repository/api.repository';
import { calculateReservationUsageStatus } from '../infrastructure/util/reservation.util';
import { GetCommunityUsageStatusDetailQuery } from '../interface/getCommunityUsageStatusDetail.dto';
import { PatchReservationBody } from '../interface/patchReservation.admin.dto';
import { RegisterCommunityDto } from './dto/admin/registerCommunity.dto';
import { QueryDto } from './dto/admin/searchReservation.dto';

@Injectable()
export class ReservationAdminServiceLogic {
    private s3Client: S3Client;

    constructor(
        private reservationValidator: ReservationValidator,
        private reservationRepository: ReservationRepository,
        private communityClubValidator: CommunityClubValidator,
        private communityClubRepository: CommunityClubRepository,
        private notificationRepository: NotificationRepository,
        private apiService: ApiService,
    ) {
        this.s3Client = new S3Client({ region: 'ap-northeast-2' });
    }

    async getImagePutUrl() {
        const command = new PutObjectCommand({
            ACL: ObjectCannedACL.public_read,
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `images/${uuidv4()}`,
        });
        const presignedUrl = await getSignedUrl(this.s3Client, command, {
            expiresIn: 5 * 60,
        });

        return {
            presignedUrl,
            databaseUrl: presignedUrl.split('?')[0],
        };
    }

    async registerCommunity(body: RegisterCommunityBody, payload: AdminTokenPayload) {
        const imageUrl = body.communityClub.image ? await this.getImagePutUrl() : undefined;

        const community = await this.communityClubRepository
            .create(
                this.communityClubValidator.registerCommunityClubValidator(
                    {
                        ...body,
                        type: body.communityClub.type,
                    } as RegisterCommunityBody,
                    payload.apartmentId,
                    imageUrl?.databaseUrl,
                ),
            )
            .then(value => RegisterCommunityDto.from({ ...value, image: imageUrl?.presignedUrl ?? null }));

        await this.apiService.createAuditLog(payload.apartmentId, {
            action: 'CREATE',
            menu: '시설 예약',
            content: JSON.stringify(community),
            timestamp: new Date(),
            issuer: payload.id,
        });

        return community;
    }

    async getCommunityUsageStatus(payload: AdminTokenPayload, year: number, month: number) {
        const communities = await this.communityClubRepository.findByApartmentId(this.communityClubValidator.findByApartmentIdValidator(payload.apartmentId));
        const communityMap = applicationGroupBy(communities, 'id');

        const reservationList = applicationGroupBy(
            await this.reservationRepository.findByCommunityClubIds(this.reservationValidator.findByCommunityClubIds(Object.keys(communityMap).map(Number), year, month)),
            args => `${args.dong}_${args.ho}_${args.communityClubId}`,
        );

        const additionalHouseHold: { [key: number]: { communityName: string; count: number } } = {} as { [key: number]: { communityName: string; count: number } };

        const usageStatus = Object.values(
            Object.entries(reservationList).reduce(
                (curr, [key, value]) => {
                    const [dong, ho, communityClubId] = key.split('_');
                    const now = curr[dong + ho] ?? { dong, ho, usageStatus: [] };
                    const nowCommunity: CommunityClub = communityMap[communityClubId][0];

                    const { usageCount, usageTime, additionalUsageCount, additionalUsageTime } = calculateReservationUsageStatus(nowCommunity)(value);

                    const nowAdditional = additionalHouseHold[nowCommunity.id];

                    additionalHouseHold[nowCommunity.id] = nowAdditional
                        ? { ...nowAdditional, count: nowAdditional.count + (additionalUsageCount ? 1 : 0) }
                        : { communityName: nowCommunity.name, count: additionalUsageCount ? 1 : 0 };

                    return {
                        ...curr,
                        [dong + ho]: {
                            ...now,
                            usageStatus: [
                                ...now.usageStatus,
                                {
                                    communityClubId: Number(communityClubId),
                                    communityName: nowCommunity.name,
                                    usageCount,
                                    usageTime: createTimeString(usageTime),
                                    additionalUsageCount,
                                    additionalUsageTime: createTimeString(additionalUsageTime),
                                    viewProperty: nowCommunity.resetCycle === 'DAY' ? 'usageTime' : 'usageCount',
                                },
                            ],
                        },
                    };
                },
                {} as {
                    [key: string]: {
                        dong: string;
                        ho: string;
                        usageStatus: CommunityUsageStatusType[];
                    };
                },
            ),
        );

        return {
            communities: communities.map(value => value.name),
            usageStatus,
            additionalHouseHold: Object.values(additionalHouseHold),
        };
    }

    async getCommunityUsageStatusDetail(payload: AdminTokenPayload, { dong, ho, dateFrom, dateTo }: GetCommunityUsageStatusDetailQuery) {
        const communities = await this.communityClubRepository.findByApartmentId(this.communityClubValidator.findByApartmentIdValidator(payload.apartmentId));

        const communityMap = applicationGroupBy(communities, 'id');

        const usageByUser = await this.reservationRepository.findWithCommunityClub(this.reservationValidator.findWithCommunityClub(Object.keys(communityMap).map(Number), dong, ho, dateFrom, dateTo));

        const groupBy1depth = Object.entries(applicationGroupBy(usageByUser, value => `${value.dong}-${value.ho}-${value.userId}-${value.communityClubId}`)).map(([key, value]) => {
            const { userName, userType, userPhone } = value[0];

            const { usageTime, usageCount, additionalUsageTime, additionalUsageCount, communityName, viewProperty } = value.reduce(
                ({ usageTime, usageCount, additionalUsageTime, additionalUsageCount }, { startDate, endDate, communityClubId }) => {
                    const { freeCountPerHouse, name, resetCycle } = communityMap[communityClubId][0];

                    const nowUsageMinute = calculateUsageMinute(startDate, endDate);
                    return {
                        usageCount: usageCount + 1,
                        usageTime: usageTime + nowUsageMinute,
                        additionalUsageCount: usageCount + 1 > freeCountPerHouse ? additionalUsageCount + 1 : 0,
                        additionalUsageTime: usageCount + 1 > freeCountPerHouse ? additionalUsageTime + nowUsageMinute : 0,
                        communityName: name,
                        viewProperty: resetCycle === 'DAY' ? 'usageTime' : 'usageCount',
                    };
                },
                { usageTime: 0, usageCount: 0, additionalUsageTime: 0, additionalUsageCount: 0, communityName: '', viewProperty: '' },
            );

            return {
                communityName,
                usageTime,
                usageCount,
                additionalUsageTime: createTimeString(additionalUsageTime),
                additionalUsageCount,
                key,
                userName,
                userType,
                userPhone,
                usageTimeString: createTimeString(usageTime),
                viewProperty,
            };
        });

        const groupBy2depth = Object.entries(
            applicationGroupBy(groupBy1depth, value => {
                const [dong, ho, userId] = value.key.split('-');
                return `${dong}-${ho}-${userId}`;
            }),
        ).map(([key, value]) => {
            const { userName, userType, userPhone } = value[0];
            return {
                key: key,
                userName,
                userType,
                userPhone,
                usageStatus: value.map(({ communityName, usageCount, usageTime, usageTimeString, additionalUsageCount, additionalUsageTime, viewProperty }) => {
                    return {
                        communityName,
                        usageCount,
                        usageTime,
                        usageTimeString,
                        additionalUsageCount,
                        additionalUsageTime,
                        viewProperty,
                    };
                }),
            };
        });

        return {
            communities: communities.map(value => value.name),
            usageByUser,
            usageByHouseHold: groupBy2depth,
        };
    }

    async getTimeLimitReservationDetail(payload: AdminTokenPayload) {
        const reservationDetail = await this.communityClubRepository.findCommunityClubWithReservation(this.communityClubValidator.findCommunityClubWithReservation(payload.apartmentId));

        return reservationDetail.map(value => ({
            id: value.id,
            name: value.name,
            CommunityClubTimeLimit: value.CommunityClubTimeLimit,
            reservation: applicationGroupBy(value.Reservation, value => value.startDate.toISOString().split('T')[0]),
        }));
    }

    async getCommunityClubs(payload: AdminTokenPayload) {
        return this.communityClubRepository.getCommunityClubsAdmin(payload.apartmentId);
    }

    async getReservationByCommunityClub(communityClubId: number) {
        return this.reservationRepository.getReservationByCommunityClub(communityClubId);
    }

    async deleteCommunity(payload: AdminTokenPayload, id: number) {
        const community = await this.communityClubRepository.deleteCommunity(id);

        await this.apiService.createAuditLog(payload.apartmentId, {
            action: 'DELETE',
            menu: '시설 예약',
            content: JSON.stringify(community),
            timestamp: new Date(),
            issuer: payload.id,
        });
        return community;
    }

    async updateCommunity(payload: AdminTokenPayload, id: number, body: UpdateCommunityBody) {
        const imageUrl = body.image ? await this.getImagePutUrl() : undefined;
        const community = await this.communityClubRepository.updateCommunity(id, body, imageUrl?.databaseUrl).then(value => ({
            ...value,
            image: imageUrl?.presignedUrl,
        }));

        await this.apiService.createAuditLog(payload.apartmentId, {
            action: 'DELETE',
            menu: '시설 예약',
            content: JSON.stringify(community),
            timestamp: new Date(),
            issuer: payload.id,
        });
        return community;
    }

    async approveReservation(payload: AdminTokenPayload, id: number, inputData: PatchReservationBody) {
        const reservation = await this.reservationRepository.getReservationById(id);
        if (!reservation) throw new NotFoundException();
        const statusMessage = {
            ACCEPTED: '승인',
            REJECTED: '거절',
        };

        const result = await this.communityClubRepository.approveReservation(id, inputData);
        await this.notificationRepository.notification(reservation.userId, `예약이 ${statusMessage[inputData.status]}되었습니다.`);

        await this.apiService.createAuditLog(payload.apartmentId, {
            action: 'UPDATE',
            menu: '시설 예약',
            content: JSON.stringify(result),
            timestamp: new Date(),
            issuer: payload.id,
        });
        return result;
    }

    async searchReservation(apartmentId: number, query: QueryDto) {
        const communities = await this.communityClubRepository.reservationAfterNow(this.communityClubValidator.reservationAfterNowValidator(apartmentId));

        return (
            await this.reservationRepository.searchReservation(
                communities.map(v => v.id),
                query,
            )
        ).map(ReservationDto.from);
    }
}
