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
    <div className="flex flex-col items-center justify-center min-h-screen text-center gap-6">
      <h1 className="text-4xl font-bold">Joined Game</h1>
      <SessionInfo sessionId={sessionId} />
      {!isMatchingStarted ? (
        <p className="text-gray-700 dark:text-gray-300">
          Waiting for host to start matching...
        </p>
      ) : (
        <>
          {currentMovie ? (
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
          {matches.length > 0 && <MatchList movieQueue={movieQueue} matches={matches} />}
        </>
      )}
    </div>
  );
};

export default GameParticipantView;
