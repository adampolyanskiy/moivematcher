import { MovieDto } from "./movieDto";

export type HubEvents  = {
  ReceiveMovie: (movie: MovieDto) => void;
  NoMoreMovies: () => void;
  MatchFound: (movieId: string) => void;
  UserJoined: (connectionId: string) => void;
  UserLeft: (connectionId: string) => void;
  SessionTerminated: (message: string) => void;
}
