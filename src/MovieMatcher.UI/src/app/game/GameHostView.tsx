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
  onFinishMatching: () => void;
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
  onFinishMatching,
}) => {
  const currentMovie = movieQueue[movieQueue.length - 1] || null;

  return (
    <div className="flex flex-col md:flex-row justify-between p-4 md:p-6 gap-4 md:gap-8 max-h-[750px]">
      {/* Match List (Left) */}
      <div className="w-full md:w-1/4 flex flex-col gap-4 order-2 md:order-1 h-[300px] md:h-auto">
        {isMatchingStarted && (
          <>
            <div className="flex-1 min-h-0">
              <MatchList movieQueue={movieQueue} matches={matches} />
            </div>
            <Button onClick={onFinishMatching}>Finish Matching</Button>
          </>
        )}
      </div>

      {/* Movie & Information (Center) */}
      <div className="text-center w-full md:w-2/4 order-1 md:order-2">
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
      <div className="flex flex-col items-center gap-4 md:gap-6 w-full md:w-1/4 order-3">
        <SessionInfo sessionId={sessionId} />
        <SessionPreferences />
      </div>
    </div>
  );
};

export default GameHostView;
