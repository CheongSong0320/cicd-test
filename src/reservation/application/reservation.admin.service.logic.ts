import { Injectable } from '@nestjs/common';
import { ReservationRepository } from '../infrastructure/repository/reservation.repository';

@Injectable()
export class ReservationAdminServiceLogic {
  constructor(private reservationRepository: ReservationRepository) {}

  helloReservation() {
    return this.reservationRepository.find();
  }
}
