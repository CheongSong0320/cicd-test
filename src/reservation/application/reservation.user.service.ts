import { UserTokenPayload } from '@hanwha-sbi/nestjs-authorization';
import { Injectable } from '@nestjs/common';
import {
  GetHistoryBySearchType,
  MakeReservationBody,
  UpdateReservationQuery,
  GetAvailableDateParam,
  GetTimeTableQuery,
  GetAvailableDateQuery,
  GetAvailableSlotQuery,
  GetAvailableSeatQuery,
  GetReservationHistoryQuery,
  RegisterReservationBody,
  GetReservationQuery,
} from '../interface/reservation.interface';
import { ReservationUserServiceLogic } from './reservation.user.service.logic';

@Injectable()
export class ReservationUserService {
  constructor(private reservationServiceLogic: ReservationUserServiceLogic) {}

  findUniqueReservation(id: number) {
    return this.reservationServiceLogic.findUniqueReservation(+id);
  }

  helloReservation() {
    return this.reservationServiceLogic.helloReservation();
  }

  getTodayReservation(userId: string, query: GetReservationQuery) {
    return this.reservationServiceLogic.getTodayReservation(userId, query);
  }

  findReservationByCommunity(userId: string) {
    return this.reservationServiceLogic.findReservationByCommunity(userId);
  }

  getHistoryByQueryType(userId: string, query: GetReservationHistoryQuery) {
    return this.reservationServiceLogic.getHistoryByQueryType(userId, query);
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

  updateReservation(id: number, body: MakeReservationBody) {
    return this.reservationServiceLogic.updateReservation(id, body);
  }

  getTimeTable(id: number, query: GetTimeTableQuery) {
    return this.reservationServiceLogic.getTimeTable(id, query);
  }

  getAvailableDate(id: number, query: GetAvailableDateQuery) {
    return this.reservationServiceLogic.getAvailableDate(id, query);
  }

  getAvailableSlot(id: number, query: GetAvailableSlotQuery) {
    return this.reservationServiceLogic.getAvailableSlot(id, query);
  }

  getAvailableSeat(id: number, query: GetAvailableSeatQuery) {
    return this.reservationServiceLogic.getAvailableSeat(id, query);
  }

  getCommunityById(id: number) {
    return this.reservationServiceLogic.getCommunityById(id);
  }

  registerReservation(
    id: number,
    body: RegisterReservationBody,
    payload: UserTokenPayload,
  ) {
    return this.reservationServiceLogic.registerReservation(+id, body, payload);
  }
}
