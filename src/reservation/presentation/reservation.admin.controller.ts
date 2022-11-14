import {
  AdminTokenPayload,
  API_ADMIN,
  Auth,
  JwtPayload,
} from '@hanwha-sbi/nestjs-authorization';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ReservationAdminService } from '../application/reservation.admin.service';
import { RegisterCommunityBody } from '../interface/community.interface';

@Controller('reservation')
export class ReservationAdminController {
  constructor(private readonly reservationService: ReservationAdminService) {}

  @Get()
  find() {
    return this.reservationService.helloReservation();
  }

  @Post('/community')
  registerCommunity(@Body() body: RegisterCommunityBody) {
    return this.reservationService.registerCommunity(body);
  }

  @Get('community/usage-status')
  @Auth(API_ADMIN)
  getCommunityUsageStatus(@JwtPayload() payload: AdminTokenPayload) {
    return this.reservationService.getCommunityUsageStatus(payload);
  }

  @Get('community/usage-status/detail')
  @Auth(API_ADMIN)
  getCommunityUsageStatusDetail(
    @JwtPayload() payload: AdminTokenPayload,
    @Query('dong') dong: string,
    @Query('ho') ho: string,
  ) {
    return this.reservationService.getCommunityUsageStatusDetail(
      payload,
      dong,
      ho,
    );
  }

  @Get('/community/time-limit/detail')
  @Auth(API_ADMIN)
  getTimeLimitReservationDetail(@JwtPayload() payload: AdminTokenPayload) {
    return this.reservationService.getTimeLimitReservationDetail(payload);
  }
}
