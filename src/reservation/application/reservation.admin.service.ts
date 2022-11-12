import { Injectable } from '@nestjs/common';
import { ReservationAdminServiceLogic } from './reservation.admin.service.logic';

@Injectable()
export class ReservationAdminService {
  constructor(private reservationServiceLogic: ReservationAdminServiceLogic) {}

  helloReservation() {
    return this.reservationServiceLogic.helloReservation();
  }
}
