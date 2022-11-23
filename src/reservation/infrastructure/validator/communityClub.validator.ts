import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RegisterCommunityBody } from 'src/reservation/interface/community.interface';

@Injectable()
export class CommunityClubValidator {
  registerCommunityClubValidator(
    body: RegisterCommunityBody,
    apartmentId: number,
    image: string | undefined,
  ) {
    return Prisma.validator<Prisma.CommunityClubCreateArgs>()({
      data: {
        ...body.communityClub,
        image,
        apartmentId,
        CommunityClubPerson:
          body.type === 'PERSON'
            ? { create: body.communityClubPerson }
            : undefined,
        CommunityClubSeat:
          body.type === 'SEAT' ? { create: body.communityClubSeat } : undefined,
        CommunityClubTimeLimit:
          body.type === 'SEAT_TIME_LMIT' || body.type === 'PERSON_TIME_LIMIT'
            ? { create: body.communityClubTimeLimit }
            : undefined,
      },
      include: {
        CommunityClubPerson: true,
        CommunityClubSeat: true,
        CommunityClubTimeLimit: true,
      },
    });
  }

  findByApartmentIdValidator(apartmentId: number) {
    return Prisma.validator<Prisma.CommunityClubFindManyArgs>()({
      where: {
        apartmentId: apartmentId,
        active: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  findCommunityClubWithReservation(apartmentId: number) {
    return Prisma.validator<Prisma.CommunityClubFindManyArgs>()({
      where: {
        apartmentId,
        type: 'SEAT_TIME_LMIT',
        active: true,
      },

      select: {
        id: true,
        name: true,
        Reservation: true,
        image: true,
        CommunityClubTimeLimit: {
          select: {
            openTime: true,
            closedTime: true,
            reservationTimeInterval: true,
          },
        },
      },

      orderBy: {
        id: 'asc',
      },
    });
  }
}
