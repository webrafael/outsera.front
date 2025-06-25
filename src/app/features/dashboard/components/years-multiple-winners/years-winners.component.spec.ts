import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { from, of, throwError } from 'rxjs';

import { Years } from '@shared/models/years.model';
import { MovieService } from '@shared/services/movies/movie.service';

import { YearsMultipleWinnersComponent } from './years-winners.component';

describe('YearsMultipleWinnersComponent', () => {
  let component: YearsMultipleWinnersComponent;
  let fixture: ComponentFixture<YearsMultipleWinnersComponent>;
  let movieService: jasmine.SpyObj<MovieService>;

  const mockYears: { years: Years[] } = {
    years: [
      { year: 1986, winnerCount: 2 },
      { year: 1990, winnerCount: 2 },
      { year: 2015, winnerCount: 2 },
      { year: 2018, winnerCount: 2 }
    ]
  };

  beforeEach(async () => {
    const movieServiceSpy = jasmine.createSpyObj('MovieService', ['getYearsWithMultipleWinners']);

    await TestBed.configureTestingModule({
      imports: [
        YearsMultipleWinnersComponent
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MovieService, useValue: movieServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearsMultipleWinnersComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('1. Carregamento dos filmes múltiplos ganhadores', () => {
    it('deve inicializar com lista de anos vazia', () => {
      expect(component.years).toEqual([]);
      expect(component.loading).toBeFalse();
    });

    it('deve carregar anos no ngOnInit', fakeAsync(() => {
      movieService.getYearsWithMultipleWinners.and.returnValue(of(mockYears));

      fixture.detectChanges();
      tick();

      expect(movieService.getYearsWithMultipleWinners).toHaveBeenCalledWith({
        projection: 'years-with-multiple-winners'
      });
      expect(component.years).toEqual(mockYears.years);
      expect(component.loading).toBeFalse();
    }));

    it('deve exibir loading durante carregamento', fakeAsync(() => {
      // Usa um observable que não completa imediatamente
      let resolvePromise: (value: { years: Years[] }) => void;
      const delayedObservable = new Promise<{ years: Years[] }>((resolve) => {
        resolvePromise = resolve;
      });

      movieService.getYearsWithMultipleWinners.and.returnValue(from(delayedObservable));

      fixture.detectChanges();

      // Durante carregamento
      expect(component.loading).toBeTrue();

      // Completa o carregamento
      resolvePromise!(mockYears);
      tick();

      // Após carregamento
      expect(component.loading).toBeFalse();
    }));

    it('deve lidar com erro no carregamento', fakeAsync(() => {
      const errorMessage = 'Erro ao carregar anos';
      movieService.getYearsWithMultipleWinners.and.returnValue(throwError(() => new Error(errorMessage)));

      fixture.detectChanges();
      tick();

      expect(component.loading).toBeFalse();
      expect(component.years).toEqual([]);
    }));

    it('deve renderizar tabela com dados dos anos', fakeAsync(() => {
      movieService.getYearsWithMultipleWinners.and.returnValue(of(mockYears));

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const tableRows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(tableRows.length).toBe(4); // Todos os anos

      const firstRow = tableRows[0];
      const cells = firstRow.queryAll(By.css('td'));

      expect(cells[0].nativeElement.textContent).toContain('1986');
      expect(cells[1].nativeElement.textContent).toContain('2');
    }));

    it('deve exibir mensagem de loading na tabela', fakeAsync(() => {
      // Usa um observable que não completa imediatamente
      let resolvePromise: (value: { years: Years[] }) => void;
      const delayedObservable = new Promise<{ years: Years[] }>((resolve) => {
        resolvePromise = resolve;
      });

      movieService.getYearsWithMultipleWinners.and.returnValue(from(delayedObservable));

      // Inicia carregamento - ngOnInit é chamado
      fixture.detectChanges();

      // Durante carregamento - deve exibir loading
      expect(component.loading).toBeTrue();

      const loadingRow = fixture.debugElement.query(By.css('tbody tr td'));
      expect(loadingRow.nativeElement.textContent).toContain('Loading...');

      // Completa o carregamento
      resolvePromise!(mockYears);
      tick();
    }));

    it('deve chamar serviço com parâmetros corretos', fakeAsync(() => {
      movieService.getYearsWithMultipleWinners.and.returnValue(of(mockYears));

      fixture.detectChanges();
      tick();

      expect(movieService.getYearsWithMultipleWinners).toHaveBeenCalledWith({
        projection: 'years-with-multiple-winners'
      });
    }));

    it('deve renderizar todos os anos na tabela', fakeAsync(() => {
      movieService.getYearsWithMultipleWinners.and.returnValue(of(mockYears));

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const tableRows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(tableRows.length).toBe(4);

      // Verifica todos os anos
      const years = [1986, 1990, 2015, 2018];
      const winnerCounts = [2, 2, 2, 2];

      tableRows.forEach((row, index) => {
        const cells = row.queryAll(By.css('td'));
        expect(cells[0].nativeElement.textContent).toContain(years[index].toString());
        expect(cells[1].nativeElement.textContent).toContain(winnerCounts[index].toString());
      });
    }));

    it('deve lidar com lista vazia de anos', fakeAsync(() => {
      const emptyYears = { years: [] };

      movieService.getYearsWithMultipleWinners.and.returnValue(of(emptyYears));

      fixture.detectChanges();
      tick();

      expect(component.years).toEqual([]);
    }));

    it('deve manter estrutura de dados correta', fakeAsync(() => {
      movieService.getYearsWithMultipleWinners.and.returnValue(of(mockYears));

      fixture.detectChanges();
      tick();

      // Deve manter a estrutura Years[]
      expect(component.years).toEqual([
        { year: 1986, winnerCount: 2 },
        { year: 1990, winnerCount: 2 },
        { year: 2015, winnerCount: 2 },
        { year: 2018, winnerCount: 2 }
      ]);
    }));

    it('deve carregar e exibir em sequência correta', fakeAsync(() => {
      // Usa um observable que não completa imediatamente
      let resolvePromise: (value: { years: Years[] }) => void;
      const delayedObservable = new Promise<{ years: Years[] }>((resolve) => {
        resolvePromise = resolve;
      });

      movieService.getYearsWithMultipleWinners.and.returnValue(from(delayedObservable));

      // Estado inicial
      expect(component.years).toEqual([]);
      expect(component.loading).toBeFalse();

      // Inicia carregamento - ngOnInit é chamado
      fixture.detectChanges();
      expect(component.loading).toBeTrue();

      // Completa o carregamento
      resolvePromise!(mockYears);
      tick();

      // Após carregamento
      expect(component.loading).toBeFalse();
      expect(component.years).toEqual(mockYears.years);
    }));

    it('deve renderizar tabela corretamente após carregamento', fakeAsync(() => {
      movieService.getYearsWithMultipleWinners.and.returnValue(of(mockYears));

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      // Verifica estrutura da tabela
      const thead = fixture.debugElement.query(By.css('thead'));
      const headerCells = thead.queryAll(By.css('th'));
      expect(headerCells[0].nativeElement.textContent).toContain('Year');
      expect(headerCells[1].nativeElement.textContent).toContain('Win Count');

      // Verifica dados
      const tbody = fixture.debugElement.query(By.css('tbody'));
      const dataRows = tbody.queryAll(By.css('tr'));
      expect(dataRows.length).toBe(4);

      // Verifica primeiro ano
      const firstRowCells = dataRows[0].queryAll(By.css('td'));
      expect(firstRowCells[0].nativeElement.textContent.trim()).toBe('1986');
      expect(firstRowCells[1].nativeElement.textContent.trim()).toBe('2');
    }));
  });
});
