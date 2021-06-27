import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningTableComponent } from './earning-table.component';

describe('EarningTableComponent', () => {
  let component: EarningTableComponent;
  let fixture: ComponentFixture<EarningTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarningTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarningTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
