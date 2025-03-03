export type MovieDto = {
  id: number;
  title: string;
  overview: string;
  genreIds: number[];
  posterPath: string;
  backdropPath: string;
  popularity: number;
  voteAverage: number;
  voteCount: number;
  releaseDate?: string;
};
