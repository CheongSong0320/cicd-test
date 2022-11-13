import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  GetCommunityUsageStatusDetailParam,
  GetCommunityUsageStatusParam,
  RegisterCommunityBody,
} from 'src/reservation/interface/community.interface';

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

  findByApartmentIdValidator(
    param: GetCommunityUsageStatusParam | GetCommunityUsageStatusDetailParam,
  ) {
    console.log(param.apartmentId);
    console.log(param);
    console.log(parseInt(param.apartmentId, 10));
    return Prisma.validator<Prisma.CommunityClubFindManyArgs>()({
      where: {
        apartmentId: parseInt(param.apartmentId, 10),
      },
    });
  }
}
