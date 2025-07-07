import { Movie, MovieQueryParams } from "@shared/models/movie.model";

// Parsear o texto CSV para array de objetos tipados
export function parseCsv(csvText: string): Movie[] {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) return [];

  let id = 1;
  const headers = lines[0].split(';').map(header => header.trim());
  const data = lines.slice(1).map(line => {
    const movie: any = {};
    const values = line.split(';').map(value => value.trim());

    movie['id'] = id++;

    headers.forEach((header, index) => {
      const value = values[index] || '';
      // Converter tipos baseado no header
      switch (header) {
        case 'year':
          movie[header] = parseInt(value) || 0;
          break;
          case 'winner':
            movie[header] = value.toLowerCase() === 'yes';
            break;
            default:
          movie[header] = value;
        }
      });
    return movie as Movie;
  });

  return data;
}

// Método privado para aplicar filtros
export function filterQueryMock(movies: Movie[], params: MovieQueryParams): Movie[] {
  let filtered = [...movies];

  if (params.winner !== undefined) {
    filtered = filtered.filter(movie => movie.winner === params.winner);
  }

  if (params.year !== undefined) {
    filtered = filtered.filter(movie => movie.year === params.year);
  }

  if (params.title) {
    filtered = filtered.filter(movie =>
      movie.title.toLowerCase().includes(params.title!.toLowerCase())
    );
  }

  if (params.studios) {
    filtered = filtered.filter(movie =>
      movie.studios.toLowerCase().includes(params.studios!.toLowerCase())
    );
  }

  if (params.producers) {
    filtered = filtered.filter(movie =>
      movie.producers.toLowerCase().includes(params.producers!.toLowerCase())
    );
  }

  return filtered;
}

