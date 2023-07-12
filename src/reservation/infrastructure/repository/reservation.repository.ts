import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService, ReadOnlyPrismaService } from 'src/providers/prisma.service';
import { QueryDto } from 'src/reservation/application/dto/admin/searchReservation.dto';
import { MakeReservationBody } from 'src/reservation/interface/reservation.interface';
import { ReservationValidator } from '../validator/reservation.validator';

@Injectable()
export class ReservationRepository {
    constructor(private prisma: PrismaService, private readOnlyPrismaService: ReadOnlyPrismaService) {
        prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
            console.log('Query: ' + event.params);
            console.log('Duration: ' + event.duration + 'ms');
        });

        this.readOnlyPrismaService.$on<any>('query', (event: Prisma.QueryEvent) => {
            console.log('Query: ' + event.params);
            console.log('Duration: ' + event.duration + 'ms');
        });
    }

    findMany() {
        return this.readOnlyPrismaService.reservation.findMany();
    }

    findByCommunityClubIds(args: ReturnType<ReservationValidator['findByCommunityClubIds']>) {
        return this.readOnlyPrismaService.reservation.findMany(args);
    }

    findWithCommunityClub(args: ReturnType<ReservationValidator['findWithCommunityClub']>) {
        return this.readOnlyPrismaService.reservation.findMany(args);
    }

    findTodayReservation(args: ReturnType<ReservationValidator['findTodayReservation']>) {
        return this.readOnlyPrismaService.reservation.findMany(args);
    }

    findReservationByCommunity(args: ReturnType<ReservationValidator['findReservationByCommunity']>) {
        return this.readOnlyPrismaService.reservation.findMany(args);
    }

    getHistoryByQueryType(args: ReturnType<ReservationValidator['getHistoryByQueryType']>) {
        return this.readOnlyPrismaService.reservation.findMany(args);
    }

    getCommunityClub(args: ReturnType<ReservationValidator['getCommunityClub']>) {
        return this.readOnlyPrismaService.communityClub.findMany(args);
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

    getReservationById(id: number) {
        return this.readOnlyPrismaService.reservation.findUnique({
            where: {
                id,
            },
        });
    }

    getReservationByCommunityClub(communityClubId: number) {
        return this.readOnlyPrismaService.reservation.findMany({
            where: {
                communityClubId,
            },
            orderBy: {
                id: 'asc',
            },
        });
    }

    getReservationCountByDate(communityClubId: number, startDate: Date, endDate: Date, seatId?: number) {
        return this.readOnlyPrismaService.reservation.count({
            where: {
                communityClubId,
                startDate: {
                    gte: startDate,
                },
                endDate: {
                    lt: endDate,
                },
                status: {
                    in: ['ACCEPTED', 'PENDING'],
                },
                seatNumber: seatId,
            },
        });
    }

    getReservationCountByResident(communityClubId: number, startDate: Date, endDate: Date, dong?: string, ho?: string, userId?: string) {
        return this.readOnlyPrismaService.reservation.count({
            where: {
                communityClubId,
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
                status: {
                    in: ['ACCEPTED', 'PENDING'],
                },
                dong,
                ho,
                userId,
            },
        });
    }

    findReservationByDate(startDate: Date, endDate: Date) {
        return this.readOnlyPrismaService.reservation.findMany({
            where: {
                status: {
                    in: ['ACCEPTED', 'PENDING'],
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
        return this.readOnlyPrismaService.reservation.findMany({
            where: {
                AND: {
                    communityClubId,
                    seatNumber: seat ? +seat : seat,
                    status: {
                        in: ['ACCEPTED', 'PENDING'],
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
        return this.readOnlyPrismaService.reservation.findUnique({
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

    searchReservation(communityIds: number[], query: QueryDto) {
        const statusUpdateFrom = query.fromStatusUpdateDate
            ? {
                  gt: query.fromStatusUpdateDate,
              }
            : undefined;

        const statusUpdateTo = query.toStatusUpdateDate
            ? {
                  lte: query.toStatusUpdateDate,
              }
            : undefined;
        const statusUpdateDate = Object.assign({}, statusUpdateFrom, statusUpdateTo);
        return this.readOnlyPrismaService.reservation.findMany({
            where: {
                AND: {
                    communityClubId: {
                        in: communityIds,
                    },
                    endDate: {
                        gt: query.now,
                    },
                    statusUpdateDate,
                },
            },
            include: {
                CommunityClub: true,
            },
        });
    }
}
