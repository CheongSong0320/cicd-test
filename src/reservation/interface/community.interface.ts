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

export interface IRegisterCommunityPersonType {
  communityClub: Omit<CommunityClub, 'id'>;
  communityClubPerson: Omit<CommunityClubPerson, 'id' | 'community_club_id'>;
  type: typeof CommunityClubType['PERSON'];
}

export interface IRegisterCommunitySeatType {
  communityClub: Omit<CommunityClub, 'id'>;
  communityClubSeat: Omit<CommunityClubSeat, 'id' | 'community_club_id'>;
  type: typeof CommunityClubType['SEAT'];
}

export interface IRegisterCommunityTimeLimitSeatType {
  communityClub: Omit<CommunityClub, 'id'>;
  communityClubTimeLimit: Omit<
    CommunityClubTimeLimit,
    'id' | 'community_club_id'
  >;
  type: typeof CommunityClubType['SEAT_TIME_LMIT'];
}

export interface GetCommunityUsageStatusParam {
  apartmentId: string;
}

export interface GetCommunityUsageStatusDetailParam {
  apartmentId: string;
}

export interface CommunityUsageStatusType {
  communityClubId: number;
  communityName: string;
  usageCount: number;
  usageTime: number;
  viewProperty: 'usageCount' | 'usageTime';
}

export interface GetReservationDetailParam {
  apartmentId: string;
}
