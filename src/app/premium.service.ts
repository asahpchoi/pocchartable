import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/skip';


@Injectable()
export class PremiumService {
  private _subject = new BehaviorSubject(null);
  private _validationSubject = new BehaviorSubject(null);
  private _premiumSubject = new BehaviorSubject(null);

  jsonData =
  {
    "channel": "Agency",
    "coverageInfo": {
      "currency": {
        "currencyPK": {
          "currencyId": "VND"
        }
      },
      "extraRating": {
        "flatExtra": 0,
        "percentageExtra": 1,
        "tempFlatDuration": 0,
        "tempFlat": 0,
        "tempPercentageDuration": 0,
        "tempPercentage": 1
      },
      "faceAmount": null,
      "initialDumpIn": 0,
      "noOfInstallmentYear": 0,
      "options": {
        "billingMethod": "DirectBilling",
        "calculateSinglePremiumBand": "N",
        "dbLevel": null,
        "fundWithdrawalsByPercentage": "N",
        "paymentMode": "A"
      },
      "parties": {
        "party": {
          "birthDate": "19800101070000",
          "insuredAge": null,
          "insuredId": "-VALID, Total Premium Test",
          "insuredSex": "F",
          "smokingStatus": "NS",
          "type": "BASIC"
        }
      },
      "product": {
        "productKey": {
          "primaryProduct": {
            "productPK": {
              "productId": "UL007"
            }
          },
          "associateProduct": {
            "productPK": {
              "productId": "--"
            }
          },
          "basicProduct": {
            "productPK": {
              "productId": "--"
            }
          },
          "location": "VN",
          "valueDate": "20180102070000"
        }
      },
      "plannedPremium": null,
      "prepayYear": 0,
      "startAnnuityAge": "0"
    },
    "displayEOYOnly": false,
    "enableDebug": false,
    "language": "en",
    "policyExcludeSOS": "N",
    "policyYearDate": "20180102070000",
    "reference": "PROP-000000065",
    "sortRider": "N",
    "startDebugYear": 0,
    "stopDebugYear": 10,
    "owner": {
      "insuredIsOwner": false,
      "ownerAge": 1111,
      "ownerDOB": "19800101070000",
      "ownerId": "Owner Name XXX",
      "ownerSex": "F"
    },
    "fundActivities": {
      "fundActivity": []
    },
    "funds": {
      "fundRecord": [
        {
          "allocation": 100,
          "code": "UL007",
          "returnRateHigh": 7,
          "returnRateMedium": 5,
          "returnRate": 4
        }
      ]
    },
    "dependents": [],
    "riders": {
      "coverageInfo": []
    },
    "watchPoints": []
  }

  riderSchema = {
    "currency": {
      "currencyPK": {
        "currencyId": "VND"
      }
    },
    "extraRating": {
      "percentageExtra": 1.00,
      "tempPercentage": 1.00
    },
    "faceAmount": null,
    "parties": {
      "party": {
        "birthDate": "19800101070000",
        "insuredAge": null,
        "insuredId": "-VALID, Total Premium Test",
        "insuredSex": "F",
        "smokingStatus": "NS",
        "type": "BASIC"
      }
    },
    "product": {
      "productKey": {
        "primaryProduct": {
          "productPK": {
            "productId": null
          }
        },
        "associateProduct": {
          "productPK": {
            "productId": "--"
          }
        },
        "basicProduct": {
          "productPK": {
            "productId": "--"
          }
        },
        "location": "VN",
        "valueDate": "20180305070000"
      }
    },
    "occupation": null,
    "rcc": "N"
  };
  jsonDataClone;
  resultCache;
  t;

  url = 'https://product-engine-nodejs.apps.ext.eas.pcf.manulife.com/api/v1/product/project';
  validateUrl = 'https://product-engine-nodejs.apps.ext.eas.pcf.manulife.com/api/v1/product/validate';
  schemaUrl = 'https://product-engine-nodejs.apps.ext.eas.pcf.manulife.com/api/v1/product/readSchema/${productId}/01';
  premiumUrl = 'https://product-engine-nodejs.apps.ext.eas.pcf.manulife.com/api/v1/product/calculatePremiums';

  constructor(private http: HttpClient) {
  }

  updateBasic(input) {
    this.jsonDataClone = JSON.parse(JSON.stringify(this.jsonData)); //refresh the clone
    this.jsonDataClone.coverageInfo.faceAmount = input.faceAmt;
    this.jsonDataClone.coverageInfo.plannedPremium = input.plannedPremium;
    this.jsonDataClone.coverageInfo.parties.party.insuredAge = input.age;
    this.jsonDataClone.language = input.language ? input.language : 'en';
    //dbLevel deathBenefitOption
    console.log(this.jsonDataClone, this.jsonDataClone.coverageInfo.options.dbLevel,input.deathBenefitOption );
    this.jsonDataClone.coverageInfo.options.dbLevel = input.deathBenefitOption;

    let riders = input.riders.map(
      r => {
        let riderCopy = Object.assign({}, this.riderSchema);

        riderCopy.faceAmount = +r.faceAmount;
        riderCopy.parties.party.insuredAge = +r.age;
        riderCopy.occupation = "" + r.occupation;
        if (!r.occupation) {
          riderCopy.occupation = null;
        }

        riderCopy.product.productKey.primaryProduct.productPK.productId = r.productId;
        riderCopy = JSON.parse(JSON.stringify(riderCopy));
        return riderCopy;
      }
    )
    this.jsonDataClone.riders.coverageInfo = riders;
  }
  updateFundActivities(fundacts) {
    this.jsonDataClone = JSON.parse(JSON.stringify(this.jsonData)); //refresh the clone
    this.jsonDataClone.fundActivities.fundActivity = fundacts;
  }

  submitPremiumCalculation() {
    this.jsonData = JSON.parse(JSON.stringify(this.jsonDataClone))
    this.http.post(
      this.premiumUrl, this.jsonData
    ).subscribe(t => {
      this._premiumSubject.next(t)
    });
    return this._premiumSubject;
  }
  getPremiumResult() {
    return this._premiumSubject;
  }
  submitValidation() {
    this.http.post(
      this.validateUrl, this.jsonDataClone
    ).subscribe(t => {
      this._validationSubject.next(t);
    });
    return this._validationSubject;
  }

  getValidationResult() {
    return this._validationSubject;
  }
  submitProjection() {
    this.jsonData = JSON.parse(JSON.stringify(this.jsonDataClone))
    this.http.post(
      this.url, this.jsonData
    ).subscribe(t => {
      //if(JSON.stringify(this.resultCache) == JSON.stringify(t)) {
      //return;
      //}
      this.resultCache = t;
      console.log('return', t)
      this._subject.next(t)
    });
    return this._subject;
  }
  getProjectionResult() {
    return this._subject;
  }

}
