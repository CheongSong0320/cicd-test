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
  GetTimeTableParam,
  GetTimeTableQuery,
  GetAvailableDateQuery,
  GetAvailableSlotQuery,
  GetAvailableSeatQuery,
  GetReservationHistoryQuery,
  RegisterReservationBody,
} from '../interface/reservation.interface';
import { RegisterCommunityBody } from '../interface/community.interface';

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
    @Query() query: GetReservationHistoryQuery,
  ) {
    return this.reservationService.getHistoryByQueryType(payload.id, query);
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
    @Param('id') id: string,
  ) {
    return this.reservationService.deleteReservation(+id);
  }

  @Patch(':id')
  @Auth(API_USER)
  updateReservation(
    @JwtPayload() payload: UserTokenPayload,
    @Param('id') id: number,
    @Body() body: MakeReservationBody,
  ) {
    return this.reservationService.updateReservation(+id, body);
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

  @Get('community/:id/reservation-available/dates')
  @Auth(API_USER)
  getAvailableDate(
    @Param() param: GetAvailableDateParam,
    @Query() query: GetAvailableDateQuery,
  ) {
    return this.reservationService.getAvailableDate(+param.id, query);
  }

  @Get('community/:id/time-priority/time-table')
  @Auth(API_USER)
  getTimeTable(
    @Param() param: GetTimeTableParam,
    @Query() query: GetTimeTableQuery,
  ) {
    return this.reservationService.getTimeTable(+param.id, query);
  }

  @Get('community/:id/reservation-available/slots')
  @Auth(API_USER)
  getAvailableSlot(
    @Param() param: GetAvailableDateParam,
    @Query() query: GetAvailableSlotQuery,
  ) {
    return this.reservationService.getAvailableSlot(+param.id, query);
  }

  @Get('community/:id/reservation-available/seats')
  @Auth(API_USER)
  getAvailableSeat(
    @Param() param: GetAvailableDateParam,
    @Query() query: GetAvailableSeatQuery,
  ) {
    return this.reservationService.getAvailableSeat(+param.id, query);
  }

  @Post('community/:id')
  @Auth(API_USER)
  registerReservation(
    @Param('id') id: string,
    @Body() body: RegisterReservationBody,
    @JwtPayload() payload: UserTokenPayload,
  ) {
    return this.reservationService.registerReservation(+id, body, payload);
  }

  @Get('community/:id')
  @Auth(API_USER)
  getCommunityById(@Param('id') id: string) {
    return this.reservationService.getCommunityById(+id);
  }

  @Get(':id')
  @Auth(API_USER)
  findUniqueReservation(@Param('id') id: string) {
    return this.reservationService.findUniqueReservation(+id);
  }
}
