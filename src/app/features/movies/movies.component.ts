import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MoviePageResponse, MovieQueryParams } from '@shared/models/movie.model';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MovieService } from '@shared/services/movies/movie.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-movies',
  imports: [FormsModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private movieService = inject(MovieService);

  public pages: number[] = [];
  public pageSize: number = 0;
  public totalPages: number = 1;
  public currentPage: number = 0;
  public movies?: MoviePageResponse;
  public currentYear = new Date().getFullYear();
  public filterYear?: number;
  public filterWinner: boolean = true;
  public loading: boolean = false;

  ngOnInit(): void {
    this.makeMoviesTable();
  }

  // TODO: implementar teste unitário para esta função (onChangeWinner)
  onChangeWinner(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.value !== this.filterWinner?.toString()) {
      this.filterWinner = input.value === 'true';
      this.resetPagination();
      return;
    }

    this.filterWinner = input.value === 'true';
  }

  // TODO: implementar teste unitário para esta função (onChangeYear)
  onChangeYear(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.value !== this.filterYear?.toString()) {
      this.filterYear = input.value ? Number(input.value) : undefined;
      this.resetPagination();
      return;
    }

    this.filterYear = input.value ? Number(input.value) : undefined;
  }

  // TODO: refatorar teste unitário para esta função (makeMoviesTable)
  makeMoviesTable() {
    this.loading = true;

    // Sempre que fizer uma nova pesquisa, a paginação deve ser resetada
    const params: Partial<MovieQueryParams> = {
      page: 0,
      size: 10
    };

    if (this.filterYear) {
      params.year = this.filterYear;
    }

    if (this.filterWinner) {
      params.winner = this.filterWinner;
    }

    if (this.currentPage) {

      if (this.currentPage < 0) {
        this.currentPage = 0;
      }

      params.page = this.currentPage;
    }

    if (this.pageSize) {
      params.size = this.pageSize;
    }

    this.movieService
        .getMovies(params)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.loading = false) // para evitar memory leaks
        )
        .subscribe({
          next: (movies) => {
            this.movies = movies;
            this.totalPages = movies.totalPages;
            this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
          },
          error: (error) => {
            console.error('Erro ao carregar filmes:', error);
            // Em caso de erro, mantém o estado atual ou define valores padrão
            this.movies = undefined;
            this.totalPages = 1;
            this.pages = [];
          }
        });
  }

  // TODO: Implementar ou refatorar teste unitário para esta função (validateInput)
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

  // TODO: Implementar ou refatorar teste unitário para esta função (goToPage)
  goToPage(page: number) {
    this.currentPage = page;
    this.makeMoviesTable();
  }

  // TODO: Implementar ou refatorar teste unitário para esta função (resetPagination)
  private resetPagination() {
    this.pageSize = 10;
    this.currentPage = 0;
    this.makeMoviesTable();
  }
}
