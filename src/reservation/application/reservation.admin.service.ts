import { AdminTokenPayload } from '@hanwha-sbi/nestjs-authorization';
import { Injectable } from '@nestjs/common';
import { RegisterCommunityBody } from '../interface/community.interface';
import { ReservationAdminServiceLogic } from './reservation.admin.service.logic';

@Injectable()
export class ReservationAdminService {
  constructor(private reservationServiceLogic: ReservationAdminServiceLogic) {}

  helloReservation() {
    return this.reservationServiceLogic.helloReservation();
  }

  registerCommunity(body: RegisterCommunityBody) {
    return this.reservationServiceLogic.registerCommunity(body);
  }

  getCommunityUsageStatus(payload: AdminTokenPayload) {
    return this.reservationServiceLogic.getCommunityUsageStatus(payload);
  }

  getCommunityUsageStatusDetail(
    payload: AdminTokenPayload,
    dong: string,
    ho: string,
  ) {
    return this.reservationServiceLogic.getCommunityUsageStatusDetail(
      payload,
      dong,
      ho,
    );
  }

  getTimeLimitReservationDetail(payload: AdminTokenPayload) {
    return this.reservationServiceLogic.getTimeLimitReservationDetail(payload);
  }
}
