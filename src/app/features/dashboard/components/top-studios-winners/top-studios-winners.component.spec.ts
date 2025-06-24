import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopStudiosWinnersComponent } from './top-studios-winners.component';

describe('TopStudiosWinnersComponent', () => {
  let component: TopStudiosWinnersComponent;
  let fixture: ComponentFixture<TopStudiosWinnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TopStudiosWinnersComponent
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopStudiosWinnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
