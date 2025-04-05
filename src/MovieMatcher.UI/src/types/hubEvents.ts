import { MovieDto } from "./movieDto";

export type HubEvents  = {
  ReceiveMovie: (movie: MovieDto) => void;
  NoMoreMovies: () => void;
  MatchFound: (movieId: number) => void;
  UserJoined: (connectionId: string) => void;
  UserLeft: (connectionId: string) => void;
  SessionTerminated: (message: string) => void;
  MatchingComplete: () => void;
  MatchingStarted: () => void;
}
