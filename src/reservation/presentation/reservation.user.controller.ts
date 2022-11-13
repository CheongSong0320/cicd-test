import { Controller, Get } from '@nestjs/common';
import {
  API_USER,
  Auth,
  JwtPayload,
  UserTokenPayload,
} from '@hanwha-sbi/nestjs-authorization';
import { ReservationUserService } from '../application/reservation.user.service';

@Controller('reservation')
export class ReservationUserController {
  constructor(private readonly reservationService: ReservationUserService) {}

  @Get()
  find() {
    return this.reservationService.helloReservation();
  }

  @Get('/today')
  // @Auth(API_USER)
  getTodayReservation() {
    // @JwtPayload() payload: UserTokenPayload
    return this.reservationService.getTodayReservation(
      // parseInt(payload.id, 10),
      1,
    );
  }
}
