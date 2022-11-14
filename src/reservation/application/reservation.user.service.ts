import { Injectable } from '@nestjs/common';
import { GetHistoryBySearchType } from '../interface/reservation.interface';
import { ReservationUserServiceLogic } from './reservation.user.service.logic';

@Injectable()
export class ReservationUserService {
  constructor(private reservationServiceLogic: ReservationUserServiceLogic) {}

  helloReservation() {
    return this.reservationServiceLogic.helloReservation();
  }

  getTodayReservation(userId: number) {
    return this.reservationServiceLogic.getTodayReservation(userId);
  }

  findReservationByCommunity(userId: number) {
    return this.reservationServiceLogic.findReservationByCommunity(userId);
  }

  getHistoryByQueryType(userId: number, searchType: GetHistoryBySearchType) {
    return this.reservationServiceLogic.getHistoryByQueryType(
      userId,
      searchType,
    );
  }
}
