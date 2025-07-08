import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalWinnersTableComponent } from './interval-winners-table.component';

describe('IntervalWinnersTableComponent', () => {
  let component: IntervalWinnersTableComponent;
  let fixture: ComponentFixture<IntervalWinnersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntervalWinnersTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntervalWinnersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
