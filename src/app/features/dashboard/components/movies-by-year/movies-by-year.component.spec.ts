import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesByYearComponent } from './movies-by-year.component';

describe('MoviesByYearComponent', () => {
  let component: MoviesByYearComponent;
  let fixture: ComponentFixture<MoviesByYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MoviesByYearComponent
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
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
