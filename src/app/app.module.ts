import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { PremiumService } from './premium.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import {MatSliderModule} from '@angular/material/slider';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
	import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MatButtonModule, MatCheckboxModule,MatInputModule,MatSliderModule,MatRadioModule,MatButtonToggleModule,MatCardModule,
    BrowserAnimationsModule
  ],
  providers: [PremiumService],
  bootstrap: [AppComponent]
})
export class AppModule { }
