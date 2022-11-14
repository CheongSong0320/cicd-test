import { UserTokenPayload } from '@hanwha-sbi/nestjs-authorization';
import { Injectable } from '@nestjs/common';
import {
  GetHistoryBySearchType,
  MakeReservationBody,
  UpdateReservationBody,
  UpdateReservationQuery,
} from '../interface/reservation.interface';
import { ReservationUserServiceLogic } from './reservation.user.service.logic';

@Injectable()
export class ReservationUserService {
  constructor(private reservationServiceLogic: ReservationUserServiceLogic) {}

  helloReservation() {
    return this.reservationServiceLogic.helloReservation();
  }

  getTodayReservation(userId: string) {
    return this.reservationServiceLogic.getTodayReservation(userId);
  }

  findReservationByCommunity(userId: string) {
    return this.reservationServiceLogic.findReservationByCommunity(userId);
  }

  getHistoryByQueryType(userId: string, searchType: GetHistoryBySearchType) {
    return this.reservationServiceLogic.getHistoryByQueryType(
      userId,
      searchType,
    );
  }

  getCommunityClub(apartmentId: number) {
    return this.reservationServiceLogic.getCommunityClub(apartmentId);
  }

  makeReservation(payload: UserTokenPayload, body: MakeReservationBody) {
    return this.reservationServiceLogic.makeReservation(payload, body);
  }

  deleteReservation(id: number) {
    return this.reservationServiceLogic.deleteReservation(id);
  }

  updateReservation(
    query: UpdateReservationQuery,
    body: UpdateReservationBody,
  ) {
    return this.reservationServiceLogic.updateReservation(query, body);
  }
}
