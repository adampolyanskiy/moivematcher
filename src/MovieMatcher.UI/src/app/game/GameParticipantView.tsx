// File: GameParticipantView.tsx
"use client";
import React from "react";
import SessionInfo from "@/components/SessionInfo";
import MovieCard from "@/components/MovieCard";
import MatchList from "@/components/MatchList";
import { MovieDto } from "@/types";

interface GameParticipantViewProps {
  sessionId: string;
  isMatchingStarted: boolean;
  movieQueue: MovieDto[];
  matches: number[];
  noMoreMovies: boolean;
  onSwipe: (isLiked: boolean) => void;
}

const GameParticipantView: React.FC<GameParticipantViewProps> = ({
  sessionId,
  isMatchingStarted,
  movieQueue,
  matches,
  noMoreMovies,
  onSwipe,
}) => {
  const currentMovie = movieQueue[movieQueue.length - 1] || null;
  return (
    <div className="flex flex-row items-start justify-center gap-8 p-6">
      {/* Match List (Left) */}
      <div className="w-1/4">
        {matches.length > 0 && (
          <MatchList movieQueue={movieQueue} matches={matches} />
        )}
      </div>

      {/* Movie & Information (Center) */}
      <div className="w-1/2 flex flex-col items-center text-center">
        {!isMatchingStarted ? (
          <p className="text-gray-700 dark:text-gray-300">
            Waiting for host to start matching...
          </p>
        ) : currentMovie ? (
          <MovieCard movie={currentMovie} onSwipe={onSwipe} />
        ) : noMoreMovies ? (
          <p className="text-gray-700 dark:text-gray-300">
            No more movies available.
          </p>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">
            Waiting for next movie...
          </p>
        )}
      </div>
    </div>
  );
};

export default GameParticipantView;
