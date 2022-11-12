import { Controller, Get } from '@nestjs/common';
import { ReservationAdminService } from '../application/reservation.admin.service';

@Controller('reservation')
export class ReservationAdminController {
  constructor(private readonly reservationService: ReservationAdminService) {}

  @Get()
  find() {
    return this.reservationService.helloReservation();
  }
}
