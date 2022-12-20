import { Injectable } from '@nestjs/common';
import { Prisma, Reservation } from '@prisma/client';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/providers/prisma.service';
import { MakeReservationBody } from 'src/reservation/interface/reservation.interface';
import { getDayCalculas, setYearMonthDbDate } from '../util/date.util';
import { ReservationValidator } from '../validator/reservation.validator';

@Injectable()
export class ReservationRepository {
    constructor(private prisma: PrismaService) {
        prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
            console.log('Query: ' + event.params);
            console.log('Duration: ' + event.duration + 'ms');
        });
    }

    findMany() {
        return this.prisma.reservation.findMany();
    }

    findByCommunityClubIds(args: ReturnType<ReservationValidator['findByCommunityClubIds']>) {
        return this.prisma.reservation.findMany(args);
    }

    findByCommunityClubIdsAndGroupBy(args: ReturnType<ReservationValidator['findByCommunityClubIdsAndGroupBy']>) {
        return this.prisma.reservation.groupBy(args);
    }

    findWithCommunityClub(args: ReturnType<ReservationValidator['findWithCommunityClub']>) {
        return this.prisma.reservation.findMany(args);
    }

    findTodayReservation(args: ReturnType<ReservationValidator['findTodayReservation']>) {
        return this.prisma.reservation.findMany(args);
    }

    findReservationByCommunity(args: ReturnType<ReservationValidator['findReservationByCommunity']>) {
        return this.prisma.reservation.findMany(args);
    }

    getHistoryByQueryType(args: ReturnType<ReservationValidator['getHistoryByQueryType']>) {
        return this.prisma.reservation.findMany(args);
    }

    getCommunityClub(args: ReturnType<ReservationValidator['getCommunityClub']>) {
        return this.prisma.communityClub.findMany(args);
    }

    makeReservation(args: ReturnType<ReservationValidator['makeReservation']>) {
        return this.prisma.reservation.create(args);
    }

    deleteReservation(args: ReturnType<ReservationValidator['deleteReservation']>) {
        return this.prisma.reservation.update(args);
    }

    updateReservation(id: number, body: MakeReservationBody) {
        return this.prisma.reservation.update({
            where: {
                id,
            },
            data: {
                startDate: body.startDate,
                endDate: body.endDate,
                seatNumber: body.seatNumber,
            },
        });
    }

    getReservationByCommunityClub(communityClubId: number) {
        return this.prisma.reservation.findMany({
            where: {
                communityClubId,
            },
            orderBy: {
                id: 'asc',
            },
        });
    }

    getReservationCountByDate(communityClubId: number, startDate: Date, endDate: Date, seatId?: number) {
        return this.prisma.reservation.count({
            where: {
                communityClubId,
                startDate: {
                    gte: startDate,
                },
                endDate: {
                    lt: endDate,
                },
                status: {
                    not: 'CANCELLED',
                },
                seatNumber: seatId,
            },
        });
    }

    getReservationCountByResident(communityClubId: number, startDate: Date, endDate: Date, dong?: string, ho?: string, userId?: string) {
        return this.prisma.reservation.count({
            where: {
                communityClubId,
                startDate: {
                    gte: startDate,
                },
                endDate: {
                    lt: endDate,
                },
                status: {
                    not: 'CANCELLED',
                },
                dong,
                ho,
                userId,
            },
        });
    }

    findReservationByDate(startDate: Date, endDate: Date) {
        return this.prisma.reservation.findMany({
            where: {
                status: {
                    not: 'CANCELLED',
                },
                startDate: {
                    gte: startDate,
                },
                endDate: {
                    lt: endDate,
                },
            },
        });
    }

    getAvailableDate(communityClubId: number, startDate: Date | string, endDate: Date | string, seat?: number) {
        return this.prisma.reservation.findMany({
            where: {
                AND: {
                    communityClubId,
                    seatNumber: seat ? +seat : seat,
                    status: {
                        not: 'CANCELLED',
                    },
                },

                OR: [
                    {
                        startDate: {
                            gte: startDate,
                            lt: endDate,
                        },
                    },
                    {
                        endDate: {
                            gte: startDate,
                            lt: endDate,
                        },
                    },
                ],
            },
        });
    }

    findUniqueReservation(id: number) {
        return this.prisma.reservation.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                startDate: true,
                endDate: true,
                seatNumber: true,
                CommunityClub: {
                    select: {
                        memo: true,
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    reservationAfterNow(communityIds: number[], now: string) {
        return this.prisma.reservation.findMany({
            where: {
                AND: {
                    communityClubId: {
                        in: communityIds,
                    },
                    endDate: {
                        gt: now,
                    },
                },
            },
            include: {
                CommunityClub: true,
            },
        });
    }
}
