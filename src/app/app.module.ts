import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { PremiumService } from './premium.service';
import { ProductService } from './product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CustomerInputComponent } from './customer-input/customer-input.component';
import { RouterModule, Routes } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { MatIconModule } from '@angular/material/icon';
import { NouisliderModule } from 'ng2-nouislider';

import { MatTableModule } from '@angular/material/table';
import { TopupInputComponent } from './topup-input/topup-input.component';
import { ZoomChartComponent } from './zoom-chart/zoom-chart.component';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { ProductInputComponent } from './product-input/product-input.component';
import { CustomerService } from './customer.service';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { FormvalidationComponent } from './formvalidation/formvalidation.component';
import { CustomValidatorComponent } from './custom-validator/custom-validator.component';
import { CustomerindicatorComponent } from './customerindicator/customerindicator.component';



const appRoutes: Routes = [
  { path: 'chart', component: ChartComponent },
  { path: 'validate', component: FormvalidationComponent },
  { path: 'customerForm', component: CustomerInputComponent },
  { path: 'zoomChart', component: ZoomChartComponent },
  { path: '', component: ProductInputComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    CustomerInputComponent,
    CustomerFormComponent,
    TopupInputComponent,
    ZoomChartComponent,
    ProductInputComponent,
    CustomerViewComponent,
    FormvalidationComponent,
    CustomValidatorComponent,
    CustomerindicatorComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,

    ),
    BrowserModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    MatButtonModule, MatCheckboxModule, MatInputModule, MatSliderModule, MatRadioModule, MatButtonToggleModule, MatCardModule,
    BrowserAnimationsModule, MatStepperModule,
    MatExpansionModule, MatProgressBarModule, MatGridListModule,
    MatIconModule,
    NouisliderModule,
    MatTableModule,
    MatDialogModule
  ],
  providers: [PremiumService, ProductService, CustomerService],
  bootstrap: [AppComponent],
  entryComponents: [
    TopupInputComponent
  ]
})
export class AppModule { }
