import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTravelComponent } from './components/add-travel/add-travel.component';
import { EditTravelComponent } from './components/edit-travel/edit-travel.component';
import { TravelsComponent } from './components/travels/travels.component';

const travelsRoutes: Routes = [
  { path: ':userId', component: TravelsComponent },
  { path: ':userId/add', component: AddTravelComponent },
  { path: ':userId/edit/:travelId', component: EditTravelComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(travelsRoutes),
  ],
  exports: [
    RouterModule,
  ]
})
export class TravelsRoutingModule { }
