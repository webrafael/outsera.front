export interface Movie {
  id?: number;
  year: number;
  title: string;
  studios: string;
  producers: string;
  winner: boolean;
}

export interface MovieResponse {
  id?: number;
  year: number;
  title: string;
  studios: string[];
  producers: string[];
  winner: boolean;
}

export interface MovieByYearParams {
  winner: boolean;
  year: number;
}

export interface MovieQueryParams {
  page?: number;
  size?: number;
  winner?: boolean;
  year?: number;
  title?: string;
  studios?: string;
  producers?: string;
}

export interface Pageable {
  sort: {
    sorted: boolean;
    unsorted: boolean;
  };
  pageSize: number;
  pageNumber: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
}

export interface MoviePageResponse {
  content: MovieResponse[];
  pageable: Pageable;
  totalElements: number;
  last: boolean;
  totalPages: number;
  first: boolean;
  sort: Sort;
  number: number;
  numberOfElements: number;
  size: number;
}