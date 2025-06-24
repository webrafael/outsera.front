import { provideHttpClient, withFetch } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { IntervalWinParams } from '../../models/interval-win.model';
import { MovieByYearParams, MovieQueryParams } from '../../models/movie.model';
import { StudiosParams } from '../../models/studios.model';
import { YearsParams } from '../../models/years.model';
import { MovieService } from './movie.service';

// Aqui é um teste simples para verificar se o serviço está sendo criado e se as funções estão sendo definidas.
// Não é um teste completo, mas é um bom ponto de partida para verificar se o serviço está sendo criado e se as funções estão sendo definidas.
describe('MovieService', () => {
  let service: MovieService;
  let mockEnvironment: any;

  beforeEach(() => {
    // Mock do environment
    mockEnvironment = {
      apiURL: 'https://challenge.outsera.tech/api',
      paths: {
        movies: '/movies'
      }
    };

    TestBed.configureTestingModule({
      providers: [
        MovieService,
        { provide: 'environment', useValue: mockEnvironment },
        provideHttpClient(withFetch())
      ]
    });

    service = TestBed.inject(MovieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMovies', () => {
    it('should be defined', () => {
      expect(service.getMovies).toBeDefined();
    });

    it('should accept parameters', () => {
      const params: MovieQueryParams = {
        page: 0,
        size: 10
      };
      expect(() => service.getMovies(params)).not.toThrow();
    });
  });

  describe('getYearsWithMultipleWinners', () => {
    it('should be defined', () => {
      expect(service.getYearsWithMultipleWinners).toBeDefined();
    });

    it('should accept parameters', () => {
      const params: YearsParams = {
        projection: 'years-with-multiple-winners'
      };
      expect(() => service.getYearsWithMultipleWinners(params)).not.toThrow();
    });
  });

  describe('getStudios', () => {
    it('should be defined', () => {
      expect(service.getStudios).toBeDefined();
    });

    it('should accept parameters', () => {
      const params: StudiosParams = {
        projection: 'studios-with-win-count'
      };
      expect(() => service.getStudios(params)).not.toThrow();
    });
  });

  describe('getIntervalWin', () => {
    it('should be defined', () => {
      expect(service.getIntervalWin).toBeDefined();
    });

    it('should accept parameters', () => {
      const params: IntervalWinParams = {
        projection: 'max-min-win-interval-for-producer'
      };
      expect(() => service.getIntervalWin(params)).not.toThrow();
    });
  });

  describe('getMovieByYear', () => {
    it('should be defined', () => {
      expect(service.getMovieByYear).toBeDefined();
    });

    it('should accept parameters', () => {
      const params: MovieByYearParams = {
        year: 2020,
        winner: true
      };
      expect(() => service.getMovieByYear(params)).not.toThrow();
    });
  });
});
