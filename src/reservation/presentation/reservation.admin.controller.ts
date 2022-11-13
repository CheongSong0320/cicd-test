import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ReservationAdminService } from '../application/reservation.admin.service';
import {
  GetCommunityUsageStatusParam,
  GetCommunityUsageStatusDetailParam,
  RegisterCommunityBody,
  GetReservationDetailParam,
} from '../interface/community.interface';

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

  @Get('community/usage/status/:apartmentId')
  getCommunityUsageStatus(@Param() param: GetCommunityUsageStatusParam) {
    return this.reservationService.getCommunityUsageStatus(param);
  }

  @Get('community/usage/status/:apartmentId/detail')
  getCommunityUsageStatusDetail(
    @Param() param: GetCommunityUsageStatusDetailParam,
    @Query('dong') dong: string,
    @Query('ho') ho: string,
  ) {
    return this.reservationService.getCommunityUsageStatusDetail(
      param,
      dong,
      ho,
    );
  }

  @Get(':apartmentId/timeLimit/detail')
  getTimeLimitReservationDetail(@Param() param: GetReservationDetailParam) {
    return this.reservationService.getTimeLimitReservationDetail(param);
  }
}
