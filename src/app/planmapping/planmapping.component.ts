import { Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-planmapping',
  templateUrl: './planmapping.component.html',
  styleUrls: ['./planmapping.component.css']
})
export class PlanmappingComponent implements OnInit {
  selectedProduct;
  selectedPlan;
  input = {
    insuredAge: 15,
    gender: "M",
    term: 12
  }

  getSelectedPlan() {
    let userinfo = this.input;

    let avaliablePlans = this.selectedProduct.plans.filter(
      p => {
        console.log(p.mappings,
          (!p.mappings.insuredAge || (p.mappings.insuredAge.min < userinfo.insuredAge && p.mappings.insuredAge.max > userinfo.insuredAge)),
          (!p.mappings.gender || (p.mappings.gender == userinfo.gender))
        )

        return (
          (!p.mappings.insuredAge || (p.mappings.insuredAge.min < userinfo.insuredAge && p.mappings.insuredAge.max > userinfo.insuredAge))
          &&
          (!p.mappings.gender || (p.mappings.gender == userinfo.gender))
        )
      }
    )
    return avaliablePlans;
  }

  updatedSelectedPlan() {
    this.input.term = this.selectedPlan.mappings.duration;


  }

  productMapping =
  [
    {
      productCode: "UL",
      plans:
      [
        {
          plancode: "UL007",
          mappings: {
            insurerTypes: null,
            gender: null,
            insuredAge: null,
            duration: null
          },
          riders: ["TR", "HC", "CI", "MC", "AD&D"]
        }
      ]
    },
    {
      productCode: "CIE",
      plans:
      [
        {
          plancode: "ENC12",
          riders: ["TR", "HC", "MC", "AD&D"],
          mappings: {
            insurerTypes: null,
            gender: null,
            insuredAge: {
              min: 0,
              max: 17
            },
            duration: 12
          }
        },
        {
          plancode: "ENC15",
          mappings: {
            insurerTypes: null,
            gender: null,
            insuredAge: {
              min: 0,
              max: 17
            },
            duration: 15
          },
          riders: ["TR", "HC", "MC", "AD&D"]
        },
        {
          plancode: "ENC20",
          mappings: {
            insurerTypes: null,
            gender: null,
            insuredAge: {
              min: 0,
              max: 17
            },
            duration: 20
          },
          riders: ["TR", "HC", "MC", "AD&D"]
        },
        {
          plancode: "ENM12",
          mappings: {
            insurerTypes: null,
            gender: "M",
            insuredAge: {
              min: 18,
              max: 99
            },
            duration: 12
          },
          riders: ["TR", "HC", "MC", "AD&D"]
        },
        {
          plancode: "ENF12",
          mappings: {
            insurerTypes: null,
            gender: "F",
            insuredAge: {
              min: 18,
              max: 99
            },
            duration: 12
          },
          riders: ["TR", "HC", "MC", "AD&D"]
        }
      ]
    }

  ]
  constructor() { }

  ngOnInit() {
  }

}
