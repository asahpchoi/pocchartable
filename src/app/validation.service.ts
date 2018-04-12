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
  dynamicfuncUrl = 'https://product-engine-nodejs.apps.ext.eas.pcf.manulife.com/api/v1/product/functions/${functionName}';

  constructor(private http: HttpClient) {

  }

  getDynamicResult(
    functionName,
    params
  ) {
    let json = {
      "productId": params.productId,
      "location": "Vietnam",
      "channel": "Agency",
      "insuredAge": params.insuredAge,
      "plannedPremium": params.plannedPremium,
      "paymentMode": "Annual",
      "extraRating": null,
      "currencyId": "VND"
    }
    let url = this.dynamicfuncUrl.replace('${functionName}', functionName);
    console.log(url)
    this.http.post(
      url, json
    ).subscribe(t => {
      let min = 0;
      let max = 1000000;
      
      if(t.value) {
        min = t.value.minLimit,
        max = t.value.maxLimit
      }
      this._validationSubject.next(
        {
          insuredAge: {
            min: 0,
            max: 65
          },
          faceAmount: {
            min: min,
            max: max
          },
          premium: {
            min: 100000,
            max: 5000000
          }
        }
      );
    });
  }

  getValidationResults(params) {
    console.log('validate')
    this.getDynamicResult("CalculateFaceAmountRangeUL007",
    params

    )
    return this._validationSubject;
  }

  loadValidations(info) {

  }

  getSchema(productId) {
    let url = this.schemaUrl.replace('${productId}', productId);
    return this.http.get(url);
  }
}
