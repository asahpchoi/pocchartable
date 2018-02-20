import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PremiumService {


  jsonData = {
    "reference": "",
    "policyYearDate": "20170228024534",
    "policyExcludeSOS": "Y",
    "sortRider": "Y",
    "channel": "BANK",
    "coverageInfo": {
      "product": {
        "productKey": {
          "primaryProduct": {
            "productPK": {
              "productId": "US789"
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
          "valueDate": "20170228024534",
          "location": "PH"
        }
      },
      "currency": {
        "currencyPK": {
          "currencyId": "PHP"
        }
      },
      "faceAmount": "125000",
      "options": {
        "billingMethod": "SINGLE",
        "dbLevel": "Increase",
        "paymentMode": "A",
        "fundWithdrawalsByPercentage": "Y",
        "calculateSinglePremiumBand": "Y"
      },
      "otherOptions": null,
      "startAnnuityAge": "0",
      "parties": {
        "party": {
          "insuredId": "aaa aaa",
          "insuredAge": "30",
          "insuredSex": "M",
          "smokingStatus": "ST",
          "type": "BASIC"
        }
      },
      "extraRating": {
        "flatExtra": "0.0",
        "percentageExtra": "1.0",
        "tempFlat": "0.0",
        "tempFlatDuration": "0",
        "tempPercentage": "0.0",
        "tempPercentageDuration": "0"
      },
      "band": "0",
      "ipoLayer": "0",
      "noOfInstallmentYear": "0",
      "prepayYear": "0",
      "withdrawPercent": "0.0",
      "plannedPremium": "0.0",
      "compropPremium": "0.0",
      "refundPremium": "0.0",
      "topUpPremium": "0.0",
      "initialDumpIn": "100000.0",
      "basicIncreasingPremiumPercentage": "0.0",
      "topUpIncreasingPremiumPercentage": "0.0",
      "fundInt": "5.0",
      "fixedAmount": "0",
      "dividendWithdrawals": ""
    },
    "riders": null,
    "funds": {
      "fundRecord": [
        {
          "allocation": "60.00",
          "returnRate": "4.0000",
          "returnRateMedium": "8.0000",
          "returnRateHigh": "10.0000",
          "guaranteedPercentage": "0.0000",
          "targetPayoutRate": "0.0000",
          "_code": "SECURE"
        },
        {
          "allocation": "40.00",
          "returnRate": "4.0000",
          "returnRateMedium": "8.0000",
          "returnRateHigh": "10.0000",
          "guaranteedPercentage": "0.0000",
          "targetPayoutRate": "0.0000",
          "_code": "DIVERSIFIED"
        }
      ]
    },
    "fundActivities": {
      "fundActivity": [
        {
          "attainAge": "40",
          "topupPremium": "20000.0",
          "withdrawal": "10000.0"
        },
        {
          "attainAge": "41",
          "topupPremium": "20000.0",
          "withdrawal": "10000.0"
        },
        {
          "attainAge": "42",
          "topupPremium": "20000.0",
          "withdrawal": "10000.0"
        },
        {
          "attainAge": "43",
          "topupPremium": "20000.0",
          "withdrawal": "10000.0"
        },
        {
          "attainAge": "44",
          "withdrawal": "10000.0"
        },
        {
          "attainAge": "45",
          "withdrawal": "10000.0"
        }
      ]
    }
  }
  url = 'https://product-engine-nodejs.herokuapp.com/api/v1/product/project';

  constructor(public http: HttpClient) { }

  getData(faceAmt) {
    console.log(this.jsonData.coverageInfo.faceAmount);
    this.jsonData.coverageInfo.faceAmount = faceAmt + '';
    console.log(this.jsonData)
    return this.http.post(
      this.url, this.jsonData
    );
  }


}
