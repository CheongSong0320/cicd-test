import { UserTokenPayload } from '@hanwha-sbi/nestjs-authorization';
import { Injectable } from '@nestjs/common';
import {
  GetUnavailableDateQuery,
  GetHistoryBySearchType,
  MakeReservationBody,
  UpdateReservationBody,
  UpdateReservationQuery,
  GetAvailableDateParam,
  GetUnavailableDateByTimePriorityQuery,
  GetTimeTableQuery,
  GetAvailableDateQuery,
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

  getunAvailableDate(id: number, query: GetUnavailableDateQuery) {
    return this.reservationServiceLogic.getUnavailableDate(id, query);
  }

  getUnavailableDateByTimePriority(
    id: number,
    {
      year,
      month,
      day,
      startTime,
      endTime,
    }: GetUnavailableDateByTimePriorityQuery,
  ) {
    return this.reservationServiceLogic.getUnavailableDateByTimePriority(id, {
      year: +year,
      month: +month,
      day: +day,
      startTime,
      endTime,
    });
  }

  getTimeTable(id: number, query: GetTimeTableQuery) {
    return this.reservationServiceLogic.getTimeTable(id, query);
  }

  getAvailableDate(id: number, query: GetAvailableDateQuery) {
    return this.reservationServiceLogic.getAvailableDate(id, query);
  }
}
