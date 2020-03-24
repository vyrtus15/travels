import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravelsComponent } from './components/travels/travels.component';
import { AddTravelComponent } from './components/add-travel/add-travel.component';
import { EditTravelComponent } from './components/edit-travel/edit-travel.component';
import { TravelsRoutingModule } from './travels-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TravelsRoutingModule,
  ],
  declarations: [
    TravelsComponent,
    AddTravelComponent,
    EditTravelComponent,
  ],
})
export class TravelsModule { }
