import { Injectable } from '@nestjs/common';
import { ReservationStatus } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma.service';
import { UpdateCommunityBody } from 'src/reservation/interface/community.interface';
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
      include: {
        CommunityClubPerson: true,
        CommunityClubSeat: true,
        CommunityClubTimeLimit: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  deleteCommunity(id: number) {
    return this.prisma.communityClub.update({
      where: {
        id,
      },
      data: {
        active: false,
      },
      select: {
        id: true,
      },
    });
  }

  updateCommunity(id: number, body: UpdateCommunityBody) {
    console.log(body);
    return this.prisma.communityClub.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
      include: {
        CommunityClubPerson: true,
        CommunityClubSeat: true,
        CommunityClubTimeLimit: true,
      },
    });
  }

  approveReservation(id: number, status: ReservationStatus) {
    return this.prisma.reservation.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  findUniqueOrFail(id: number) {
    return this.prisma.reservation.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        status: true,
      },
    });
  }

  getCommunityById(id: number) {
    return this.prisma.communityClub.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }
}
