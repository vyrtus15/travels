import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { AddTravelComponent } from './components/add-travel/add-travel.component';
import { DeleteTravelComponent } from './components/delete-travel/delete-travel.component';
import { EditTravelComponent } from './components/edit-travel/edit-travel.component';
import { TravelsComponent } from './components/travels/travels.component';
import { TravelsRoutingModule } from './travels-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TravelsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  declarations: [
    TravelsComponent,
    AddTravelComponent,
    EditTravelComponent,
    DeleteTravelComponent,
  ],
  entryComponents: [
    DeleteTravelComponent,
  ]
})
export class TravelsModule { }
