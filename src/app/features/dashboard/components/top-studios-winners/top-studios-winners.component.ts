import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { Studios } from '@shared/models/studios.model';
import { MovieService } from '@shared/services/movies/movie.service';

@Component({
  selector: 'app-top-studios-winners',
  imports: [],
  templateUrl: './top-studios-winners.component.html',
  styleUrl: './top-studios-winners.component.scss'
})
export class TopStudiosWinnersComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private movieService = inject(MovieService);

  public loading = false;
  public studios: Studios = { studios: [] };

  ngOnInit(): void {
    this.makeStudiosTable();
  }

  private makeStudiosTable() {
    this.loading = true;
    this.movieService
        .getStudios({ projection: 'studios-with-win-count' })
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: (response) => {
            // filtrar pelo top 3
            this.studios = {
              studios: response.studios.sort((a, b) => b.winCount - a.winCount).slice(0, 3)
            };
          },
          error: (error) => {
            console.error('Erro ao carregar estúdios:', error);
            this.studios = { studios: [] };
          }
        });
  }
}
