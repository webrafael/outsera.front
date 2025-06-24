import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesByYearComponent } from './movies-by-year.component';

describe('MoviesByYearComponent', () => {
  let component: MoviesByYearComponent;
  let fixture: ComponentFixture<MoviesByYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesByYearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesByYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
