import { Reservation } from '@prisma/client';

export interface IReservationRepository {
  find: () => Promise<Reservation[]>;
}
