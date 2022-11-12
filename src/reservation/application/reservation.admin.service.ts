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
}
