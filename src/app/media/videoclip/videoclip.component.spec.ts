import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoclipComponent } from './videoclip.component';

describe('VideoclipComponent', () => {
  let component: VideoclipComponent;
  let fixture: ComponentFixture<VideoclipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoclipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoclipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
