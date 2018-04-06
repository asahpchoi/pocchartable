import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamiccallComponent } from './dynamiccall.component';

describe('DynamiccallComponent', () => {
  let component: DynamiccallComponent;
  let fixture: ComponentFixture<DynamiccallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamiccallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamiccallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
