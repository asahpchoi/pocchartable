import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopupInputComponent } from './topup-input.component';

describe('TopupInputComponent', () => {
  let component: TopupInputComponent;
  let fixture: ComponentFixture<TopupInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopupInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopupInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
