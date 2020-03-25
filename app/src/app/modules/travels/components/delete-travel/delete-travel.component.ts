import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DisplayTravel } from '../../interfaces/travel.interface';

@Component({
  selector: 'app-delete-travel',
  templateUrl: './delete-travel.component.html',
  styleUrls: ['./delete-travel.component.scss']
})
export class DeleteTravelComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteTravelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { travel: DisplayTravel },
  ) { }

  onNoClick() {
    this.dialogRef.close();
  }

}
