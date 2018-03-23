import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/map';

@Injectable()
export class PremiumService {
  private _subject = new BehaviorSubject(null);
  private _validationSubject = new BehaviorSubject(null);
  private _premiumSubject = new BehaviorSubject(null);

  jsonData = {
    "channel": "Agency",
    "coverageInfo": {
      "currency": {
        "currencyPK": {
          "currencyId": "VND"
        }
      },
      "extraRating": {
        "flatExtra": 0.00,
        "percentageExtra": 1.00,
        "tempFlatDuration": 0,
        "tempFlat": 0.00,
        "tempPercentageDuration": 0,
        "tempPercentage": 1.00
      },
      "faceAmount": 800000.00,
      "initialDumpIn": 0.00,
      "noOfInstallmentYear": 0,
      "options": {
        "billingMethod": "DirectBilling",
        "calculateSinglePremiumBand": "N",
        "dbLevel": "Increase",
        "fundWithdrawalsByPercentage": "N",
        "paymentMode": "A"
      },
      "parties": {
        "party": {
          "birthDate": "19800101070000",
          "insuredAge": 29,
          "insuredId": "PROJ, RIDER(ADD 800K)",
          "insuredSex": "M",
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
          "valueDate": "20180305070000"
        }
      },
      "plannedPremium": 10000,
      "prepayYear": 0,
      "startAnnuityAge": "0"
    },
    "displayEOYOnly": false,
    "enableDebug": false,
    "language": "en",
    "policyExcludeSOS": "N",
    "policyYearDate": "20180305070000",
    "reference": "PROP-000000002",
    "sortRider": "N",
    "startDebugYear": 0,
    "stopDebugYear": 5,
    "owner": {
      "insuredIsOwner": false,
      "relationToInsured": "01",
      "ownerAge": 29,
      "ownerDOB": "19800101070000",
      "ownerId": "Test Projection Case 1",
      "ownerSex": "M"
    },
    "fundActivities": {
      "fundActivity": []
    },
    "funds": {
      "fundRecord": [{
        "allocation": 100,
        "code": "UL007",
        "returnRateHigh": 7.5000,
        "returnRateMedium": 5.0000,
        "returnRate": 4.0000
      }]
    },
    "dependents": [],
    "riders": {
      "coverageInfo": [{
        "currency": {
          "currencyPK": {
            "currencyId": "VND"
          }
        },
        "extraRating": {
          "percentageExtra": 1.00,
          "tempPercentage": 1.00
        },
        "faceAmount": 800000.00,
        "parties": {
          "party": {
            "insuredId": "PROJ, RIDER(ADD 800K)",
            "insuredSex": "M",
            "smokingStatus": "NS",
            "type": "BASIC",
            "birthDate": "19800101070000",
            "insuredAge": 29
          }
        },
        "product": {
          "productKey": {
            "primaryProduct": {
              "productPK": {
                "productId": "ADD03" //TRI01, ECI
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
        "occupation": "1",
        "rcc": "N"
      }]
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
    "faceAmount": 800000.00,
    "parties": {
      "party": {
        "insuredId": "PROJ, RIDER(ADD 800K)",
        "insuredSex": "M",
        "smokingStatus": "NS",
        "type": "BASIC",
        "insuredAge": 29
      }
    },
    "product": {
      "productKey": {
        "primaryProduct": {
          "productPK": {
            "productId": "ADD03"
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
    "occupation": "1",
    "rcc": "N"
  };

  t;

  url = 'https://product-engine-nodejs.apps.ext.eas.pcf.manulife.com/api/v1/product/project';
  validateUrl = 'https://product-engine-nodejs.apps.ext.eas.pcf.manulife.com/api/v1/product/validate';
  schemaUrl = 'https://product-engine-nodejs.apps.ext.eas.pcf.manulife.com/api/v1/product/readSchema/${productId}/01';
  premiumUrl = 'https://product-engine-nodejs.apps.ext.eas.pcf.manulife.com/api/v1/product/calculatePremiums';

  constructor(private http: HttpClient) {
  }

  getPremiumResult() {
    return this._premiumSubject;
  }

  submitPremiumCalculation() {
    this.http.post(
      this.premiumUrl, this.jsonData
    ).subscribe(t => {
      console.log('premium', t)
      this._premiumSubject.next(t)
    });
  }

  updateFundActivities(fundacts) {
    this.jsonData.fundActivities.fundActivity = fundacts;
  }

  updateBasic(input) {
    this.jsonData.coverageInfo.faceAmount = input.faceAmt;
    this.jsonData.coverageInfo.plannedPremium = input.plannedPremium;
    this.jsonData.coverageInfo.parties.party.insuredAge = input.age;
    this.jsonData.language = input.language ? input.language : 'en';

    let riders = input.riders.map(
      r => {
        let riderCopy = Object.assign({}, this.riderSchema);

        riderCopy.faceAmount = +r.faceAmount;
        riderCopy.parties.party.insuredAge = +r.age;
        riderCopy.occupation = "" + r.occupation;
        if(!r.occupation) {
          riderCopy.occupation = null;
        }

        riderCopy.product.productKey.primaryProduct.productPK.productId = r.productId;
        riderCopy = JSON.parse(JSON.stringify(riderCopy));
        console.log("ID",

          r.productId,
          riderCopy,
          riderCopy.product.productKey.primaryProduct.productPK,

        );
        return riderCopy;
      }
    )


    this.jsonData.riders.coverageInfo = riders;
  }

  getproductSchema(productId) {
    let url = this.schemaUrl.replace('${productId}', productId);
    return this.http.get(url);
  }

  submitValidation() {
    this.http.post(
      this.validateUrl, this.jsonData
    ).subscribe(d => {
      if (!d) return;
      let transformedError;
      transformedError = { GENERAL: [] };
      (d as Array<any>).forEach(err => {
        let keys = Object.keys(err["parameters"])
        if (keys.length == 0) {
          transformedError.GENERAL.push(err.message)
        }
        else {
          keys.forEach(
            k => {
              //k = k.replace('%', '', true)
              if (!transformedError[k]) {
                transformedError[k] = [];
              }
              transformedError[k].push(err.message);
            }
          )
        }
      }

      );

      if(transformedError.GENERAL.length==0) {
        transformedError = 0;
      }

      console.log(transformedError)
      this._validationSubject.next(transformedError)
    });
  }

  getValidationResult() {

    return this._validationSubject;
  }

  submit() {
    console.log(this.jsonData);
    //this.jsonData = this.sampleJSON;
    this.http.post(
      this.url, this.jsonData
    ).subscribe(t => {
      console.log('return', t)
      this._subject.next(t)
    });
  }
  getData() {
    return this._subject;
  }


}
