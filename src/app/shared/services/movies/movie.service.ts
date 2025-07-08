import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';

import { IntervalWin, IntervalWinParams } from '@shared/models/interval-win.model';
import { MovieByYearParams, MoviePageResponse, MovieQueryParams, MovieResponse } from '@shared/models/movie.model';
import { Studios, StudiosParams } from '@shared/models/studios.model';
import { Years, YearsParams } from '@shared/models/years.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private uri = environment.apiURL;
  private moviesPath = `${this.uri}${environment.paths.movies}`;

  private http = inject(HttpClient);

  getMovies(params: MovieQueryParams): Observable<MoviePageResponse> {
    return this.http.get<MoviePageResponse>(this.moviesPath, { params: { ...params } });
  }

  getYearsWithMultipleWinners(params: YearsParams): Observable<{ years: Years[] }> {
    return this.http.get<{ years: Years[] }>(`${this.moviesPath}`, { params: { ...params } });
  }

  getStudios(params: StudiosParams): Observable<Studios> {
    return this.http.get<Studios>(`${this.moviesPath}`, { params: { ...params } });
  }

  // cache para evitar requisições repetidas
  getIntervalWin(params: IntervalWinParams): Observable<IntervalWin> {
    return this.http.get<IntervalWin>(`${this.moviesPath}`, { params: { ...params } });
  }

  getMovieByYear(params: MovieByYearParams): Observable<MovieResponse[]> {
    return this.http.get<MovieResponse[]>(`${this.moviesPath}`, { params: { ...params } });
  }
}
