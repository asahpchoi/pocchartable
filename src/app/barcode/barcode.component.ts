import { Component, ViewChild, ElementRef,OnInit} from '@angular/core';
import JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.css']
})
export class BarcodeComponent  {
  title = 'Testing'
  value = '123456'
  constructor() {

   }



}
