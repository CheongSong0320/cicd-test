import { CommunityClub, CommunityClubPerson, CommunityClubSeat, CommunityClubTimeLimit } from '@prisma/client';

const getCommunityMaxCount = (
    community: CommunityClub & {
        CommunityClubPerson: CommunityClubPerson;
        CommunityClubSeat: CommunityClubSeat;
        CommunityClubTimeLimit: CommunityClubTimeLimit;
    },
) => (community.type === 'PERSON' ? community.CommunityClubPerson.maxCount : community.type === 'SEAT' ? community.CommunityClubSeat.maxCount : community.CommunityClubTimeLimit.maxCount);
