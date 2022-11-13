import { Injectable } from '@nestjs/common';
import {
  GetCommunityUsageStatusDetailParam,
  GetCommunityUsageStatusParam,
  RegisterCommunityBody,
  GetReservationDetailParam,
} from '../interface/community.interface';
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

  getCommunityUsageStatus(param: GetCommunityUsageStatusParam) {
    return this.reservationServiceLogic.getCommunityUsageStatus(param);
  }

  getCommunityUsageStatusDetail(
    param: GetCommunityUsageStatusDetailParam,
    dong: string,
    ho: string,
  ) {
    return this.reservationServiceLogic.getCommunityUsageStatusDetail(
      param,
      dong,
      ho,
    );
  }

  getTimeLimitReservationDetail(param: GetReservationDetailParam) {
    return this.reservationServiceLogic.getTimeLimitReservationDetail(param);
  }
}
