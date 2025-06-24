import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

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

  private intervalWinCache = new Map<string, Observable<IntervalWin>>();

  getMovies(params: MovieQueryParams = {}): Observable<MoviePageResponse> {
    const queryParams = new HttpParams({ fromObject: params as any });
    return this.http.get<MoviePageResponse>(this.moviesPath, { params: queryParams });
  }

  getYearsWithMultipleWinners(params: YearsParams): Observable<{ years: Years[] }> {
    const queryParams = new HttpParams({ fromObject: params as any });
    return this.http.get<{ years: Years[] }>(`${this.moviesPath}`, { params: queryParams });
  }

  getStudios(params: StudiosParams): Observable<Studios> {
    const queryParams = new HttpParams({ fromObject: params as any });
    return this.http.get<Studios>(`${this.moviesPath}`, { params: queryParams });
  }

  // cache para evitar requisições repetidas
  getIntervalWin(params: IntervalWinParams): Observable<IntervalWin> {
    const cacheKey = params.projection;
    if (!this.intervalWinCache.has(cacheKey)) {
      const queryParams = new HttpParams({ fromObject: params as any });
      const obs$ = this.http.get<IntervalWin>(`${this.moviesPath}`, { params: queryParams }).pipe(shareReplay(1));
      this.intervalWinCache.set(cacheKey, obs$);
    }
    return this.intervalWinCache.get(cacheKey)!;
  }

  getMovieByYear(params: MovieByYearParams): Observable<MovieResponse[]> {
    const queryParams = new HttpParams({ fromObject: params as any });
    return this.http.get<MovieResponse[]>(`${this.moviesPath}`, { params: queryParams });
  }
}
