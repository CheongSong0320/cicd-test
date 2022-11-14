import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma.service';
import { CommunityClubValidator } from '../validator/communityClub.validator';

@Injectable()
export class CommunityClubRepository {
  constructor(private prisma: PrismaService) {}

  create(
    communityClubCreateInput: ReturnType<
      CommunityClubValidator['registerCommunityClubValidator']
    >,
  ) {
    return this.prisma.communityClub.create(communityClubCreateInput);
  }

  findByApartmentId(
    communityClubFindManyInput: ReturnType<
      CommunityClubValidator['findByApartmentIdValidator']
    >,
  ) {
    return this.prisma.communityClub.findMany(communityClubFindManyInput);
  }

  findCommunityClubWithReservation(
    args: ReturnType<
      CommunityClubValidator['findCommunityClubWithReservation']
    >,
  ) {
    return this.prisma.communityClub.findMany(args);
  }

  findUniqueOrThrow(id: number) {
    return this.prisma.communityClub.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        CommunityClubPerson: true,
        CommunityClubSeat: true,
        CommunityClubTimeLimit: true,
      },
    });
  }

  findUniqueRelationType(id: number) {
    return this.prisma.communityClub.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        CommunityClubPerson: true,
        CommunityClubSeat: true,
        CommunityClubTimeLimit: true,
      },
    });
  }

  getCommunityClubsAdmin(apartmentId: number) {
    return this.prisma.communityClub.findMany({
      where: {
        apartmentId,
      },
      select: {
        id: true,
        name: true,
        CommunityClubPerson: true,
        CommunityClubSeat: true,
        CommunityClubTimeLimit: true,
      },
    });
  }
}
