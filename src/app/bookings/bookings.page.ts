import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { BookingService } from './booking.service';
import { Booking } from './booking.model';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss']
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  isLoading = false;
  private bookingSub: Subscription;

  constructor(
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
  ) {}

  ngOnInit() {
    this.bookingSub = this.bookingService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });
    console.log('on in it booking page', this.loadedBookings);
    
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
    console.log('view will enter', this.loadedBookings);
    
  }

  onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
    this.alertCtrl.create({
      header: 'Huỷ Tour',
      message: 'Bạn có chắc chắn muốn huỷ tour không?',
      buttons: [
        {
          text: 'Quay lại',
          role: 'cancel',
          handler: () => {
            slidingEl.close();
          }
        },
        {
          text: 'Xác nhận',
          handler: () => {
            slidingEl.close();
            this.loadingCtrl.create({ message: 'Huỷ bỏ Tour...' }).then(loadingEl => {
              loadingEl.present();
              this.bookingService.deleteBooking(bookingId).subscribe(() => {
                loadingEl.dismiss();
              });
            });
          }
        }
      ]
    }).then(el => {
      el.present();
    })
  }

  ngOnDestroy() {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }
}
