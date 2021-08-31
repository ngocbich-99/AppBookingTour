import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiscoverPlacesPageRoutingModule } from './discover-places-routing.module';

import { DiscoverPlacesPage } from './discover-places.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiscoverPlacesPageRoutingModule
  ],
  declarations: [DiscoverPlacesPage]
})
export class DiscoverPlacesPageModule {}
