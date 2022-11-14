import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Put,
  Patch,
} from '@nestjs/common';
import {
  API_USER,
  Auth,
  JwtPayload,
  UserTokenPayload,
  AdminTokenPayload,
} from '@hanwha-sbi/nestjs-authorization';
import { ReservationUserService } from '../application/reservation.user.service';
import {
  DeleteReservationQuery,
  GetAvailableDateParam,
  GetUnavailableDateQuery,
  GetHistoryBySearchType,
  MakeReservationBody,
  UpdateReservationBody,
  UpdateReservationQuery,
  GetUnavailableDateByTimePriorityQuery,
} from '../interface/reservation.interface';

@Controller('reservation')
export class ReservationUserController {
  constructor(private readonly reservationService: ReservationUserService) {}

  @Get()
  @Auth(API_USER)
  findReservationByCommunity(@JwtPayload() payload: UserTokenPayload) {
    return this.reservationService.findReservationByCommunity(payload.id);
  }

  @Get('/today')
  @Auth(API_USER)
  getTodayReservation(@JwtPayload() payload: UserTokenPayload) {
    return this.reservationService.getTodayReservation(payload.id);
  }

  @Get('history')
  @Auth(API_USER)
  getHistoryByQueryType(
    @JwtPayload() payload: UserTokenPayload,
    @Query('searchType') searchType: GetHistoryBySearchType,
  ) {
    return this.reservationService.getHistoryByQueryType(
      payload.id,
      searchType,
    );
  }

  @Get('/community')
  @Auth(API_USER)
  getCommunityClub(@JwtPayload() payload: UserTokenPayload) {
    return this.reservationService.getCommunityClub(
      payload?.apartment?.id ?? 1,
    );
  }

  @Post()
  @Auth(API_USER)
  makeReservation(
    @JwtPayload() payload: UserTokenPayload,
    @Body() body: MakeReservationBody,
  ) {
    return this.reservationService.makeReservation(payload, body);
  }

  @Delete(':id')
  @Auth(API_USER)
  deleteReservation(
    @JwtPayload() payload: UserTokenPayload,
    @Query() query: DeleteReservationQuery,
  ) {
    return this.reservationService.deleteReservation(parseInt(query.id, 10));
  }

  @Patch(':id')
  @Auth(API_USER)
  updateReservation(
    @JwtPayload() payload: UserTokenPayload,
    @Query() query: UpdateReservationQuery,
    @Body() body: UpdateReservationBody,
  ) {
    return this.reservationService.updateReservation(query, body);
  }

  @Get('/community/:id/unavailable-date')
  @Auth(API_USER)
  getUnavailableDate(
    @Param() param: GetAvailableDateParam,
    @Query() query: GetUnavailableDateQuery,
  ) {
    return this.reservationService.getunAvailableDate(
      parseInt(param.id, 10),
      query,
    );
  }

  @Get('/community/:id/time-priority')
  @Auth(API_USER)
  getUnavailableDateByTimePriority(
    @Param() param: GetAvailableDateParam,
    @Query() query: GetUnavailableDateByTimePriorityQuery,
  ) {
    return this.reservationService.getUnavailableDateByTimePriority(
      +param.id,
      query,
    );
  }
}
