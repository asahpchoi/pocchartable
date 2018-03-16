import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/map';

@Injectable()
export class PremiumService {
  private _subject = new BehaviorSubject(null);

  riderSchema = {
    "rcc": "N",
    "occupation": "1",
    "product": {
      "productKey": {
        "valueDate": "20180305070000",
        "location": "VN",
        "basicProduct": {
          "productPK": {
            "productId": "--"
          }
        },
        "associateProduct": {
          "productPK": {
            "productId": "--"
          }
        },
        "primaryProduct": {
          "productPK": {
            "productId": "ADD03"
          }
        }
      }
    },
    "parties": {
      "party": {
        "insuredAge": 29,
        "type": "BASIC",
        "smokingStatus": "NS",
        "insuredSex": "M",
        "insuredId": "PROJ, RIDER(ADD 800K)",
        "birthDate": "19890305070000"
      }
    },
    "faceAmount": 800000.00, //rider face amount
    "extraRating": {
      "tempPercentage": 1.00,
      "percentageExtra": 1.00
    },
    "currency": {
      "currencyPK": {
        "currencyId": "VND"
      }
    }
  };

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
      "faceAmount": 500000.00,
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
          "insuredAge": 38,
          "insuredId": "-VALID, top up validation test",
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
      "plannedPremium": 8334,
      "prepayYear": 0,
      "startAnnuityAge": "0"
    },
    "displayEOYOnly": false,
    "enableDebug": true,
    "language": "en_vn",
    "policyExcludeSOS": "N",
    "policyYearDate": "20180102070000",
    "reference": "PROP-000000079",
    "sortRider": "N",
    "startDebugYear": 0,
    "stopDebugYear": 10,
    "owner": {
      "insuredIsOwner": false,
      "ownerAge": 38,
      "ownerDOB": "19800101070000",
      "ownerId": "Owner Name XXX",
      "ownerSex": "F"
    },
    "fundActivities": {
      "fundActivity": []
    },
    "funds": {
      "fundRecord": [{
        "allocation": 100,
        "code": "UL007",
        "returnRateHigh": 7.0000,
        "returnRateMedium": 5.0000,
        "returnRate": 4.0000
      }]
    },
    "dependents": [],
    "riders": {
      "coverageInfo": []
    },
    "watchPoints": []
  }


  t;

  url = 'https://product-engine-nodejs.apps.ext.eas.pcf.manulife.com/api/v1/product/project';

  constructor(public http: HttpClient) {
  }

  submitFundActivities(fundacts) {
    //console.log('FundAct')
    this.jsonData.fundActivities.fundActivity = fundacts;
    console.log(this.jsonData.fundActivities.fundActivity, fundacts)
    this.submit();
  }

  private submit() {

    console.log(this.jsonData);

    this.http.post(
      this.url, this.jsonData
    ).subscribe(t => {
//        console.log('return', t)
        this._subject.next(t)
    });
  }

  submitBasic(input) {
    this.jsonData.coverageInfo.faceAmount = input.faceAmt;
    this.jsonData.coverageInfo.plannedPremium = input.plannedPremium;
    this.jsonData.coverageInfo.parties.party.insuredAge = input.age;

    let riders = input.riders.map(
      r => {
        let rider = { ...this.riderSchema };
        rider.faceAmount = r.fm;
        rider.parties.party.insuredAge = r.age;
        rider.product.productKey.primaryProduct.productPK.productId = r.productId;
        rider.occupation = r.occupation;

        return rider;
      }
    )

    this.jsonData.riders.coverageInfo = riders;
    this.submit();
  }

  getData() {
    return this._subject;
  }


}
