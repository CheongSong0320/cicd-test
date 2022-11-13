// Prisma.validator<Prisma.ReservationGroupByArgs>;
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReservationValidator {
  findByCommunityClubIdsAndGroupBy(ids: number[]) {
    const now = new Date();
    return Prisma.validator<Prisma.ReservationGroupByArgs>()({
      by: ['community_club_id', 'user_id'],
      orderBy: {
        user_id: 'asc',
      },
      where: {
        community_club_id: {
          in: ids,
        },
        start_date: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1),
        },
        end_date: {
          lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        },
      },
      _count: {
        _all: true,
      },
    });
  }

  findWithCommunityClub(ids: number[]) {
    return Prisma.validator<Prisma.ReservationFindManyArgs>()({
      where: {
        community_club_id: {
          in: ids,
        },
      },
      include: {
        CommunityClub: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
