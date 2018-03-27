import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCompComponent } from './custom-comp.component';

describe('CustomCompComponent', () => {
  let component: CustomCompComponent;
  let fixture: ComponentFixture<CustomCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
