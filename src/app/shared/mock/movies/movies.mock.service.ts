import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { IntervalWin, IntervalWinParams, IntervalWinProducer } from '../../models/interval-win.model';
import { Movie, MovieByYearParams, MoviePageResponse, MovieQueryParams, MovieResponse } from '../../models/movie.model';
import { Studios, StudiosParams } from '../../models/studios.model';
import { Years, YearsParams } from '../../models/years.model';
import { filterQueryMock, parseCsv } from './utils/movies.mock.utils';

@Injectable({
  providedIn: 'root'
})
export class MoviesMockService {

  private http = inject(HttpClient);

  // Ler o arquivo CSV dos assets
  private getCSV(): Observable<Movie[]> {
    return this.http.get('assets/mock/movielist.csv', { responseType: 'text' }).pipe(map(csvText => parseCsv(csvText)), delay(1000));
  }

  // Método para obter filmes com paginação e filtros
  getMovies(params: MovieQueryParams = {}): Observable<MoviePageResponse> {
    return this.getCSV()
    .pipe(
      map(movies => {
        // Aplicar filtros
        let filteredMovies = filterQueryMock(movies, params);

        // Aplicar paginação
        const page = params.page || 0;
        const size = params.size || 10;
        const totalElements = filteredMovies.length;
        const totalPages = Math.ceil(totalElements / size);

        // Validar se a página solicitada existe
        const validPage = Math.min(page, Math.max(0, totalPages - 1));
        const startIndex = validPage * size;
        const endIndex = Math.min(startIndex + size, totalElements);

        // Garantir que não tentamos acessar índices fora do array
        const content = filteredMovies.slice(startIndex, endIndex);

        if (!content?.length) {
          return {
            content: [],
            pageable: {
              sort: { sorted: false, unsorted: true },
              pageSize: size,
              pageNumber: validPage,
              offset: startIndex,
              paged: totalElements > 0,
              unpaged: totalElements === 0
            },
            totalElements: 0,
            last: true,
            totalPages: 0,
            first: true,
            sort: { sorted: false, unsorted: true },
            number: validPage,
            numberOfElements: 0,
            size
          };
        }

        return {
          content: content.map(movie => ({
            year: movie.year,
            title: movie.title,
            studios: movie.studios?.split(/,|\s+and\s+/)?.map((studio) => studio.trim()),
            producers: movie.producers?.split(/,|\s+and\s+/)?.map((producer) => producer.trim()),
            winner: movie.winner
          })),
          pageable: {
            sort: { sorted: false, unsorted: true },
            pageSize: size,
            pageNumber: validPage,
            offset: startIndex,
            paged: totalElements > 0,
            unpaged: totalElements === 0
          },
          totalElements,
          last: validPage >= totalPages - 1 || totalElements === 0,
          totalPages: Math.max(1, totalPages),
          first: validPage === 0,
          sort: { sorted: false, unsorted: true },
          number: validPage,
          numberOfElements: content.length,
          size
        };
      })
    );
  }

  // Método para obter anos com mais de um vencedor
  getYearsWithMultipleWinners(params: YearsParams): Observable<{ years: Years[] }> {
    return this.getCSV().pipe(
      map(movies => {

        if (params.projection !== 'years-with-multiple-winners') {
            throw new Error('Invalid projection');
        }

        // Agrupar filmes por ano e conta quantos ganhadores tem por ano
        const groupedByYear = movies.reduce((acc, movie) => {
            acc[movie.year] = acc[movie.year] || [];

            const splitProducers =  movie.producers?.split(/,|\s+and\s+/)?.map((producer) => producer.trim());
            for (const producer of splitProducers) {
              acc[movie.year].push(producer);
            }

            return acc;
        }, {} as Record<number, string[]>);

        const years = {
          years: Object.entries(groupedByYear).map(([year, producers]) => ({
            year: parseInt(year),
            winnerCount: producers.length
          }))
        };

        return years;
      })
    )
  }

  // Método para obter estúdios
  getStudios(params: StudiosParams): Observable<Studios> {
    return this.getCSV().pipe(
      map(movies => {
        if (params.projection !== 'studios-with-win-count') {
          throw new Error('Invalid projection');
        }

        const groupedByStudio = movies.reduce((acc, movie) => {
            const splitStudios = movie.studios?.split(/,|\s+and\s+/)?.map((studio) => studio.trim());
            for (const studio of splitStudios) {
                acc[studio] = acc[studio] || [];
                acc[studio].push(movie.year);
            }
            return acc;
        }, {} as Record<string, number[]>);

        return {
          studios: Object.entries(groupedByStudio).map(([studio, years]) => ({
            name: studio,
            winCount: years.length
          }))
        };
      })
    )
  }

  // Método para obter o intervalo de prêmios
  getIntervalWin(params: IntervalWinParams): Observable<IntervalWin> {
    return this.getCSV().pipe(
      map(movies => {
        if (params.projection !== 'max-min-win-interval-for-producers') {
          throw new Error('Invalid projection');
        }

        const movieWinners = movies.filter(movie => movie.winner).sort((a, b) => a.year - b.year);

        const producers = new Map<string, number[]>();

        // Criar uma lista única de produtores e adiciona os anos
        for (const movie of movieWinners) {
          // Quebra a lista de produtores por vírgula ou " and "
          const producersList = movie.producers?.split(/,|\s+and\s+/)?.map((producer) => producer.trim());

          for (const producer of producersList) {
            if (!producers.has(producer)) {
              producers.set(producer, []);
            }

            producers.get(producer)?.push(movie.year);
          }
        }

        const producerIntervals: IntervalWinProducer[] = [];

        // Calcular intervalos para cada produtor
        for (const [producer, years] of producers.entries()) {
          // Ordenar os anos em ordem crescente
          years.sort((a, b) => a - b);

          // Só calcular intervalos se o produtor ganhou pelo menos 2 vezes
          if (years.length >= 2) {
            // Calcular intervalos
            for (let i = 0; i < years.length - 1; i++) {
              const previousWin = years[i];
              const followingWin = years[i + 1];
              const interval = followingWin - previousWin;

              producerIntervals.push({
                producer,
                interval,
                previousWin,
                followingWin,
              });
            }
          }
        }

        // Se não houver intervalos, retorna um array vazio
        if (producerIntervals.length === 0) {
          return { min: [], max: [] };
        }

        // Encontrar o intervalo mínimo e máximo
        const minInterval = Math.min(...producerIntervals.map((interval) => interval.interval));
        const maxInterval = Math.max(...producerIntervals.map((interval) => interval.interval));

        // Encontrar os produtores com os intervalos mínimo e máximo
        const minProducers = producerIntervals.filter((interval) => interval.interval === minInterval);
        const maxProducers = producerIntervals.filter((interval) => interval.interval === maxInterval);

        return {
          min: minProducers,
          max: maxProducers
        }
      })
    )
  }

  // Método para obter o filme por ano
  getMovieByYear(params: MovieByYearParams): Observable<MovieResponse[]> {
    return this.getCSV().pipe(
      map(movies => {

        const movie = movies.filter(movie => movie.year === params.year && movie.winner === params.winner);

        if (!movie) {
          return [];
        }

        const movieResponse: MovieResponse[] = movie.map(movie => ({
          id: movie.id,
          year: movie.year,
          title: movie.title,
          studios: movie.studios?.split(/,|\s+and\s+/)?.map((studio) => studio.trim()),
          producers: movie.producers?.split(/,|\s+and\s+/)?.map((producer) => producer.trim()),
          winner: movie.winner
        }));

        return movieResponse;
      })
    )
  }
}
