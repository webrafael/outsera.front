import { Component, inject, OnInit } from '@angular/core';
import { MoviePageResponse, MovieQueryParams } from '@shared/models/movie.model';
import { MovieService } from '@shared/services/movies/movie.service';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movies',
  imports: [FormsModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent implements OnInit {

  public movies?: MoviePageResponse;

  private movieService = inject(MovieService);

  filterYear?: number;
  filterWinner: boolean = true;

  currentYear = new Date().getFullYear();
  currentPage: number = 0;
  totalPages: number = 1;
  pageSize: number = 0;
  pages: number[] = [];


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
        .subscribe((movies) => {
          this.movies = movies;
          this.totalPages = movies.totalPages;
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
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
