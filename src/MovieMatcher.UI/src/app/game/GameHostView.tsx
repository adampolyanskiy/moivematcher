// File: GameHostView.tsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import SessionInfo from "@/components/SessionInfo";
import SessionPreferences from "@/components/SessionPreferences";
import MovieCard from "@/components/MovieCard";
import MatchList from "@/components/MatchList";
import { MovieDto } from "@/types";

interface GameHostViewProps {
  sessionId: string;
  joinedUsersCount: number;
  isMatchingStarted: boolean;
  movieQueue: MovieDto[];
  matches: number[];
  noMoreMovies: boolean;
  onStartMatching: () => void;
  onSwipe: (isLiked: boolean) => void;
}

const GameHostView: React.FC<GameHostViewProps> = ({
  sessionId,
  joinedUsersCount,
  isMatchingStarted,
  movieQueue,
  matches,
  noMoreMovies,
  onStartMatching,
  onSwipe,
}) => {
  const currentMovie = movieQueue[movieQueue.length - 1] || null;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center gap-6">
      <h1 className="text-4xl font-bold">Host Game</h1>
      <SessionInfo sessionId={sessionId} />
      <SessionPreferences />
      {!isMatchingStarted ? (
        <Button
          className="mt-4"
          onClick={onStartMatching}
          disabled={joinedUsersCount < 1}
        >
          Start Matching {joinedUsersCount < 1 && "(Waiting for users)"}
        </Button>
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
          {matches.length > 0 && (
            <MatchList movieQueue={movieQueue} matches={matches} />
          )}
        </>
      )}
    </div>
  );
};

export default GameHostView;
