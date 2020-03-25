import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { TravelsItem } from '../../interfaces/travel.interface';
import { TravelsService } from '../../services/travels/travels.service';

@Component({
  selector: 'app-edit-travel',
  templateUrl: './edit-travel.component.html',
  styleUrls: ['./edit-travel.component.scss']
})
export class EditTravelComponent implements OnInit {
  public item: TravelsItem;

  editTravelForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly travelsService: TravelsService,
    private readonly matSnackBar: MatSnackBar,
  ) {
    this.item = this.router.getCurrentNavigation()?.extras?.state as TravelsItem;
  }

  ngOnInit() {
    if (!this.item) {
      this.router.navigate(['travels', this.activatedRoute.snapshot.paramMap.get('userId')]);
      return;
    }

    this.editTravelForm = this.formBuilder.group({
      destination: [this.item.destination, Validators.required],
      startDate: [moment(this.item.startDate).toDate(), Validators.required],
      endDate: [moment(this.item.endDate).toDate(), Validators.required],
      comment: [this.item.comment],
    });
  }

  submit() {
    if (!this.editTravelForm.valid) {
      return;
    }

    const userId = this.activatedRoute.snapshot.paramMap.get('userId');
    const travelId = this.activatedRoute.snapshot.paramMap.get('travelId');

    this.travelsService.update(userId, travelId, this.editTravelForm.value)
      .subscribe(() => this.handleSuccess());
  }

  back() {
    this.router.navigate(['travels', this.activatedRoute.snapshot.paramMap.get('userId')]);
  }

  private handleSuccess() {
    this.matSnackBar.open('Travel updated', null, { duration: 2500 });
    this.back();
  }

}
