import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/skip';

@Injectable()
export class ValidationService {
  private _validationSubject = new BehaviorSubject(null);

  schemaUrl = 'https://product-engine-nodejs.apps.ext.eas.pcf.manulife.com/api/v1/product/readSchema/${productId}/01';
  constructor(private http: HttpClient) {

  }

  getValidationResults() {
    return this._validationSubject;
  }

  loadValidations(info) {
    this._validationSubject.next(
      {
        insuredAge : {
          min: 0,
          max: 65
        },
        faceAmount: {
          min: 1000000,
          max: 50000000
        },
        premium: {
          min:  100000,
          max:  5000000
        }
      }

    );
  }

  getSchema(productId) {
    let url = this.schemaUrl.replace('${productId}', productId);
    return this.http.get(url);
  }
}
