import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';

import { IntervalWin, IntervalWinParams } from '@shared/models/interval-win.model';
import { Movie, MovieByYearParams, MoviePageResponse, MovieQueryParams } from '@shared/models/movie.model';
import { Studios, StudiosParams } from '@shared/models/studios.model';
import { Years, YearsParams } from '@shared/models/years.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private uri = environment.apiURL;
  private moviesPath = `${this.uri}${environment.paths.movies}`;

  private http = inject(HttpClient);

  getMovies(params: MovieQueryParams = {}): Observable<MoviePageResponse> {
    const queryParams = new HttpParams({ fromObject: params as any });
    return this.http.get<MoviePageResponse>(this.moviesPath, { params: queryParams });
  }

  getYearsWithMultipleWinners(params: YearsParams): Observable<Years[]> {
    const queryParams = new HttpParams({ fromObject: params as any });
    return this.http.get<Years[]>(`${this.moviesPath}`, { params: queryParams });
  }
  
  getStudios(params: StudiosParams): Observable<Studios> {
    const queryParams = new HttpParams({ fromObject: params as any });
    return this.http.get<Studios>(`${this.moviesPath}`, { params: queryParams });
  }

  getIntervalWin(params: IntervalWinParams): Observable<IntervalWin> {
    const queryParams = new HttpParams({ fromObject: params as any });
    return this.http.get<IntervalWin>(`${this.moviesPath}`, { params: queryParams });
  }

  getMovieByYear(params: MovieByYearParams): Observable<Movie[]> {
    const queryParams = new HttpParams({ fromObject: params as any });
    return this.http.get<Movie[]>(`${this.moviesPath}`, { params: queryParams });
  }
}
