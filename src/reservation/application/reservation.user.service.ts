import { Injectable } from '@nestjs/common';
import { ReservationServiceLogic } from './reservation.user.service.logic';

@Injectable()
export class ReservationService {
  constructor(private reservationServiceLogic: ReservationServiceLogic) {}

  helloReservation() {
    return this.reservationServiceLogic.helloReservation();
  }
}
