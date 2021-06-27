import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningDevelopmentComponent } from './earning-development.component';

describe('EarningDevelopmentComponent', () => {
  let component: EarningDevelopmentComponent;
  let fixture: ComponentFixture<EarningDevelopmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarningDevelopmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarningDevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
