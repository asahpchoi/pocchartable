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
  selectedRider;

  input = {
    insuredAge: 15,
    gender: "M",
    term: 12
  }
  getSelectedPlan() {
    let userinfo = this.input;

    let avaliablePlans = this.selectedProduct.plans.filter(
      p => {
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
  getRiders() {

    let riders = this.riderMapping.filter(
      r => r.ridergroup == this.selectedRider
    )
    if (riders.length > 0) {
      return riders[0].ridercode;
    }
    else {
      return null;
    }
  }

  riderMapping = [
    {
      ridergroup: 'AD3',
      ridercode: ['ADD03']
    },
    {
      ridergroup: 'ECI',
      ridercode: ['ECI01']
    },
    {
      ridergroup: 'HCU',
      ridercode: ['RHC2I', 'RHC2D', 'RHC2O']
    },
    {
      ridergroup: 'MC5',
      ridercode: ['MC005']
    },
    {
      ridergroup: 'TR7',
      ridercode: ['TRI07']
    },
    {
      ridergroup: 'AD4',
      ridercode: ['ADD10', 'ADD11']
    },
    {
      ridergroup: 'HCR',
      ridercode: ['RHC1I', 'RHC1D', 'RHC1O']
    },
    {
      ridergroup: 'MC6',
      ridercode: ['MC012', 'MC013']
    },
    {
      ridergroup: 'TRI',
      ridercode: ['TRI08', 'TRI09']
    },
  ]

  defaultRiders = [{
    plancode: "UL007",
    ridercode: ['ADD03', 'ECI01']
  }]

  productMapping = [
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
          riders: ["AD3", "ECI", "HCU", "MC5", "TR7"]
        }
      ]
    },
    {
      productCode: "CIE",
      plans:
      [
        {
          plancode: "ENC12",
          riders: ["AD4", "HCR", "MC6", "TRI"],
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
          riders: ["AD4", "HCR", "MC6", "TRI"]
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
          riders: ["AD4", "HCR", "MC6", "TRI"]
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
          riders: ["AD4", "HCR", "MC6", "TRI"]
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
          riders: ["AD4", "HCR", "MC6", "TRI"]
        }
      ]
    }

  ]

  constructor() { }

  ngOnInit() {
  }

}
