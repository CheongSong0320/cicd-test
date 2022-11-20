export class FindReservationByCommunityDto {
  id: number;
  startDate: Date;
  endDate: Date;
  seatNumber: number;
  communityName: string;

  constructor({
    id,
    startDate,
    endDate,
    seatNumber,
    communityName,
  }: {
    id: number;
    startDate: Date;
    endDate: Date;
    seatNumber: number;
    communityName: string;
  }) {
    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
    this.seatNumber = seatNumber;
    this.communityName = communityName;
  }
}
