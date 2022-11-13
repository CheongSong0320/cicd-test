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
}
