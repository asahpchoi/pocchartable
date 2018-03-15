import { Injectable } from '@angular/core';

@Injectable()
export class CustomerService {
  public customerMaster =  {
    "customerId": "2",
    "agentId": "1",
    "isDirty": true,
    "isDeleted": 0,
    "occupation": {
      "transId": "OCC0001",
      "id": "1",
      "otherOccupation": ""
    },
    "dependentOccupation": {
      "1": {
        "id": "1",
        "transId": "OCC0001",
        "otherOccupation": ""
      },
      "2": {
        "id": "1",
        "transId": "OCC0001",
        "otherOccupation": ""
      },
      "3": {
        "id": "1",
        "transId": "OCC0001",
        "otherOccupation": ""
      },
      "4": {
        "id": "1",
        "transId": "OCC0001",
        "otherOccupation": ""
      },
      "5": {
        "id": "1",
        "transId": "OCC0001",
        "otherOccupation": ""
      }
    },
    "amountOfCoverage": "0",
    "customerData": {
      "customerId": "2",
      "agentId": "1",
      "lastName": "welther",
      "middleName": "F",
      "lastAccessedDate": "20170906032510",
      "firstName": "Adele",
      "dob": "19920204",
      "gender": "Female",
      "title": "Mrs.",
      "occupation": {
        "id": "1"
      },
      "homeAddress": {
        "province": {
          "value": "01"
        },
        "district": {
          "provinceId": "01",
          "value": "03"
        },
        "ward": null,
        "areaCode": "028",
        "streetNumber": "3948",
        "phoneNumber": "4839503353",
        "countryCode": "+84"
      },
      "officeAddress": {
        "province": {
          "value": "01"
        },
        "district": {
          "provinceId": "01",
          "value": "03"
        },
        "ward": {
          "provinceId": "01",
          "districtId": "03",
          "value": "02"
        },
        "areaCode": "028",
        "streetNumber": "3948",
        "phoneNumber": "4839503353",
        "countryCode": "+84"
      },
      "existingPolicy": false,
      "countryCode": "+84",
      "areaCode": "",
      "age": "25",
      "email": "paula_welther@manulife.com",
      "phoneNumber": "094350033423",
      "address": "2 Jersey St San Francisco, CA",
      "maritalStatus": "Single",
      "dependents": [{
        "id": "1",
        "relationship": "Spouse",
        "occupation": {
          "id": "1"
        },
        "lastName": "MIchael",
        "middleName": "F",
        "firstName": "Jackson",
        "gender": "Female",
        "age": "20",
        "dob": "20170926",
        "title": "Mr."
      },
      {
        "id": "2",
        "relationship": "Child",
        "occupation": {
          "id": "1"
        },
        "lastName": "Quang",
        "middleName": "F",
        "firstName": "Teo",
        "gender": "Female",
        "age": "20",
        "dob": "20170926",
        "title": "Mr."
      },
      {
        "id": "3",
        "relationship": "Child",
        "occupation": {
          "id": "1"
        },
        "lastName": "Giang",
        "middleName": "F",
        "firstName": "Coi",
        "gender": "Male",
        "age": "20",
        "dob": "20170926",
        "title": "Mr."
      },
      {
        "id": "4",
        "relationship": "Grand parent",
        "occupation": {
          "id": "1"
        },
        "lastName": "Hellp",
        "middleName": "F",
        "firstName": "World",
        "gender": "Female",
        "age": "20",
        "dob": "20170926",
        "title": "Mr."
      },
      {
        "id": "5",
        "relationship": "Parent",
        "occupation": {
          "id": "1"
        },
        "lastName": "Tell",
        "middleName": "F",
        "firstName": "Me",
        "gender": "Male",
        "age": "20",
        "dob": "20170926",
        "title": "Mr."
      }
      ],
      "referrals": [{
        "clientLastModifiedDate": "20171103170430",
        "referralId": "1",
        "fullName": "Michale",
        "phoneNumber": "32324239",
        "countryCode": "+84",
        "areaCode": "028",
        "email": "email@email.com",
        "notes": "Lorem ipsum d do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      }],
      "goals": [{
        "goalId": "1",
        "calculatorResults": "[{\"currentAge\":30,\"retirementAge\":65,\"lifeExpectancy\":20,\"salary\":40000,\"mpfContribution\":3000,\"currentAsset\":60000,\"preRetireROR\":0,\"postRetireROR\":0,\"inflationRate\":0,\"yearWait\":0,\"lifeStyleLevel\":[5000,10000,20000,50000],\"detailExpMode\":true,\"totalExp\":10000,\"totalDetailExp\":10000,\"clothesExp\":1000,\"foodExp\":5000,\"houseExp\":1000,\"transportationExp\":500,\"medicalExp\":1500,\"othersExp\":1000,\"shortfallFlag\":\"N\",\"isPostRetireROROn\":false,\"preRetireRORMax\":30,\"postRetireRORMax\":30,\"inflationRateMax\":15,\"currAsset\":60000,\"expectedMPF\":1260000,\"shorfall\":1080000,\"ideal\":2400000,\"monthlyPlannedSaving\":2571.4285714285716}]",
        "rank": "2"
      }]
    }
  };

  public customers = {
    owner: {
      role: 'owner',
      isInsured: true,
      smokingStatus : 'yes',
      age:30
    },
    insured: {
      role: 'insured',
      id: null,
      age:30
    },
    dependents:[]
  }

  constructor() { }

  getInsuredAge() {
    let insuredAge = 25;
    if (this.customers) {
      if (this.customers.owner.isInsured) {
        insuredAge =  this.customers.owner.age;
      }
      else {
        insuredAge =  this.customers.insured.age;
      }
    }
      return insuredAge?insuredAge: 30;
  }

}
