import { Injectable } from '@nestjs/common';
import { ReservationRepository } from '../infrastructure/repository/reservation.repository';
import { ReservationValidator } from '../infrastructure/validator/reservation.validator';

@Injectable()
export class ReservationUserServiceLogic {
  constructor(
    private reservationRepository: ReservationRepository,
    private reservationValidator: ReservationValidator,
  ) {}

  helloReservation() {
    return this.reservationRepository.findMany();
  }

  async getTodayReservation(userId: number) {
    const todayReservations =
      await this.reservationRepository.findTodayReservation(
        this.reservationValidator.findTodayReservation(userId),
      );

    return todayReservations.map((value) => ({
      id: value.id,
      startDate: value.startDate,
      endDate: value.endDate,
      communityClubName: value.CommunityClub.name,
    }));
  }
}
