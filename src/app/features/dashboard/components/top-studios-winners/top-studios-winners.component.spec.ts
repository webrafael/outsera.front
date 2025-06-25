import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { from, of, throwError } from 'rxjs';

import { Studios } from '@shared/models/studios.model';
import { MovieService } from '@shared/services/movies/movie.service';

import { TopStudiosWinnersComponent } from './top-studios-winners.component';

describe('TopStudiosWinnersComponent', () => {
  let component: TopStudiosWinnersComponent;
  let fixture: ComponentFixture<TopStudiosWinnersComponent>;
  let movieService: jasmine.SpyObj<MovieService>;

  const mockStudios: Studios = {
    studios: [
      { name: 'Studio A', winCount: 15 },
      { name: 'Studio B', winCount: 25 },
      { name: 'Studio C', winCount: 8 },
      { name: 'Studio D', winCount: 30 },
      { name: 'Studio E', winCount: 12 }
    ]
  };

  beforeEach(async () => {
    const movieServiceSpy = jasmine.createSpyObj('MovieService', ['getStudios']);

    await TestBed.configureTestingModule({
      imports: [
        TopStudiosWinnersComponent
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MovieService, useValue: movieServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopStudiosWinnersComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('1. Carregamento dos filmes', () => {
    it('deve inicializar com lista de estúdios vazia', () => {
      expect(component.studios).toEqual({ studios: [] });
      expect(component.loading).toBeFalse();
    });

    it('deve carregar estúdios no ngOnInit', fakeAsync(() => {
      movieService.getStudios.and.returnValue(of(mockStudios));

      fixture.detectChanges();
      tick();

      expect(movieService.getStudios).toHaveBeenCalledWith({
        projection: 'studios-with-win-count'
      });
      // O componente filtra automaticamente para o top 3
      expect(component.studios.studios.length).toBe(3);
      expect(component.studios.studios[0].name).toBe('Studio D'); // 30 vitórias
      expect(component.studios.studios[1].name).toBe('Studio B'); // 25 vitórias
      expect(component.studios.studios[2].name).toBe('Studio A'); // 15 vitórias
      expect(component.loading).toBeFalse();
    }));

    it('deve exibir loading durante carregamento', fakeAsync(() => {
      // Usa um observable que não completa imediatamente
      let resolvePromise: (value: Studios) => void;
      const delayedObservable = new Promise<Studios>((resolve) => {
        resolvePromise = resolve;
      });

      movieService.getStudios.and.returnValue(from(delayedObservable));

      fixture.detectChanges();

      // Durante carregamento
      expect(component.loading).toBeTrue();

      // Completa o carregamento
      resolvePromise!(mockStudios);
      tick();

      // Após carregamento
      expect(component.loading).toBeFalse();
    }));

    it('deve lidar com erro no carregamento', fakeAsync(() => {
      const errorMessage = 'Erro ao carregar estúdios';
      movieService.getStudios.and.returnValue(throwError(() => new Error(errorMessage)));

      fixture.detectChanges();
      tick();

      expect(component.loading).toBeFalse();
      expect(component.studios).toEqual({ studios: [] });
    }));

    it('deve renderizar tabela com dados dos estúdios', fakeAsync(() => {
      movieService.getStudios.and.returnValue(of(mockStudios));

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const tableRows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(tableRows.length).toBe(3); // Top 3 estúdios (filtro automático)

      // Verifica se são os estúdios corretos (top 3 ordenados)
      const firstRow = tableRows[0];
      const firstRowCells = firstRow.queryAll(By.css('td'));
      expect(firstRowCells[0].nativeElement.textContent).toContain('Studio D'); // 30 vitórias
      expect(firstRowCells[1].nativeElement.textContent).toContain('30');

      const secondRow = tableRows[1];
      const secondRowCells = secondRow.queryAll(By.css('td'));
      expect(secondRowCells[0].nativeElement.textContent).toContain('Studio B'); // 25 vitórias
      expect(secondRowCells[1].nativeElement.textContent).toContain('25');

      const thirdRow = tableRows[2];
      const thirdRowCells = thirdRow.queryAll(By.css('td'));
      expect(thirdRowCells[0].nativeElement.textContent).toContain('Studio A'); // 15 vitórias
      expect(thirdRowCells[1].nativeElement.textContent).toContain('15');
    }));

    it('deve exibir mensagem de loading na tabela', fakeAsync(() => {
      // Usa um observable que não completa imediatamente
      let resolvePromise: (value: Studios) => void;
      const delayedObservable = new Promise<Studios>((resolve) => {
        resolvePromise = resolve;
      });

      movieService.getStudios.and.returnValue(from(delayedObservable));

      // Inicia carregamento - ngOnInit é chamado
      fixture.detectChanges();

      // Durante carregamento - deve exibir loading
      expect(component.loading).toBeTrue();

      const loadingRow = fixture.debugElement.query(By.css('tbody tr td'));
      expect(loadingRow.nativeElement.textContent).toContain('Loading...');

      // Completa o carregamento
      resolvePromise!(mockStudios);
      tick();
    }));

    it('deve chamar serviço com parâmetros corretos', fakeAsync(() => {
      movieService.getStudios.and.returnValue(of(mockStudios));

      fixture.detectChanges();
      tick();

      expect(movieService.getStudios).toHaveBeenCalledWith({
        projection: 'studios-with-win-count'
      });
    }));
  });

  describe('2. Filtro pelo top 3', () => {
    it('deve filtrar e ordenar pelo top 3 estúdios com mais vitórias', fakeAsync(() => {
      movieService.getStudios.and.returnValue(of(mockStudios));

      fixture.detectChanges();
      tick();

      // Deve ter apenas 3 estúdios (top 3)
      expect(component.studios.studios.length).toBe(3);

      // Deve estar ordenado por winCount decrescente
      expect(component.studios.studios[0].name).toBe('Studio D'); // 30 vitórias
      expect(component.studios.studios[0].winCount).toBe(30);
      expect(component.studios.studios[1].name).toBe('Studio B'); // 25 vitórias
      expect(component.studios.studios[1].winCount).toBe(25);
      expect(component.studios.studios[2].name).toBe('Studio A'); // 15 vitórias
      expect(component.studios.studios[2].winCount).toBe(15);
    }));

    it('deve renderizar apenas top 3 na tabela', fakeAsync(() => {
      movieService.getStudios.and.returnValue(of(mockStudios));

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const tableRows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(tableRows.length).toBe(3); // Apenas top 3

      // Verifica se são os estúdios corretos
      const firstRow = tableRows[0];
      const firstRowCells = firstRow.queryAll(By.css('td'));
      expect(firstRowCells[0].nativeElement.textContent).toContain('Studio D');
      expect(firstRowCells[1].nativeElement.textContent).toContain('30');

      const secondRow = tableRows[1];
      const secondRowCells = secondRow.queryAll(By.css('td'));
      expect(secondRowCells[0].nativeElement.textContent).toContain('Studio B');
      expect(secondRowCells[1].nativeElement.textContent).toContain('25');

      const thirdRow = tableRows[2];
      const thirdRowCells = thirdRow.queryAll(By.css('td'));
      expect(thirdRowCells[0].nativeElement.textContent).toContain('Studio A');
      expect(thirdRowCells[1].nativeElement.textContent).toContain('15');
    }));

    it('deve lidar com menos de 3 estúdios', fakeAsync(() => {
      const fewStudios: Studios = {
        studios: [
          { name: 'Studio A', winCount: 10 },
          { name: 'Studio B', winCount: 5 }
        ]
      };

      movieService.getStudios.and.returnValue(of(fewStudios));

      fixture.detectChanges();
      tick();

      // Deve retornar todos os estúdios disponíveis
      expect(component.studios.studios.length).toBe(2);
      expect(component.studios.studios[0].name).toBe('Studio A');
      expect(component.studios.studios[1].name).toBe('Studio B');
    }));

    it('deve lidar com lista vazia de estúdios', fakeAsync(() => {
      const emptyStudios: Studios = { studios: [] };

      movieService.getStudios.and.returnValue(of(emptyStudios));

      fixture.detectChanges();
      tick();

      expect(component.studios.studios.length).toBe(0);
    }));

    it('deve ordenar corretamente estúdios com winCount igual', fakeAsync(() => {
      const equalWinCountStudios: Studios = {
        studios: [
          { name: 'Studio A', winCount: 20 },
          { name: 'Studio B', winCount: 20 },
          { name: 'Studio C', winCount: 20 },
          { name: 'Studio D', winCount: 15 }
        ]
      };

      movieService.getStudios.and.returnValue(of(equalWinCountStudios));

      fixture.detectChanges();
      tick();

      // Deve retornar top 3 (todos com 20 vitórias)
      expect(component.studios.studios.length).toBe(3);
      expect(component.studios.studios[0].winCount).toBe(20);
      expect(component.studios.studios[1].winCount).toBe(20);
      expect(component.studios.studios[2].winCount).toBe(20);
    }));

    it('deve manter estrutura de dados correta após filtro', fakeAsync(() => {
      movieService.getStudios.and.returnValue(of(mockStudios));

      fixture.detectChanges();
      tick();

      // Deve manter a estrutura Studios
      expect(component.studios).toEqual({
        studios: [
          { name: 'Studio D', winCount: 30 },
          { name: 'Studio B', winCount: 25 },
          { name: 'Studio A', winCount: 15 }
        ]
      });
    }));
  });

  describe('Integração entre funcionalidades', () => {
    it('deve carregar e filtrar em sequência correta', fakeAsync(() => {
      // Usa um observable que não completa imediatamente
      let resolvePromise: (value: Studios) => void;
      const delayedObservable = new Promise<Studios>((resolve) => {
        resolvePromise = resolve;
      });

      movieService.getStudios.and.returnValue(from(delayedObservable));

      // Estado inicial
      expect(component.studios).toEqual({ studios: [] });
      expect(component.loading).toBeFalse();

      // Inicia carregamento - ngOnInit é chamado
      fixture.detectChanges();
      expect(component.loading).toBeTrue();

      // Completa o carregamento
      resolvePromise!(mockStudios);
      tick();

      // Após carregamento e filtro
      expect(component.loading).toBeFalse();
      expect(component.studios.studios.length).toBe(3);
      expect(component.studios.studios[0].winCount).toBe(30);
    }));

    it('deve renderizar tabela corretamente após carregamento e filtro', fakeAsync(() => {
      movieService.getStudios.and.returnValue(of(mockStudios));

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      // Verifica estrutura da tabela
      const thead = fixture.debugElement.query(By.css('thead'));
      const headerCells = thead.queryAll(By.css('th'));
      expect(headerCells[0].nativeElement.textContent).toContain('Name');
      expect(headerCells[1].nativeElement.textContent).toContain('Win Count');

      // Verifica dados filtrados
      const tbody = fixture.debugElement.query(By.css('tbody'));
      const dataRows = tbody.queryAll(By.css('tr'));
      expect(dataRows.length).toBe(3);

      // Verifica primeiro estúdio (maior winCount)
      const firstRowCells = dataRows[0].queryAll(By.css('td'));
      expect(firstRowCells[0].nativeElement.textContent.trim()).toBe('Studio D');
      expect(firstRowCells[1].nativeElement.textContent.trim()).toBe('30');
    }));
  });
});
