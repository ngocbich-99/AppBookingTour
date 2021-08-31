export class Booking {
  constructor(
    public id: string,
    public placeId: string,
    public userAcc: string,
    public placeTitle: string,
    public placeImage: string,
    public nameUser: string,
    public guestNumber: number,
    public bookedFrom: Date,
    public bookedTo: Date
  ) {}
}
