import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MovieResponse } from '@shared/models/movie.model';
import { MovieService } from '@shared/services/movies/movie.service';
import { debounceTime, distinctUntilChanged, finalize, Subject } from 'rxjs';

@Component({
  selector: 'app-movies-by-year',
  imports: [],
  templateUrl: './movies-by-year.component.html',
  styleUrl: './movies-by-year.component.scss'
})
export class MoviesByYearComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private movieService = inject(MovieService);
  private executeSearch = new Subject<string>();

  public loading = false;
  public movies?: MovieResponse[];
  public currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.listenToSearch();
  }

  private listenToSearch() {
    this.executeSearch
        .pipe(
          debounceTime(1000),
          distinctUntilChanged(),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(
          (value) => this.executeSearchFn(value)
        );
  }

  private executeSearchFn(value?: string) {

    if (!value) {
      return;
    }

    this.loading = true;
    this.movies = [];

    this.movieService
        .getMovieByYear({ winner: true, year: Number(value) })
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: (movies) => {
            this.movies = movies;
          },
          error: (error) => {
            this.movies = [];
            console.error('Erro ao buscar filmes:', error);
          }
        });
  }

  validateInput(event: Event) {
    const input = event.target as HTMLInputElement;

    // deve aceitar somente números
    if (isNaN(Number(input.value))) {
      input.value = '';
      return;
    }

    // deve aceitar no máximo 4 caracteres
    if (input.value.length > 4) {
      input.value = input.value.slice(0, 4);
    }

    // Se o ano for maior que o ano atual, deve ser o ano atual
    if (Number(input.value) > this.currentYear) {
      input.value = this.currentYear.toString();
    }
  }

  search(input: HTMLInputElement) {
    const value = input.value;
    this.executeSearch.next(value);
  }
}
