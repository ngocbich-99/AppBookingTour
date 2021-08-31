import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';
import { PlacesService } from './places.service';
import { SegmentChangeEventDetail } from '@ionic/core';

@Component({
  selector: 'app-discover-places',
  templateUrl: './discover-places.page.html',
  styleUrls: ['./discover-places.page.scss'],
})
export class DiscoverPlacesPage implements OnInit {

  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  relevantPlaces: Place[];
  isLoading = false;
  private placesSub: Subscription;
  userAcc: string;

  constructor(
    private placesService: PlacesService,
    private menuCtrl: MenuController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });

    //lay user da dang nhap
    this.authService.getUserStore();
    this.authService.userAccount.subscribe (res => {
      this.userAcc = res;
    })
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
    console.log(this.userAcc);
    
    //them place
    // this.placesService.addPlace(
    //   'Ninh Bình',
    //   'Được mệnh danh là vùng đất Cố Đô hiện nay du lịch Ninh Bình trở thành điểm đến nổi tiếng của Việt Nam. Không chỉ mỗi khách du lịch trong nước đến đây mà hàng năm còn hút cả triệu khách du lịch quốc tế đến tham quan. Mọi người khi đến Ninh Bình đều không khỏi trầm trồ và ngỡ ngàng bởi vẻ đẹp của những danh lam thắng nổi tiếng như Chùa Bái Đính, Tràng An, núi Non Nước, Tam cốc – Bích động … và còn rất nhiều các địa điểm hút khách nữa.',
    //   2.200000,
    //   new Date('2021-01-01'),
    //   new Date('2021-12-31'),
    //   this.userAcc
    // ).subscribe (resData => {
    //   console.log(resData);
    // })
  }

  onOpenMenu() {
    this.menuCtrl.toggle();
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'all') {
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    } else {
      this.relevantPlaces = this.loadedPlaces.filter(
        place => place.userAccount !== this.userAcc
      );
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    }
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

}
