import { Controller, Get } from '@nestjs/common';
import { ReservationUserService } from '../application/reservation.user.service';

@Controller('reservation')
export class ReservationUserController {
  constructor(private readonly reservationService: ReservationUserService) {}

  @Get()
  find() {
    return this.reservationService.helloReservation();
  }
}
