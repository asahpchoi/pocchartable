import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PremiumService } from '../premium.service';

@Component({
  selector: 'app-topup-input',
  templateUrl: './topup-input.component.html',
  styleUrls: ['./topup-input.component.css']
})
export class TopupInputComponent  implements OnInit {
  errors;
  validated = false;

  ngOnInit() {
    this.premiumSvc.getValidationResult().subscribe(
      errors => {
        if (!errors || !this.validated) return;
        if (errors.length == 0) {
          console.log('no Error')
          this.dialogRef.close(this.data);
        }
        else {
          console.log(errors)
          this.errors = errors;
        }
      }
    );
  }

  constructor(
    private premiumSvc: PremiumService,
    public dialogRef: MatDialogRef<TopupInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    data.duration = 1;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  check() {
    console.log('check')

    let object = JSON.parse(JSON.stringify(this.data.object));
    for (var i = 0; i < this.data.duration; i++) {
      object[this.data.key][this.data.startYear + i] = this.data.value;
    }
    let fundActs =
      [
        ...object.topup.map((v, i) => {
          return {
            "attainAge": this.data.startAge + i,
            "topupPremium": v
          }
        }
        ),
        ...object.withdrawal.map((v, i) => {
          return {
            "attainAge": this.data.startAge + i,
            "withdrawal": v
          }
        }
        )
      ];
    this.premiumSvc.updateFundActivities(fundActs.filter(x => x));
    this.validated = true;
    this.premiumSvc.submitValidation();


  }
}
