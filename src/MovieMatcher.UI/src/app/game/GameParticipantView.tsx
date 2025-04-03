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
    <div className="grid grid-cols-[1fr_2fr_1fr] gap-8 p-6 h-[80vh]">
      {/* Left Column */}
      <div className="h-full">
        {isMatchingStarted && (
          <MatchList movieQueue={movieQueue} matches={matches} />
        )}
      </div>

      {/* Center Column - Movie Card */}
      <div className="text-center">
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
      <div>
        {/* Reserved for future content */}
      </div>
    </div>
  );
};

export default GameParticipantView;
