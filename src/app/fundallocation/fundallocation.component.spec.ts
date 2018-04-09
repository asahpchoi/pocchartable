import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundallocationComponent } from './fundallocation.component';

describe('FundallocationComponent', () => {
  let component: FundallocationComponent;
  let fixture: ComponentFixture<FundallocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundallocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundallocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
