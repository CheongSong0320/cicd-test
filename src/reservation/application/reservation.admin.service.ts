import { AdminTokenPayload } from '@hanwha-sbi/nestjs-authorization';
import { Injectable } from '@nestjs/common';
import { RegisterCommunityBody, UpdateCommunityBody } from '../interface/community.interface';
import { GetCommunityUsageStatusDetailQuery } from '../interface/getCommunityUsageStatusDetail.dto';
import { ReservationAdminServiceLogic } from './reservation.admin.service.logic';

@Injectable()
export class ReservationAdminService {
    constructor(private reservationServiceLogic: ReservationAdminServiceLogic) {}

    registerCommunity(body: RegisterCommunityBody, paylaoad: AdminTokenPayload) {
        return this.reservationServiceLogic.registerCommunity(body, paylaoad);
    }

    getCommunityUsageStatus(payload: AdminTokenPayload, year: number, month: number) {
        return this.reservationServiceLogic.getCommunityUsageStatus(payload, year, month);
    }

    getCommunityUsageStatusDetail(payload: AdminTokenPayload, query: GetCommunityUsageStatusDetailQuery) {
        return this.reservationServiceLogic.getCommunityUsageStatusDetail(payload, query);
    }

    getTimeLimitReservationDetail(payload: AdminTokenPayload) {
        return this.reservationServiceLogic.getTimeLimitReservationDetail(payload);
    }

    getCommunityClubs(payload: AdminTokenPayload) {
        return this.reservationServiceLogic.getCommunityClubs(payload);
    }

    getReservationByCommunityClub(payload: AdminTokenPayload, communityClubId: number) {
        return this.reservationServiceLogic.getReservationByCommunityClub(communityClubId);
    }

    deleteCommunity(id: number) {
        return this.reservationServiceLogic.deleteCommunity(id);
    }

    updateCommunity(id: number, body: UpdateCommunityBody) {
        return this.reservationServiceLogic.updateCommunity(id, body);
    }

    approveReservation(id: number) {
        return this.reservationServiceLogic.approveReservation(id);
    }
}
