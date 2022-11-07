import { Controller, Get } from '@nestjs/common';
import { ReservationService } from '../application/reservation.user.service';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  find() {
    return this.reservationService.helloReservation();
  }
}
