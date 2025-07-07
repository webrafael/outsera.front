import { Component, inject, OnInit } from '@angular/core';
import { MoviePageResponse, MovieQueryParams } from '@shared/models/movie.model';

import { FormsModule } from '@angular/forms';
import { MovieService } from '@shared/services/movies/movie.service';

@Component({
  selector: 'app-movies',
  imports: [FormsModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent implements OnInit {

  private movieService = inject(MovieService);

  public pages: number[] = [];
  public pageSize: number = 0;
  public totalPages: number = 1;
  public currentPage: number = 0;
  public movies?: MoviePageResponse;
  public currentYear = new Date().getFullYear();
  public filterYear?: number;
  public filterWinner: boolean = true;

  ngOnInit(): void {
    this.makeMoviesTable();
  }

  makeMoviesTable() {

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

  validateInput(event: Event) {
    // validar para digitar no máximo 4 caracteres
    const input = event.target as HTMLInputElement;
    if (input.value.length > 4) {
      input.value = input.value.slice(0, 4);
    }
    if (Number(input.value) > this.currentYear) {
      input.value = this.currentYear.toString();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.makeMoviesTable();
  }
}
