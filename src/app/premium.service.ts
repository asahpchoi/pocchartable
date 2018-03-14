import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PremiumService {

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
    "watchPoints": [],
    "riders": {
      "coverageInfo": []
    },
    "dependents": [{
      "relationToInsured": "03",
      "birthdate": "20110308070000",
      "dependentSex": "Male",
      "dependentName": "PROJ, RIDER(ADD 800K) DEPEN",
      "dependentAge": 7
    }],
    "funds": {
      "fundRecord": [{
        "returnRate": 4.0000,
        "returnRateMedium": 5.0000,
        "returnRateHigh": 7.5000,
        "code": "UL007",
        "allocation": 100
      }]
    },
    "fundActivities": {
      "fundActivity": []
    },
    "owner": {
      "ownerSex": "M",
      "ownerId": "Test Projection Case 1",
      "ownerDOB": "19890305070000",
      "ownerAge": 29,
      "insuredIsOwner": false
    },
    "stopDebugYear": 10,
    "startDebugYear": 0,
    "sortRider": "N",
    "reference": "PROP-000000002",
    "policyYearDate": "20180305070000",
    "policyExcludeSOS": "N",
    "language": "en_vn",
    "enableDebug": true,
    "displayEOYOnly": false,
    "coverageInfo": {
      "startAnnuityAge": "0",
      "prepayYear": 0,
      "plannedPremium": 10000, //*
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
              "productId": "UL007"
            }
          }
        }
      },
      "parties": {
        "party": {
          "type": "BASIC",
          "smokingStatus": "NS",
          "insuredSex": "M",
          "insuredId": "PROJ, RIDER(ADD 800K)",
          "insuredAge": 29, //*
          "birthDate": "19890305070000"
        }
      },
      "options": {
        "paymentMode": "A",
        "fundWithdrawalsByPercentage": "N",
        "dbLevel": "Increase",
        "calculateSinglePremiumBand": "N",
        "billingMethod": "DirectBilling"
      },
      "noOfInstallmentYear": 0,
      "initialDumpIn": 0.00,
      "faceAmount": 800000.00, //*
      "extraRating": {
        "tempPercentage": 1.00,
        "tempPercentageDuration": 0,
        "tempFlat": 0.00,
        "tempFlatDuration": 0,
        "percentageExtra": 1.00,
        "flatExtra": 0.00
      },
      "currency": {
        "currencyPK": {
          "currencyId": "VND"
        }
      }
    },
    "channel": "Agency"
  }

  url = 'https://product-engine-service.apps.ext.eas.pcf.manulife.com/product/project?renew=Y';

  constructor(public http: HttpClient) { }



  getData(input) {
    this.jsonData.coverageInfo.faceAmount = input.faceAmt;
    this.jsonData.coverageInfo.plannedPremium = input.plannedPremium;
    this.jsonData.coverageInfo.parties.party.insuredAge = input.age;

    let riders = input.riders.map(
      r => {
        let rider = { ...this.riderSchema };
        rider.faceAmount = r.fm;
        rider.parties.party.insuredAge = r.age;
        rider.product.productKey.primaryProduct.productPK.productId = r.productId;

        console.log(rider);
        return rider;
      }
    )

    console.log(riders)

    this.jsonData.riders.coverageInfo = riders;
    return this.http.post(
      this.url, this.jsonData
    );
  }


}
