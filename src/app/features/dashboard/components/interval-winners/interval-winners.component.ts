import { Component, DestroyRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { IntervalWinProducer } from '@shared/models/interval-win.model';
import { MovieService } from '@shared/services/movies/movie.service';

@Component({
  selector: 'app-interval-winners',
  imports: [],
  templateUrl: './interval-winners.component.html',
  styleUrl: './interval-winners.component.scss'
})
export class IntervalWinnersComponent {

  public interval = input<'max' | 'min'>('max');

  private movieService = inject(MovieService);
  private destroyRef = inject(DestroyRef);

  public loading = false;
  public IntervalWinProducer: IntervalWinProducer[] = [];

  ngOnInit(): void {
    this.makeIntervalWinnersTable();
  }

  private makeIntervalWinnersTable() {
    this.loading = true;
    this.movieService
        .getIntervalWin({ projection: 'max-min-win-interval-for-producers' })
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.loading = false)
        )
        .subscribe((response) => {
          this.IntervalWinProducer = response[this.interval()];
        })
  }
}
