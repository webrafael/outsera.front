import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DashboardComponent } from './dashboard.component';

describe('Dashboard', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Layout da grade', () => {
    it('deve carregar os 4 componentes na grade do layout', () => {
      // Verifica se os 4 componentes estão presentes no template
      const yearsMultipleWinners = fixture.debugElement.query(By.css('app-years-multiple-winners'));
      const topStudiosWinners = fixture.debugElement.query(By.css('app-top-studios-winners'));
      const intervalWinners = fixture.debugElement.query(By.css('app-interval-winners'));
      const moviesByYear = fixture.debugElement.query(By.css('app-movies-by-year'));

      // Verifica se todos os componentes estão carregados
      expect(yearsMultipleWinners).toBeTruthy();
      expect(topStudiosWinners).toBeTruthy();
      expect(intervalWinners).toBeTruthy();
      expect(moviesByYear).toBeTruthy();
    });

    it('deve exibir os títulos corretos dos cards', () => {
      const cardTitles = fixture.debugElement.queryAll(By.css('.card-title'));

      expect(cardTitles.length).toBe(4);
      expect(cardTitles[0].nativeElement.textContent).toContain('List years with multiple winners');
      expect(cardTitles[1].nativeElement.textContent).toContain('Top 3 studios with winners');
      expect(cardTitles[2].nativeElement.textContent).toContain('Producers with longest and shortest interval between wins');
      expect(cardTitles[3].nativeElement.textContent).toContain('List movie winners by year');
    });

    it('deve ter a estrutura de grid correta', () => {
      // Verifica se a estrutura de grid está presente
      const container = fixture.debugElement.query(By.css('.container-fluid'));
      const row = fixture.debugElement.query(By.css('.row'));
      const cards = fixture.debugElement.queryAll(By.css('.card'));

      expect(container).toBeTruthy();
      expect(row).toBeTruthy();
      expect(cards.length).toBe(4);
    });

    it('deve ter os subtítulos corretos para interval winners', () => {
      const subtitles = fixture.debugElement.queryAll(By.css('h6'));

      expect(subtitles.length).toBe(2);
      expect(subtitles[0].nativeElement.textContent).toContain('Maximum');
      expect(subtitles[1].nativeElement.textContent).toContain('Minimum');
    });
  });
});
