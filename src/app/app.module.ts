import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { PremiumService } from './premium.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CustomerInputComponent } from './customer-input/customer-input.component';
import { RouterModule, Routes } from '@angular/router';
import {MatGridListModule} from '@angular/material/grid-list';
import { CustomerFormComponent } from './customer-form/customer-form.component';


const appRoutes: Routes = [
  { path: '', component: ChartComponent },
  { path: 'customerForm',      component: CustomerInputComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    CustomerInputComponent,
    CustomerFormComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    MatButtonModule, MatCheckboxModule, MatInputModule, MatSliderModule, MatRadioModule, MatButtonToggleModule, MatCardModule,
    BrowserAnimationsModule,MatStepperModule,
    MatExpansionModule,MatProgressBarModule,MatGridListModule
  ],
  providers: [PremiumService],
  bootstrap: [AppComponent]
})
export class AppModule { }
