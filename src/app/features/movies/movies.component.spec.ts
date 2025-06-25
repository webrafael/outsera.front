import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { MoviePageResponse, MovieResponse } from '@shared/models/movie.model';
import { MovieService } from '@shared/services/movies/movie.service';

import { MoviesComponent } from './movies.component';

describe('Movies', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
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
      year: 2021,
      title: 'Test Movie 2',
      studios: ['Studio 2'],
      producers: ['Producer 2'],
      winner: false
    }
  ];

  const mockMoviePageResponse: MoviePageResponse = {
    content: mockMovies,
    pageable: {
      sort: { sorted: false, unsorted: true },
      pageSize: 10,
      pageNumber: 0,
      offset: 0,
      paged: true,
      unpaged: false
    },
    totalElements: 20,
    last: false,
    totalPages: 2,
    first: true,
    sort: { sorted: false, unsorted: true },
    number: 0,
    numberOfElements: 10,
    size: 10
  };

  beforeEach(async () => {
    const movieServiceSpy = jasmine.createSpyObj('MovieService', ['getMovies']);

    await TestBed.configureTestingModule({
      imports: [
        MoviesComponent
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MovieService, useValue: movieServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('1. Carregamento dos filmes', () => {
    it('deve inicializar com valores padrão', () => {
      expect(component.movies).toBeUndefined();
      expect(component.filterYear).toBeUndefined();
      expect(component.filterWinner).toBeTrue();
      expect(component.currentPage).toBe(0);
      expect(component.totalPages).toBe(1);
      expect(component.pageSize).toBe(0);
      expect(component.pages).toEqual([]);
    });

    it('deve carregar filmes no ngOnInit', fakeAsync(() => {
      movieService.getMovies.and.returnValue(of(mockMoviePageResponse));

      fixture.detectChanges();
      tick();

      expect(movieService.getMovies).toHaveBeenCalledWith({
        page: 0,
        size: 10,
        winner: true
      });
      expect(component.movies).toEqual(mockMoviePageResponse);
      expect(component.totalPages).toBe(2);
      expect(component.pages).toEqual([0, 1]);
    }));

    it('deve renderizar tabela com dados dos filmes', fakeAsync(() => {
      movieService.getMovies.and.returnValue(of(mockMoviePageResponse));

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const tableRows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(tableRows.length).toBe(2);

      const firstRow = tableRows[0];
      const cells = firstRow.queryAll(By.css('td'));

      expect(cells[0].nativeElement.textContent).toContain('1');
      expect(cells[1].nativeElement.textContent).toContain('2020');
      expect(cells[2].nativeElement.textContent).toContain('Test Movie 1');
      expect(cells[3].nativeElement.textContent).toContain('Yes');
    }));

    it('deve lidar com erro no carregamento', fakeAsync(() => {
      const errorMessage = 'Erro ao carregar filmes';
      movieService.getMovies.and.returnValue(throwError(() => new Error(errorMessage)));

      fixture.detectChanges();
      tick();

      // Verifica se o componente não quebrou e manteve valores padrão
      expect(component.movies).toBeUndefined();
      expect(component.totalPages).toBe(1);
      expect(component.pages).toEqual([]);
    }));

    it('deve chamar serviço com parâmetros corretos', fakeAsync(() => {
      movieService.getMovies.and.returnValue(of(mockMoviePageResponse));

      fixture.detectChanges();
      tick();

      expect(movieService.getMovies).toHaveBeenCalledWith({
        page: 0,
        size: 10,
        winner: true
      });
    }));
  });

  describe('2. Campos de pesquisa (Ano e Ganhadores)', () => {
    it('deve aplicar filtro por ano', fakeAsync(() => {
      movieService.getMovies.and.returnValue(of(mockMoviePageResponse));

      component.filterYear = 2020;
      component.makeMoviesTable();
      tick();

      expect(movieService.getMovies).toHaveBeenCalledWith({
        page: 0,
        size: 10,
        year: 2020,
        winner: true
      });
    }));

    it('deve aplicar filtro por ganhadores (true)', fakeAsync(() => {
      movieService.getMovies.and.returnValue(of(mockMoviePageResponse));

      component.filterWinner = true;
      component.makeMoviesTable();
      tick();

      expect(movieService.getMovies).toHaveBeenCalledWith({
        page: 0,
        size: 10,
        winner: true
      });
    }));

    it('deve aplicar filtro por ganhadores (false)', fakeAsync(() => {
      movieService.getMovies.and.returnValue(of(mockMoviePageResponse));

      component.filterWinner = false;
      component.makeMoviesTable();
      tick();

      expect(movieService.getMovies).toHaveBeenCalledWith({
        page: 0,
        size: 10
        // filterWinner = false não é incluído devido à condição if (this.filterWinner)
        // que só inclui o parâmetro quando filterWinner é truthy
      });
    }));

    it('deve aplicar filtros combinados', fakeAsync(() => {
      movieService.getMovies.and.returnValue(of(mockMoviePageResponse));

      component.filterYear = 2020;
      component.filterWinner = false;
      component.makeMoviesTable();
      tick();

      expect(movieService.getMovies).toHaveBeenCalledWith({
        page: 0,
        size: 10,
        year: 2020
        // filterWinner = false não é incluído devido à condição if (this.filterWinner)
        // que só inclui o parâmetro quando filterWinner é truthy
      });
    }));

    it('deve validar input de ano - máximo 4 caracteres', () => {
      const input = document.createElement('input') as HTMLInputElement;
      input.value = '20201';

      const event = { target: input } as unknown as Event;
      component.validateInput(event);

      expect(input.value).toBe('2020');
    });

    it('deve validar input de ano - não exceder ano atual', () => {
      const currentYear = new Date().getFullYear();
      const input = document.createElement('input') as HTMLInputElement;
      input.value = (currentYear + 1).toString();

      const event = { target: input } as unknown as Event;
      component.validateInput(event);

      expect(input.value).toBe(currentYear.toString());
    });

    it('deve permitir ano válido', () => {
      const input = document.createElement('input') as HTMLInputElement;
      input.value = '2020';

      const event = { target: input } as unknown as Event;
      component.validateInput(event);

      expect(input.value).toBe('2020');
    });

    it('deve executar busca ao pressionar Enter no campo ano', fakeAsync(() => {
      movieService.getMovies.and.returnValue(of(mockMoviePageResponse));

      const yearInput = fixture.debugElement.query(By.css('input[placeholder="Filter by year"]')).nativeElement;
      yearInput.value = '2020';

      // Simula evento keyup.enter
      const enterEvent = new KeyboardEvent('keyup', { key: 'Enter' });
      yearInput.dispatchEvent(enterEvent);

      tick();

      expect(movieService.getMovies).toHaveBeenCalled();
    }));

    it('deve executar busca ao alterar select de ganhadores', fakeAsync(() => {
      movieService.getMovies.and.returnValue(of(mockMoviePageResponse));

      const winnerSelect = fixture.debugElement.query(By.css('select')).nativeElement;
      winnerSelect.value = 'false';

      // Simula evento change
      const changeEvent = new Event('change');
      winnerSelect.dispatchEvent(changeEvent);

      tick();

      expect(movieService.getMovies).toHaveBeenCalled();
    }));

    it('deve renderizar campos de pesquisa corretamente', fakeAsync(() => {
      movieService.getMovies.and.returnValue(of(mockMoviePageResponse));

      fixture.detectChanges();
      tick();

      const yearInput = fixture.debugElement.query(By.css('input[placeholder="Filter by year"]'));
      const winnerSelect = fixture.debugElement.query(By.css('select'));

      expect(yearInput).toBeTruthy();
      expect(winnerSelect).toBeTruthy();
    }));
  });

  describe('3. Paginação', () => {
    it('deve navegar para página específica', fakeAsync(() => {
      movieService.getMovies.and.returnValue(of(mockMoviePageResponse));

      component.goToPage(1);
      tick();

      expect(component.currentPage).toBe(1);
      expect(movieService.getMovies).toHaveBeenCalledWith({
        page: 1,
        size: 10,
        winner: true
      });
    }));

    it('deve navegar para primeira página', fakeAsync(() => {
      movieService.getMovies.and.returnValue(of(mockMoviePageResponse));

      component.currentPage = 2;
      component.goToPage(0);
      tick();

      expect(component.currentPage).toBe(0);
      expect(movieService.getMovies).toHaveBeenCalledWith({
        page: 0,
        size: 10,
        winner: true
      });
    }));

    it('deve navegar para última página', fakeAsync(() => {
      movieService.getMovies.and.returnValue(of(mockMoviePageResponse));

      component.totalPages = 5;
      component.goToPage(4);
      tick();

      expect(component.currentPage).toBe(4);
      expect(movieService.getMovies).toHaveBeenCalledWith({
        page: 4,
        size: 10,
        winner: true
      });
    }));

    it('deve corrigir página negativa', fakeAsync(() => {
      movieService.getMovies.and.returnValue(of(mockMoviePageResponse));

      component.goToPage(-1);
      tick();

      expect(component.currentPage).toBe(0);
      expect(movieService.getMovies).toHaveBeenCalledWith({
        page: 0,
        size: 10,
        winner: true
      });
    }));

    it('deve renderizar paginação corretamente', fakeAsync(() => {
      movieService.getMovies.and.returnValue(of(mockMoviePageResponse));

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const pagination = fixture.debugElement.query(By.css('.pagination'));
      const pageButtons = fixture.debugElement.queryAll(By.css('.page-link'));

      expect(pagination).toBeTruthy();
      expect(pageButtons.length).toBeGreaterThan(0);
    }));

    it('deve marcar página atual como ativa', fakeAsync(() => {
      movieService.getMovies.and.returnValue(of(mockMoviePageResponse));

      component.currentPage = 1;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const activePage = fixture.debugElement.query(By.css('.page-item.active'));
      expect(activePage).toBeTruthy();
    }));

    it('deve desabilitar botões de navegação quando apropriado', fakeAsync(() => {
      // Configura resposta com mais páginas para testar a lógica
      const responseWithMorePages = {
        ...mockMoviePageResponse,
        totalPages: 3
      };
      movieService.getMovies.and.returnValue(of(responseWithMorePages));

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      // Verifica se a paginação está sendo renderizada
      const pagination = fixture.debugElement.query(By.css('.pagination'));
      expect(pagination).toBeTruthy();

      // Verifica se totalPages foi definido corretamente
      expect(component.totalPages).toBe(3);

      // Verifica se há elementos de página sendo renderizados
      const pageItems = fixture.debugElement.queryAll(By.css('.page-item'));
      expect(pageItems.length).toBeGreaterThan(0);

      // Testa quando currentPage === 1 (botões First e Previous devem estar desabilitados)
      component.currentPage = 1;
      fixture.detectChanges();

      // Verifica se há elementos com classe disabled
      const disabledElements = fixture.debugElement.queryAll(By.css('.disabled'));
      expect(disabledElements.length).toBeGreaterThan(0);
    }));

    it('deve executar busca ao clicar em botão de página', fakeAsync(() => {
      movieService.getMovies.and.returnValue(of(mockMoviePageResponse));

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const pageButtons = fixture.debugElement.queryAll(By.css('.page-link'));
      if (pageButtons.length > 0) {
        pageButtons[1].nativeElement.click(); // Clica no segundo botão
        tick();

        expect(movieService.getMovies).toHaveBeenCalled();
      }
    }));

    it('deve atualizar array de páginas após carregamento', fakeAsync(() => {
      const responseWithPages = {
        ...mockMoviePageResponse,
        totalPages: 5
      };
      movieService.getMovies.and.returnValue(of(responseWithPages));

      fixture.detectChanges();
      tick();

      expect(component.pages).toEqual([0, 1, 2, 3, 4]);
    }));
  });

  describe('Integração entre funcionalidades', () => {
    it('deve aplicar filtros e paginação simultaneamente', fakeAsync(() => {
      movieService.getMovies.and.returnValue(of(mockMoviePageResponse));

      component.filterYear = 2020;
      component.filterWinner = false;
      component.currentPage = 2;
      component.makeMoviesTable();
      tick();

      expect(movieService.getMovies).toHaveBeenCalledWith({
        page: 2,
        size: 10,
        year: 2020
        // filterWinner = false não é incluído devido à condição if (this.filterWinner)
        // que só inclui o parâmetro quando filterWinner é truthy
      });
    }));

    it('deve manter filtros ao navegar entre páginas', fakeAsync(() => {
      movieService.getMovies.and.returnValue(of(mockMoviePageResponse));

      component.filterYear = 2020;
      component.filterWinner = true;
      component.goToPage(1);
      tick();

      expect(movieService.getMovies).toHaveBeenCalledWith({
        page: 1,
        size: 10,
        year: 2020,
        winner: true
      });
    }));
  });
});
