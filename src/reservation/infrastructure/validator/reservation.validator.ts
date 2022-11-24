// Prisma.validator<Prisma.ReservationGroupByArgs>;
import { UserTokenPayload } from '@hanwha-sbi/nestjs-authorization';
import { Injectable } from '@nestjs/common';
import { CommunityClub, Prisma, ReservationStatus } from '@prisma/client';
import { MakeReservationBody, UpdateReservationBody } from 'src/reservation/interface/reservation.interface';
import { getDayCalculas } from '../util/dateUtil';

@Injectable()
export class ReservationValidator {
    findByCommunityClubIds(ids: number[], year: number, month: number) {
        const now = new Date();
        return Prisma.validator<Prisma.ReservationFindManyArgs>()({
            where: {
                communityClubId: {
                    in: ids,
                },
                startDate: {
                    gte: new Date(year, month, 1),
                },
                endDate: {
                    lt: new Date(year, month + 1, 1),
                },
                CommunityClub: {
                    active: true,
                },
            },
            orderBy: {
                id: 'asc',
            },
        });
    }

    findByCommunityClubIdsAndGroupBy(ids: number[]) {
        const now = new Date();
        return Prisma.validator<Prisma.ReservationGroupByArgs>()({
            by: ['communityClubId'],
            where: {
                communityClubId: {
                    in: ids,
                },
                status: 'READY',
                startDate: {
                    gte: new Date(now.getFullYear(), now.getMonth(), 1),
                },
                endDate: {
                    lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
                },
                CommunityClub: {
                    active: true,
                },
            },
            _count: {
                _all: true,
            },
        });
    }

    findWithCommunityClub(ids: number[], dong: string, ho: string, dateFrom?: string, dateTo?: string) {
        return Prisma.validator<Prisma.ReservationFindManyArgs>()({
            where: {
                communityClubId: {
                    in: ids,
                },
                dong,
                ho,
                startDate: {
                    gte: dateFrom,
                },
                endDate: {
                    lt: dateTo,
                },
                CommunityClub: {
                    active: true,
                },
            },
            select: {
                id: true,
                startDate: true,
                endDate: true,
                userName: true,
                userType: true,
                userPhone: true,
                userId: true,
                dong: true,
                ho: true,
                communityClubId: true,
                CommunityClub: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                id: 'asc',
            },
        });
    }

    findTodayReservation(userId: string, startDate: Date, endDate: Date) {
        return Prisma.validator<Prisma.ReservationFindManyArgs>()({
            where: {
                userId,
                startDate: {
                    gte: startDate,
                },
                endDate: {
                    lt: endDate,
                },
                status: {
                    in: ['READY', 'PENDING'],
                },
                CommunityClub: {
                    active: true,
                },
            },
            select: {
                id: true,
                startDate: true,
                endDate: true,
                seatNumber: true,
                CommunityClub: {
                    select: {
                        name: true,
                        active: true,
                    },
                },
            },
            orderBy: {
                id: 'asc',
            },
        });
    }

    findReservationByCommunity(userId: string) {
        return Prisma.validator<Prisma.ReservationFindManyArgs>()({
            where: {
                startDate: {
                    gte: getDayCalculas(0),
                },
                status: {
                    not: 'CANCELLED',
                },
                userId,
                CommunityClub: {
                    active: true,
                },
            },
            select: {
                id: true,
                startDate: true,
                endDate: true,
                seatNumber: true,
                communityClubId: true,
                CommunityClub: {
                    select: {
                        name: true,
                        active: true,
                    },
                },
            },
        });
    }

    getHistoryByQueryType(userId: string, date?: Date, communityId?: string) {
        return Prisma.validator<Prisma.ReservationFindManyArgs>()({
            where: {
                userId,
                startDate: {
                    gte: date ? getDayCalculas(0, date) : getDayCalculas(-31),
                },
                endDate: {
                    lt: date ? getDayCalculas(1, date) : getDayCalculas(1),
                },
                communityClubId: {
                    equals: communityId ? +communityId : undefined,
                },
                status: {
                    not: 'CANCELLED',
                },
                CommunityClub: {
                    active: true,
                },
            },
            include: {
                CommunityClub: true,
            },
        });
    }

    getCommunityClub(apartmentId: number) {
        return Prisma.validator<Prisma.CommunityClubFindManyArgs>()({
            where: {
                apartmentId,
                active: true,
            },
            include: {
                CommunityClubPerson: true,
                CommunityClubSeat: true,
                CommunityClubTimeLimit: true,
            },
        });
    }

    makeReservation(payload: UserTokenPayload, { startDate, endDate, seatNumber, communityClubId }: MakeReservationBody, community: CommunityClub, status: ReservationStatus) {
        return Prisma.validator<Prisma.ReservationCreateArgs>()({
            data: {
                startDate,
                endDate,
                seatNumber,
                userId: payload.id,
                dong: payload.apartment!.resident.dong,
                ho: payload.apartment!.resident.ho,
                userName: payload.user.name,
                userType: payload.apartment!.resident.type,
                userPhone: payload.user.phone,
                status,
                communityClubId,
            },
        });
    }

    deleteReservation(id: number) {
        return Prisma.validator<Prisma.ReservationUpdateArgs>()({
            data: {
                status: 'CANCELLED',
            },
            where: {
                id,
            },
        });
    }

    updateReservation(id: number, body: UpdateReservationBody) {
        return Prisma.validator<Prisma.ReservationUpdateArgs>()({
            data: {
                ...body,
            },
            where: {
                id,
            },
        });
    }
}
