import { Injectable } from '@nestjs/common';
import { ReservationUserServiceLogic } from './reservation.user.service.logic';

@Injectable()
export class ReservationUserService {
  constructor(private reservationServiceLogic: ReservationUserServiceLogic) {}

  helloReservation() {
    return this.reservationServiceLogic.helloReservation();
  }
}
