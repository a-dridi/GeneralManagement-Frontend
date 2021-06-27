import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservesTableComponent } from './reserves-table.component';

describe('ReservesTableComponent', () => {
  let component: ReservesTableComponent;
  let fixture: ComponentFixture<ReservesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservesTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
