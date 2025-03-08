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
    <div className="flex flex-row items-start justify-center gap-8 p-6">
      {/* Match List (Left) */}
      <div className="w-1/4">
        {matches.length > 0 && (
          <MatchList movieQueue={movieQueue} matches={matches} />
        )}
      </div>

      {/* Movie & Information (Center) */}
      <div className="w-1/2 flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold">Host Game</h1>
        {!isMatchingStarted ? (
          <Button onClick={onStartMatching} disabled={joinedUsersCount < 1}>
            Start Matching {joinedUsersCount < 1 && "(Waiting for users)"}
          </Button>
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

      {/* Session Info & Preferences (Right) */}
      <div className="w-1/4 flex flex-col items-center gap-6">
        <SessionInfo sessionId={sessionId} />
        <SessionPreferences />
      </div>
    </div>
  );
};

export default GameHostView;
