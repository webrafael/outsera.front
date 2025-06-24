import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearsMultipleWinnersComponent } from './years-winners.component';

describe('YearsMultipleWinnersComponent', () => {
  let component: YearsMultipleWinnersComponent;
  let fixture: ComponentFixture<YearsMultipleWinnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        YearsMultipleWinnersComponent
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearsMultipleWinnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
