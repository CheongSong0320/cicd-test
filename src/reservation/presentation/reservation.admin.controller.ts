import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
