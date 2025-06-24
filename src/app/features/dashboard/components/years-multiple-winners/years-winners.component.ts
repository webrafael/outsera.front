import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { Years } from '@shared/models/years.model';
import { MovieService } from '@shared/services/movies/movie.service';

@Component({
  selector: 'app-years-multiple-winners',
  imports: [],
  templateUrl: './years-winners.component.html',
  styleUrl: './years-winners.component.scss'
})
export class YearsMultipleWinnersComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private movieService = inject(MovieService);

  public loading = false;
  public years: Years[] = [];

  ngOnInit(): void {
    this.makeYearsTable();
  }

  private makeYearsTable() {
    this.loading = true;
    this.movieService
        .getYearsWithMultipleWinners({ projection: 'years-with-multiple-winners' })
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.loading = false)
        )
        .subscribe((response) => {
          this.years = response.years;
        });
  }
}
