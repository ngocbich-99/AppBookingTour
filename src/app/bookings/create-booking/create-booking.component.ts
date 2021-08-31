import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

import { Place } from '../../discover-places/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss']
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  formBook: FormGroup;
  numberGuests: Number[] = [];
  nameUser = 'ngocbich';
  startDate: string;
  endDate: string;

  constructor(
    private modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    for (let i = 1; i < 6; i++) {
      this.numberGuests.push(i);
    }
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);
    this.startDate = new Date(this.selectedPlace.availableFrom).toISOString();
    this.endDate = new Date(this.selectedPlace.availableTo).toISOString();

    console.log('on in it', this.numberGuests, this.startDate);
    
    this.createForm();
    console.log(this.formBook.value);
    
  }
  createForm(){
    this.formBook = new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required]
      }),
      guestNumber: new FormControl(1, {
        validators: [Validators.required]
      }),
      fromDate: new FormControl(new Date(this.selectedPlace.availableFrom).toISOString(), {
        validators: [Validators.required]
      }),
      toDate: new FormControl(new Date(this.selectedPlace.availableTo).toISOString(), {
        validators: [Validators.required]
      })
    })
  }
  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onBookPlace() {
    // if (!this.formBook.valid || !this.datesValid) {
    //   return;
    // }

    this.modalCtrl.dismiss(
      {
        bookingData: {
          userName: this.formBook.value['name'],
          guestNumber: +this.formBook.value['guestNumber'],
          startDate: new Date(this.formBook.value['fromDate']),
          endDate: new Date(this.formBook.value['toDate'])
        }
      },
      'confirm'
    );
    console.log(this.formBook.value);
    
  }
  selectStartDate(event?: any){
    console.log(event);
  }
  selectEndDate(event?: any){
    console.log(event);
  }
  datesValid() {
    const startDate = new Date(this.formBook.value['fromDate']);
    const endDate = new Date(this.formBook.value['toDate']);
    return endDate > startDate;
  }
}
