import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionItemComponent } from './decision-item.component';

describe('DecisionItemComponent', () => {
  let component: DecisionItemComponent;
  let fixture: ComponentFixture<DecisionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecisionItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
