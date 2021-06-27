import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningCategoriesComponent } from './earning-categories.component';

describe('EarningCategoriesComponent', () => {
  let component: EarningCategoriesComponent;
  let fixture: ComponentFixture<EarningCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarningCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarningCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
