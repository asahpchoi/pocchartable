import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-topup-input',
  templateUrl: './topup-input.component.html',
  styleUrls: ['./topup-input.component.css']
})
export class TopupInputComponent {

  constructor(
    public dialogRef: MatDialogRef<TopupInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      data.year = 1
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

}
