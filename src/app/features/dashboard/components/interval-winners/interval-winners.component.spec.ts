import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalWinnersComponent } from './interval-winners.component';

describe('IntervalWinnersComponent', () => {
  let component: IntervalWinnersComponent;
  let fixture: ComponentFixture<IntervalWinnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntervalWinnersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntervalWinnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
