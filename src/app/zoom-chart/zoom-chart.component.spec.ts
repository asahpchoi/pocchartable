import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomChartComponent } from './zoom-chart.component';

describe('ZoomChartComponent', () => {
  let component: ZoomChartComponent;
  let fixture: ComponentFixture<ZoomChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoomChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
