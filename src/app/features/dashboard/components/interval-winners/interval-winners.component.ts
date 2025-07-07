import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { IntervalWin } from '@shared/models/interval-win.model';

import { MovieService } from '@shared/services/movies/movie.service';
import { IntervalWinnersTableComponent } from './interval-winners-table/interval-winners-table.component';

@Component({
  selector: 'app-interval-winners',
  imports: [IntervalWinnersTableComponent],
  templateUrl: './interval-winners.component.html',
  styleUrl: './interval-winners.component.scss'
})
export class IntervalWinnersComponent {

  private destroyRef = inject(DestroyRef);
  private movieService = inject(MovieService);

  public loading = false;
  public IntervalWinProducer?: IntervalWin;

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
        .subscribe((response) => this.IntervalWinProducer = response)
  }
}
