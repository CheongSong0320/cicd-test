// Prisma.validator<Prisma.ReservationGroupByArgs>;
import { UserTokenPayload } from '@hanwha-sbi/nestjs-authorization';
import { Injectable } from '@nestjs/common';
import { Prisma, ReservationStatus } from '@prisma/client';
import { MakeReservationBody, UpdateReservationBody } from 'src/reservation/interface/reservation.interface';
import { getDayCalculas } from '../util/date.util';

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
                status: {
                    in: ['ACCEPTED', 'PENDING'],
                },
            },
            orderBy: {
                id: 'asc',
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
                status: {
                    in: ['ACCEPTED', 'PENDING'],
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
                    lte: endDate,
                },
                status: {
                    in: ['ACCEPTED', 'PENDING'],
                },
                CommunityClub: {
                    active: true,
                },
            },
            include: {
                CommunityClub: {
                    include: {
                        CommunityClubPerson: true,
                        CommunityClubSeat: true,
                        CommunityClubTimeLimit: true,
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
                    in: ['ACCEPTED', 'PENDING'],
                },
                userId,
                CommunityClub: {
                    active: true,
                },
            },
            include: {
                CommunityClub: {
                    include: {
                        CommunityClubPerson: true,
                        CommunityClubSeat: true,
                        CommunityClubTimeLimit: true,
                    },
                },
            },
        });
    }

    getHistoryByQueryType(userId: string, dateFrom?: string, dateTo?: string, communityId?: string) {
        return Prisma.validator<Prisma.ReservationFindManyArgs>()({
            where: {
                userId,
                startDate: {
                    gte: dateFrom,
                },
                endDate: {
                    lt: dateTo,
                },
                communityClubId: {
                    equals: communityId ? +communityId : undefined,
                },
                status: {
                    in: ['ACCEPTED', 'PENDING'],
                },
                CommunityClub: {
                    active: true,
                },
            },
            include: {
                CommunityClub: {
                    include: {
                        CommunityClubPerson: true,
                        CommunityClubSeat: true,
                        CommunityClubTimeLimit: true,
                    },
                },
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

    makeReservation(payload: UserTokenPayload, { startDate, endDate, seatNumber, communityClubId }: MakeReservationBody, status: ReservationStatus) {
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
