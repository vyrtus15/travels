import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTravelComponent } from './components/add-travel/add-travel.component';
import { EditTravelComponent } from './components/edit-travel/edit-travel.component';
import { TravelsComponent } from './components/travels/travels.component';
import { PageNotFoundComponent } from 'src/app/components/page-not-found/page-not-found.component';

const travelsRoutes: Routes = [
  {
    path: ':userId',
    component: TravelsComponent,
    children: [
      {
        path: '',
        children: [
          { path: 'add', component: AddTravelComponent },
          { path: 'edit/:travelId', component: EditTravelComponent },
        ]
      }
    ]
  },
  { path: '**', component: PageNotFoundComponent }
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
