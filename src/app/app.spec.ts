import { provideHttpClient, withFetch } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { appConfig } from './app.config';
import { MoviesMockService } from './shared/mock/movies/movies.mock.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        ...appConfig.providers,
        provideHttpClient(withFetch()),
        MoviesMockService
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize movies service', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const moviesService = TestBed.inject(MoviesMockService);

    expect(moviesService).toBeTruthy();
    expect(app).toBeTruthy();
  });
});
