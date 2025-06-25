import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { from, of, throwError } from 'rxjs';

import { MovieResponse } from '@shared/models/movie.model';
import { MovieService } from '@shared/services/movies/movie.service';

import { MoviesByYearComponent } from './movies-by-year.component';

describe('MoviesByYearComponent', () => {
  let component: MoviesByYearComponent;
  let fixture: ComponentFixture<MoviesByYearComponent>;
  let movieService: jasmine.SpyObj<MovieService>;

  const mockMovies: MovieResponse[] = [
    {
      id: 1,
      year: 2020,
      title: 'Test Movie 1',
      studios: ['Studio 1'],
      producers: ['Producer 1'],
      winner: true
    },
    {
      id: 2,
      year: 2020,
      title: 'Test Movie 2',
      studios: ['Studio 2'],
      producers: ['Producer 2'],
      winner: true
    }
  ];

  beforeEach(async () => {
    const movieServiceSpy = jasmine.createSpyObj('MovieService', ['getMovieByYear']);

    await TestBed.configureTestingModule({
      imports: [
        MoviesByYearComponent
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MovieService, useValue: movieServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesByYearComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('1. Lista de filmes', () => {
    it('deve inicializar com lista de filmes vazia', () => {
      expect(component.movies).toBeUndefined();
    });

    it('deve exibir lista de filmes quando dados são carregados', fakeAsync(() => {
      movieService.getMovieByYear.and.returnValue(of(mockMovies));

      // Simula busca através do método público search
      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      input.value = '2020';
      component.search(input);

      tick(1000);

      expect(component.movies).toEqual(mockMovies);
      expect(component.loading).toBeFalse();
    }));

    it('deve exibir mensagem de loading durante carregamento', fakeAsync(() => {
      // Usa um observable que não completa imediatamente
      let resolvePromise: (value: MovieResponse[]) => void;
      const delayedObservable = new Promise<MovieResponse[]>((resolve) => {
        resolvePromise = resolve;
      });

      movieService.getMovieByYear.and.returnValue(from(delayedObservable));

      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      input.value = '2020';
      component.search(input);

      // Antes do debounce - ainda não iniciou a busca
      expect(component.loading).toBeFalse();

      // Após o debounce - busca inicia e loading fica true
      tick(1000);
      expect(component.loading).toBeTrue();

      // Completa a busca
      resolvePromise!(mockMovies);
      tick();

      // Após busca completa - loading volta para false
      expect(component.loading).toBeFalse();
    }));

    it('deve limpar lista de filmes antes de nova busca', fakeAsync(() => {
      component.movies = mockMovies;
      movieService.getMovieByYear.and.returnValue(of([]));

      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      input.value = '2021';
      component.search(input);

      tick(1000);

      expect(component.movies).toEqual([]);
    }));

    it('deve renderizar tabela com dados dos filmes', fakeAsync(() => {
      movieService.getMovieByYear.and.returnValue(of(mockMovies));

      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      input.value = '2020';
      component.search(input);

      tick(1000);
      fixture.detectChanges();

      const tableRows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(tableRows.length).toBe(2);

      const firstRow = tableRows[0];
      const cells = firstRow.queryAll(By.css('td'));

      expect(cells[0].nativeElement.textContent).toContain('1');
      expect(cells[1].nativeElement.textContent).toContain('2020');
      expect(cells[2].nativeElement.textContent).toContain('Test Movie 1');
    }));

    it('deve exibir mensagem de loading na tabela', () => {
      component.loading = true;
      fixture.detectChanges();

      const loadingRow = fixture.debugElement.query(By.css('tbody tr td'));
      expect(loadingRow.nativeElement.textContent).toContain('Loading...');
    });
  });

  describe('2. Pesquisa de filmes', () => {
    it('deve chamar serviço com parâmetros corretos', fakeAsync(() => {
      movieService.getMovieByYear.and.returnValue(of(mockMovies));

      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      input.value = '2020';
      component.search(input);

      tick(1000);

      expect(movieService.getMovieByYear).toHaveBeenCalledWith({
        winner: true,
        year: 2020
      });
    }));

    it('não deve executar busca com valor vazio', fakeAsync(() => {
      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      input.value = '';
      component.search(input);

      tick(1000);

      expect(movieService.getMovieByYear).not.toHaveBeenCalled();
    }));

    it('deve usar debounce de 1 segundo na pesquisa', fakeAsync(() => {
      movieService.getMovieByYear.and.returnValue(of(mockMovies));

      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      input.value = '2020';

      // Simula digitação
      component.search(input);

      // Antes do debounce
      expect(movieService.getMovieByYear).not.toHaveBeenCalled();

      // Após o debounce
      tick(1000);

      expect(movieService.getMovieByYear).toHaveBeenCalledWith({
        winner: true,
        year: 2020
      });
    }));

    it('deve usar distinctUntilChanged para evitar buscas repetidas', fakeAsync(() => {
      movieService.getMovieByYear.and.returnValue(of(mockMovies));

      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      input.value = '2020';

      // Primeira busca
      component.search(input);
      tick(1000);

      // Segunda busca com mesmo valor
      component.search(input);
      tick(1000);

      // Deve ter sido chamado apenas uma vez
      expect(movieService.getMovieByYear).toHaveBeenCalledTimes(1);
    }));

    it('deve lidar com erro na busca', fakeAsync(() => {
      const errorMessage = 'Erro na busca';
      movieService.getMovieByYear.and.returnValue(throwError(() => new Error(errorMessage)));

      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      input.value = '2020';
      component.search(input);

      tick(1000);

      // O loading deve ser false devido ao finalize, mesmo com erro
      expect(component.loading).toBeFalse();
      // O movies deve permanecer como array vazio definido antes da busca
      expect(component.movies).toEqual([]);
    }));

    it('deve executar busca ao pressionar Enter', fakeAsync(() => {
      movieService.getMovieByYear.and.returnValue(of(mockMovies));

      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      input.value = '2020';

      // Simula evento keyup.enter
      const enterEvent = new KeyboardEvent('keyup', { key: 'Enter' });
      input.dispatchEvent(enterEvent);

      tick(1000);

      expect(movieService.getMovieByYear).toHaveBeenCalled();
    }));

    it('deve executar busca ao clicar no botão', fakeAsync(() => {
      movieService.getMovieByYear.and.returnValue(of(mockMovies));

      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      input.value = '2020';

      const button = fixture.debugElement.query(By.css('button')).nativeElement;
      button.click();

      tick(1000);

      expect(movieService.getMovieByYear).toHaveBeenCalled();
    }));
  });

  describe('3. Validação do input', () => {
    it('deve limitar input a máximo 4 caracteres', () => {
      const input = document.createElement('input') as HTMLInputElement;
      input.value = '20201';

      const event = { target: input } as unknown as Event;
      component.validateInput(event);

      expect(input.value).toBe('2020');
    });

    it('deve permitir input com 4 caracteres ou menos', () => {
      const input = document.createElement('input') as HTMLInputElement;
      input.value = '2020';

      const event = { target: input } as unknown as Event;
      component.validateInput(event);

      expect(input.value).toBe('2020');
    });

    it('deve limitar ano ao ano atual', () => {
      const currentYear = new Date().getFullYear();
      const input = document.createElement('input') as HTMLInputElement;
      input.value = (currentYear + 1).toString();

      const event = { target: input } as unknown as Event;
      component.validateInput(event);

      expect(input.value).toBe(currentYear.toString());
    });

    it('deve permitir ano igual ao ano atual', () => {
      const currentYear = new Date().getFullYear();
      const input = document.createElement('input') as HTMLInputElement;
      input.value = currentYear.toString();

      const event = { target: input } as unknown as Event;
      component.validateInput(event);

      expect(input.value).toBe(currentYear.toString());
    });

    it('deve permitir ano menor que o ano atual', () => {
      const currentYear = new Date().getFullYear();
      const input = document.createElement('input') as HTMLInputElement;
      input.value = (currentYear - 1).toString();

      const event = { target: input } as unknown as Event;
      component.validateInput(event);

      expect(input.value).toBe((currentYear - 1).toString());
    });

    it('deve aplicar ambas as validações simultaneamente', () => {
      const currentYear = new Date().getFullYear();
      const input = document.createElement('input') as HTMLInputElement;
      input.value = (currentYear + 10).toString(); // Mais de 4 dígitos e maior que ano atual

      const event = { target: input } as unknown as Event;
      component.validateInput(event);

      expect(input.value).toBe(currentYear.toString());
    });

    it('deve ter atributo max configurado no template', () => {
      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      expect(input.getAttribute('max')).toBe(component.currentYear.toString());
    });

    it('deve desabilitar input durante loading', fakeAsync(() => {
      component.loading = true;
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      expect(input.disabled).toBeTrue();

      component.loading = false;
      fixture.detectChanges();

      expect(input.disabled).toBeFalse();
    }));

    it('deve desabilitar botão durante loading', fakeAsync(() => {
      component.loading = true;
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button')).nativeElement;
      expect(button.disabled).toBeTrue();

      component.loading = false;
      fixture.detectChanges();

      expect(button.disabled).toBeFalse();
    }));
  });

  describe('Integração entre funcionalidades', () => {
    it('deve executar validação e busca em sequência', fakeAsync(() => {
      movieService.getMovieByYear.and.returnValue(of(mockMovies));

      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      input.value = '20201'; // Valor inválido

      // Simula evento input que dispara validação e busca
      const inputEvent = new Event('input');
      input.dispatchEvent(inputEvent);

      tick(1000);

      // Deve ter validado o input para '2020' e executado a busca
      expect(movieService.getMovieByYear).toHaveBeenCalledWith({
        winner: true,
        year: 2020
      });
    }));

    it('deve manter estado consistente durante ciclo completo de busca', fakeAsync(() => {
      // Usa um observable que não completa imediatamente
      let resolvePromise: (value: MovieResponse[]) => void;
      const delayedObservable = new Promise<MovieResponse[]>((resolve) => {
        resolvePromise = resolve;
      });

      movieService.getMovieByYear.and.returnValue(from(delayedObservable));

      // Estado inicial
      expect(component.loading).toBeFalse();
      expect(component.movies).toBeUndefined();

      // Inicia busca
      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      input.value = '2020';
      component.search(input);

      // Antes do debounce - ainda não iniciou a busca
      expect(component.loading).toBeFalse();
      expect(component.movies).toBeUndefined();

      // Durante busca - após o debounce
      tick(1000);
      expect(component.loading).toBeTrue();
      expect(component.movies).toEqual([]);

      // Completa a busca
      resolvePromise!(mockMovies);
      tick();

      // Após busca completa
      expect(component.loading).toBeFalse();
      expect(component.movies).toEqual(mockMovies);
    }));
  });
});
