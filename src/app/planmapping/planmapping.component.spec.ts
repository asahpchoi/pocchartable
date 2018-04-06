import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanmappingComponent } from './planmapping.component';

describe('PlanmappingComponent', () => {
  let component: PlanmappingComponent;
  let fixture: ComponentFixture<PlanmappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanmappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanmappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
