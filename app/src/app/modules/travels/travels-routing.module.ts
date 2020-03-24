import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTravelComponent } from './components/add-travel/add-travel.component';
import { EditTravelComponent } from './components/edit-travel/edit-travel.component';
import { TravelsComponent } from './components/travels/travels.component';

const travelsRoutes: Routes = [
  {
    path: '',
    component: TravelsComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        // canActivateChild: [AuthGuard],
        children: [
          { path: 'add', component: AddTravelComponent },
          { path: 'edit/:travelId', component: EditTravelComponent },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(travelsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class TravelsRoutingModule {}
