import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputChartSliderComponent } from './input-chart-slider.component';

describe('InputChartSliderComponent', () => {
  let component: InputChartSliderComponent;
  let fixture: ComponentFixture<InputChartSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputChartSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputChartSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
