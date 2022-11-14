import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RegisterCommunityBody } from 'src/reservation/interface/community.interface';

@Injectable()
export class CommunityClubValidator {
  registerCommunityClubValidator(body: RegisterCommunityBody) {
    return Prisma.validator<Prisma.CommunityClubCreateArgs>()({
      data: {
        ...body.communityClub,
        CommunityClubPerson:
          body.type === 'PERSON'
            ? { create: body.communityClubPerson }
            : undefined,
        CommunityClubSeat:
          body.type === 'SEAT' ? { create: body.communityClubSeat } : undefined,
        CommunityClubTimeLimit:
          body.type === 'SEAT_TIME_LMIT'
            ? { create: body.communityClubTimeLimit }
            : undefined,
      },
    });
  }

  findByApartmentIdValidator(apartmentId: number) {
    return Prisma.validator<Prisma.CommunityClubFindManyArgs>()({
      where: {
        apartmentId: apartmentId,
      },
    });
  }

  findCommunityClubWithReservation(apartmentId: number) {
    return Prisma.validator<Prisma.CommunityClubFindManyArgs>()({
      where: {
        apartmentId,
        type: 'SEAT_TIME_LMIT',
      },

      select: {
        id: true,
        name: true,
        Reservation: true,
        CommunityClubTimeLimit: {
          select: {
            openTime: true,
            closedTime: true,
            reservationTimeInterval: true,
          },
        },
      },
    });
  }
}
