import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userAccount: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        'https://booking-app-d0398-default-rtdb.firebaseio.com/places.json'
      )
      .pipe(
        map(resData => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userAccount
                )
              );
            }
          }
          return places;
          // return [];
        }),
        tap(places => {
          this._places.next(places);
        })
      );
  }

  getPlace(id: string) {
    return this.http
      .get<PlaceData>(
        `https://booking-app-d0398-default-rtdb.firebaseio.com/places/${id}.json`
      )
      .pipe(
        map(placeData => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userAccount
          );
        })
      );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    userAccount: string,
  ) {
    let generatedId: string;

    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      // 'https://2trip.vn/wp-content/uploads/2020/08/dao-ngoc-phu-quoc.jpg',
      // 'https://saigonstartravel.com/wp-content/uploads/2018/11/tour-nha-trang-2-ngay-2-dem-0.jpg',
      // 'https://freshdalat.vn/upload/images/fresh%20garden%20%C4%91i%E1%BB%83m%20%C4%91%E1%BA%BFn%20kh%C3%B4ng%20th%E1%BB%83%20b%E1%BB%8F%20qua.jpg',
      // 'https://thienhuongtourist.com/user-upload/imgs/tour-du-lich-sapa-2-ngay-1-dem.png',
      'https://dulichtoday.vn/wp-content/uploads/2019/12/co-do-Hoa-Lu-Ninh-Binh.jpg',
      price,
      dateFrom,
      dateTo,
      userAccount
    );
    return this.http
      .post<{ name: string }>(
        'https://booking-app-d0398-default-rtdb.firebaseio.com/places.json',{
          ...newPlace,
          id: null
      })
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(places => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  // updatePlace(placeId: string, title: string, description: string) {
  //   let updatedPlaces: Place[];
  //   return this.places.pipe(
  //     take(1),
  //     switchMap(places => {
  //       if (!places || places.length <= 0) {
  //         return this.fetchPlaces();
  //       } else {
  //         return of(places);
  //       }
  //     }),
  //     switchMap(places => {
  //       const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
  //       updatedPlaces = [...places];
  //       const oldPlace = updatedPlaces[updatedPlaceIndex];
  //       updatedPlaces[updatedPlaceIndex] = new Place(
  //         oldPlace.id,
  //         title,
  //         description,
  //         oldPlace.imageUrl,
  //         oldPlace.price,
  //         oldPlace.availableFrom,
  //         oldPlace.availableTo,
  //         oldPlace.userAccount
  //       );
  //       return this.http.put(
  //         `https://booking-app-d0398-default-rtdb.firebaseio.com/places/${placeId}.json`,
  //         { ...updatedPlaces[updatedPlaceIndex], id: null }
  //       );
  //     }),
  //     tap(() => {
  //       this._places.next(updatedPlaces);
  //     })
  //   );
  // }
}
