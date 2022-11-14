import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  API_USER,
  Auth,
  JwtPayload,
  UserTokenPayload,
  AdminTokenPayload,
} from '@hanwha-sbi/nestjs-authorization';
import { ReservationUserService } from '../application/reservation.user.service';
import { GetHistoryBySearchType } from '../interface/reservation.interface';

@Controller('reservation')
export class ReservationUserController {
  constructor(private readonly reservationService: ReservationUserService) {}

  @Get()
  @Auth(API_USER)
  findReservationByCommunity(@JwtPayload() payload: UserTokenPayload) {
    return this.reservationService.findReservationByCommunity(
      parseInt(payload.id, 10),
    );
  }

  @Get('/today')
  @Auth(API_USER)
  getTodayReservation(@JwtPayload() payload: UserTokenPayload) {
    return this.reservationService.getTodayReservation(
      parseInt(payload.id, 10),
    );
  }

  @Get('history')
  @Auth(API_USER)
  getHistoryByQueryType(
    @JwtPayload() payload: UserTokenPayload,
    @Query('searchType') searchType: GetHistoryBySearchType,
  ) {
    return this.reservationService.getHistoryByQueryType(
      parseInt(payload.id, 10),
      searchType,
    );
  }
}
