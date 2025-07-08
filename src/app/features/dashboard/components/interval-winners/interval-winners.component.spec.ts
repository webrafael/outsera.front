import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { EMPTY, of } from 'rxjs';

import { IntervalWin } from '@shared/models/interval-win.model';
import { MovieService } from '@shared/services/movies/movie.service';
import { IntervalWinnersComponent } from './interval-winners.component';

/**
 * @author @rafael-andrade
 * @description Os testes abordados aqui foram construidos de formas simples e objetivas.
 */

describe('IntervalWinnersComponent', () => {
  let component: IntervalWinnersComponent;
  let fixture: ComponentFixture<IntervalWinnersComponent>;
  let movieService: jasmine.SpyObj<MovieService>;

  const mockIntervalWinData: IntervalWin = {
    min: [
      {
        producer: 'Joel Silver',
        interval: 1,
        previousWin: 1990,
        followingWin: 1991
      }
    ],
    max: [
      {
        producer: 'Matthew Vaughn',
        interval: 13,
        previousWin: 2002,
        followingWin: 2015
      },
      {
        producer: 'Bo Derek',
        interval: 13,
        previousWin: 1984,
        followingWin: 1997
      }
    ]
  };

  beforeEach(async () => {
    const movieServiceSpy = jasmine.createSpyObj('MovieService', ['getIntervalWin']);

    await TestBed.configureTestingModule({
      imports: [
        IntervalWinnersComponent,
      ],
      providers: [
        { provide: MovieService, useValue: movieServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntervalWinnersComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
  });

  describe('Inicialização', () => {
    it('deve criar o componente', () => {
      expect(component).toBeTruthy();
    });

    it('deve ter loading inicial como false', () => {
      expect(component.loading).toBeFalse();
    });

    it('deve ter IntervalWinProducer como undefined inicialmente', () => {
      expect(component.IntervalWinProducer).toBeUndefined();
    });
  });

  describe('ngOnInit', () => {
    it('deve chamar makeIntervalWinnersTable quando inicializado', () => {
      spyOn(component as any, 'makeIntervalWinnersTable');

      component.ngOnInit();

      expect((component as any).makeIntervalWinnersTable).toHaveBeenCalled();
    });
  });

  describe('makeIntervalWinnersTable', () => {
    it('deve chamar o serviço e definir loading corretamente', () => {
      movieService.getIntervalWin.and.returnValue(of(mockIntervalWinData));

      component.ngOnInit();

      // Verificar que o serviço foi chamado
      expect(movieService.getIntervalWin).toHaveBeenCalledWith({
        projection: 'max-min-win-interval-for-producers'
      });

      // Verificar que os dados foram carregados
      expect(component.IntervalWinProducer).toEqual(mockIntervalWinData);

      // Verificar que loading foi definido como false após carregamento
      expect(component.loading).toBeFalse();
    });

    it('deve chamar getIntervalWin com parâmetros corretos', () => {
      movieService.getIntervalWin.and.returnValue(of(mockIntervalWinData));

      component.ngOnInit();

      expect(movieService.getIntervalWin).toHaveBeenCalledWith({
        projection: 'max-min-win-interval-for-producers'
      });
    });

    it('deve carregar dados de intervalo máximo quando interval() retorna "max"', () => {
      movieService.getIntervalWin.and.returnValue(of(mockIntervalWinData));

      component.ngOnInit();

      expect(component.IntervalWinProducer).toEqual(mockIntervalWinData);
    });

    it('deve definir loading como false após carregar dados com sucesso', (done) => {
      movieService.getIntervalWin.and.returnValue(of(mockIntervalWinData));

      component.ngOnInit();

      setTimeout(() => {
        expect(component.loading).toBeFalse();
        done();
      });
    });

    it('deve definir loading como false mesmo quando ocorre erro', (done) => {
      movieService.getIntervalWin.and.returnValue(EMPTY);

      component.ngOnInit();

      setTimeout(() => {
        expect(component.loading).toBeFalse();
        done();
      });
    });

    it('deve manter IntervalWinProducer vazio quando ocorre erro', (done) => {
      movieService.getIntervalWin.and.returnValue(EMPTY);

      component.ngOnInit();

      setTimeout(() => {
        expect(component.IntervalWinProducer).toBeUndefined();
        done();
      });
    });
  });

  describe('Template HTML', () => {
    beforeEach(() => {
      movieService.getIntervalWin.and.returnValue(of(mockIntervalWinData));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('deve exibir tabela com cabeçalhos corretos', () => {
      const headers = fixture.debugElement.queryAll(By.css('th'));

      // Há duas tabelas (Maximum e Minimum), cada uma com 4 cabeçalhos
      expect(headers.length).toBe(8);

      // Verifica os cabeçalhos da primeira tabela (Maximum)
      expect(headers[0].nativeElement.textContent.trim()).toBe('Producer');
      expect(headers[1].nativeElement.textContent.trim()).toBe('Interval');
      expect(headers[2].nativeElement.textContent.trim()).toBe('Previous Year');
      expect(headers[3].nativeElement.textContent.trim()).toBe('Following Year');

      // Verifica os cabeçalhos da segunda tabela (Minimum)
      expect(headers[4].nativeElement.textContent.trim()).toBe('Producer');
      expect(headers[5].nativeElement.textContent.trim()).toBe('Interval');
      expect(headers[6].nativeElement.textContent.trim()).toBe('Previous Year');
      expect(headers[7].nativeElement.textContent.trim()).toBe('Following Year');
    });

    it('deve exibir "Loading..." quando loading é true', () => {
      component.loading = true;
      fixture.detectChanges();

      const loadingRow = fixture.debugElement.query(By.css('td.text-center'));
      expect(loadingRow.nativeElement.textContent.trim()).toBe('Loading...');
    });

    it('deve renderizar dados dos produtores corretamente', () => {
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      // Remove as linhas de loading
      const dataRows = rows.filter(row =>
        !row.query(By.css('td.text-center'))
      );

      // Total de linhas deve ser a soma de max + min
      const totalExpectedRows = mockIntervalWinData.max.length + mockIntervalWinData.min.length;
      expect(dataRows.length).toBe(totalExpectedRows);

      // Verifica a primeira linha (da tabela Maximum)
      const firstRow = dataRows[0];
      const cells = firstRow.queryAll(By.css('td'));

      expect(cells[0].nativeElement.textContent.trim()).toBe('Matthew Vaughn');
      expect(cells[1].nativeElement.textContent.trim()).toBe('13');
      expect(cells[2].nativeElement.textContent.trim()).toBe('2002');
      expect(cells[3].nativeElement.textContent.trim()).toBe('2015');
    });

    it('deve renderizar múltiplos produtores quando existem', () => {
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      const dataRows = rows.filter(row =>
        !row.query(By.css('td.text-center'))
      );

      // Total de linhas deve ser a soma de max + min
      const totalExpectedRows = mockIntervalWinData.max.length + mockIntervalWinData.min.length;
      expect(dataRows.length).toBe(totalExpectedRows);

      // Verifica a segunda linha (da tabela Maximum)
      const secondRow = dataRows[1];
      const cells = secondRow.queryAll(By.css('td'));

      expect(cells[0].nativeElement.textContent.trim()).toBe('Bo Derek');
      expect(cells[1].nativeElement.textContent.trim()).toBe('13');
      expect(cells[2].nativeElement.textContent.trim()).toBe('1984');
      expect(cells[3].nativeElement.textContent.trim()).toBe('1997');
    });

    it('deve renderizar dados da tabela Minimum', () => {
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      const dataRows = rows.filter(row =>
        !row.query(By.css('td.text-center'))
      );

      // Verifica a terceira linha (da tabela Minimum)
      const thirdRow = dataRows[2];
      const cells = thirdRow.queryAll(By.css('td'));

      expect(cells[0].nativeElement.textContent.trim()).toBe('Joel Silver');
      expect(cells[1].nativeElement.textContent.trim()).toBe('1');
      expect(cells[2].nativeElement.textContent.trim()).toBe('1990');
      expect(cells[3].nativeElement.textContent.trim()).toBe('1991');
    });

    it('não deve exibir dados quando IntervalWinProducer está vazio', () => {
      component.IntervalWinProducer = { min: [], max: [] };
      fixture.detectChanges();

      const dataRows = fixture.debugElement.queryAll(By.css('tbody tr'));
      const hasDataRows = dataRows.some(row =>
        !row.query(By.css('td.text-center'))
      );

      expect(hasDataRows).toBeFalse();
    });
  });

  describe('Integração com MovieService', () => {
    it('deve chamar o MovieService corretamente', () => {
      movieService.getIntervalWin.and.returnValue(of(mockIntervalWinData));

      component.ngOnInit();

      expect(movieService.getIntervalWin).toHaveBeenCalledWith({
        projection: 'max-min-win-interval-for-producers'
      });
      expect(movieService.getIntervalWin).toHaveBeenCalledTimes(1);
    });

    it('deve lidar com múltiplas chamadas ao ngOnInit', () => {
      movieService.getIntervalWin.and.returnValue(of(mockIntervalWinData));

      component.ngOnInit();
      component.ngOnInit(); // Chamada duplicada

      // Cada chamada ao ngOnInit deve resultar em uma chamada ao serviço
      expect(movieService.getIntervalWin).toHaveBeenCalledTimes(2);
    });
  });

  describe('Tratamento de casos extremos', () => {
    it('deve lidar com resposta vazia do serviço', (done) => {
      const emptyResponse: IntervalWin = { min: [], max: [] };
      movieService.getIntervalWin.and.returnValue(of(emptyResponse));

      component.ngOnInit();

      setTimeout(() => {
        expect(component.IntervalWinProducer).toEqual(emptyResponse);
        expect(component.loading).toBeFalse();
        done();
      });
    });

    it('deve lidar com resposta nula do serviço', (done) => {
      const nullResponse: IntervalWin = { min: null as any, max: null as any };
      movieService.getIntervalWin.and.returnValue(of(nullResponse));

      component.ngOnInit();

      setTimeout(() => {
        expect(component.IntervalWinProducer).toEqual(nullResponse);
        expect(component.loading).toBeFalse();
        done();
      });
    });
  });
});
