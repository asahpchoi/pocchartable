import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerindicatorComponent } from './customerindicator.component';

describe('CustomerindicatorComponent', () => {
  let component: CustomerindicatorComponent;
  let fixture: ComponentFixture<CustomerindicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerindicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerindicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
