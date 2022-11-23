import {
  CommunityClub,
  CommunityClubPerson,
  CommunityClubSeat,
  CommunityClubTimeLimit,
  CommunityClubType,
} from '@prisma/client';

export type RegisterCommunityBody =
  | IRegisterCommunityPersonType
  | IRegisterCommunitySeatType
  | IRegisterCommunityTimeLimitSeatType;

export class IRegisterCommunityPersonType {
  communityClub: Omit<CommunityClub, 'id' | 'apartmentId'>;
  communityClubPerson: Omit<CommunityClubPerson, 'id' | 'communityClubId'>;
  type: typeof CommunityClubType['PERSON'];
}

export class IRegisterCommunitySeatType {
  communityClub: Omit<CommunityClub, 'id' | 'apartmentId'>;
  communityClubSeat: Omit<CommunityClubSeat, 'id' | 'communityClubId'>;
  type: typeof CommunityClubType['SEAT'];
}

export class IRegisterCommunityTimeLimitSeatType {
  communityClub: Omit<CommunityClub, 'id' | 'apartmentId'>;
  communityClubTimeLimit: Omit<
    CommunityClubTimeLimit,
    'id' | 'community_club_id'
  >;
  type:
    | typeof CommunityClubType['SEAT_TIME_LMIT']
    | typeof CommunityClubType['PERSON_TIME_LIMIT'];
}

export class CommunityUsageStatusType {
  communityClubId: number;
  communityName: string;
  usageCount: number;
  usageTime: number;
  viewProperty: 'usageCount' | 'usageTime';
}

export class UpdateCommunityBody {
  memo?: string;
  name?: string;
  image?: string;
}
