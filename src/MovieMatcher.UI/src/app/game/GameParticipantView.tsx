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
    <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-8 p-4 md:p-6 max-h-[750px]">
      {/* Left Column */}
      <div className="w-full md:w-1/4 order-2 md:order-1 h-[300px] md:h-auto">
        {isMatchingStarted && (
          <div className="h-full">
            <MatchList movieQueue={movieQueue} matches={matches} />
          </div>
        )}
      </div>

      {/* Center Column - Movie Card */}
      <div className="text-center w-full md:w-2/4 order-1 md:order-2">
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

      {/* Right Column */}
      <div className="w-full md:w-1/4 order-3">
        {/* Reserved for future content */}
      </div>
    </div>
  );
};

export default GameParticipantView;
