import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TravelsService } from '../../services/travels/travels.service';

@Component({
  selector: 'app-add-travel',
  templateUrl: './add-travel.component.html',
  styleUrls: ['./add-travel.component.scss']
})
export class AddTravelComponent {
  addTravelForm = this.formBuilder.group({
    destination: [null, Validators.required],
    startDate: [null],
    endDate: [null],
    comment: [null],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly travelsService: TravelsService,
    private readonly matSnackBar: MatSnackBar,
  ) { }

  submit() {
    if (!this.addTravelForm.valid) {
      return;
    }

    const userId = this.activatedRoute.snapshot.paramMap.get('userId');

    this.travelsService.create(userId, this.addTravelForm.value)
      .subscribe(() => this.handleSuccess());
  }

  back() {
    this.router.navigate(['travels', this.activatedRoute.snapshot.paramMap.get('userId')]);
  }

  private handleSuccess() {
    this.matSnackBar.open('Travel created', null, { duration: 3500 });
    this.back();
  }

}
