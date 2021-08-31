import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { take, tap, delay, switchMap, map } from 'rxjs/operators';

import { Booking } from './booking.model';
import { AuthService } from '../auth/auth.service';

interface BookingData {
  bookedFrom: string;
  bookedTo: string;
  guestNumber: number;
  nameUser: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userAcc: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  //event of observable
  get bookings() {
    return this._bookings.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {
    console.log('booking service');
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    nameUser: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userAccStr,
      placeTitle,
      placeImage,
      nameUser,
      guestNumber,
      dateFrom,
      dateTo
    );
    return this.http
      .post<{ name: string }>(
        'https://booking-app-d0398-default-rtdb.firebaseio.com/bookings.json',
        { ...newBooking, id: null }
      )
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.bookings;
        }),
        take(1),
        tap(bookings => {
          newBooking.id = generatedId;
          this._bookings.next(bookings.concat(newBooking));
        })
      );
  }

  fetchBookings() {
    return this.http
      .get<{ [key: string]: BookingData }>(
        'https://booking-app-d0398-default-rtdb.firebaseio.com/bookings.json'
      )
      //tranform data tra ve tu server
      .pipe(
        map(bookingData => {
          const bookings = [];
          for (const key in bookingData) {
            if (bookingData.hasOwnProperty(key) && bookingData[key].userAcc === this.authService.userAccStr) {
              bookings.push(
                new Booking(
                  key,
                  bookingData[key].placeId,
                  bookingData[key].userAcc,
                  bookingData[key].placeTitle,
                  bookingData[key].placeImage,
                  bookingData[key].nameUser,
                  bookingData[key].guestNumber,
                  new Date(bookingData[key].bookedFrom),
                  new Date(bookingData[key].bookedTo)
                )
              );
            }
          }
          return bookings;
        }),
        tap(bookings => {
          this._bookings.next(bookings);
          console.log('fetch booking',bookings);
        })
      );
  }

  deleteBooking(bookingId: string) {
    return this.http
      .delete(
        `https://booking-app-d0398-default-rtdb.firebaseio.com/bookings/${bookingId}.json`
      )
      .pipe(
        switchMap(() => {
          console.log('switchMap http', this.bookings );
          //tra ve ds booking tren client sau khi da xoa
          return this.bookings;
        }),
        take(1), //take one snapshot
        tap(bookings => {
          this._bookings.next(bookings.filter(b => b.id !== bookingId));
          // this._bookings.next(bookings);
          console.log(this._bookings);
        })
      );
  }
}
