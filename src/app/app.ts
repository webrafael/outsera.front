import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { MoviesMockService } from './shared/mock/movies.mock.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`
})
export class App implements OnInit {

  constructor(private moviesMockService: MoviesMockService) {}

  async ngOnInit() {
    await lastValueFrom(this.moviesMockService.readCsvFile());
    this.movies();
  }

  movies() {
    // this.moviesMockService.getMovies({
    //   page: 1,
    //   size: 10,
    //   year: 1980,
    // })
    // .subscribe(movies => {
    //   console.log(movies);
    // });
    
    // this.moviesMockService.getYearsWithMultipleWinners({
    //   projection: 'years-with-multiple-winners',
    // })
    // .subscribe(movies => {
    //   console.log(movies);
    // });

    // this.moviesMockService.getStudios({
    //   projection: 'studios-with-win-count',
    // })
    // .subscribe(movies => {
    //   console.log(movies);
    // });

    // this.moviesMockService.getIntervalWin({
    //   projection: 'max-min-win-interval-for-producer',
    // })
    // .subscribe(movies => {
    //   console.log(movies);
    // });

    this.moviesMockService.getMovieByYear({
      winner: true,
      year: 1980,
    })
    .subscribe(movies => {
      console.log(movies);
    });
  }
}
