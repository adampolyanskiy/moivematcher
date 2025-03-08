// File: MatchList.tsx
"use client";
import { MovieDto } from "@/types";
import React from "react";

interface MatchListProps {
  matches: number[];
  movieQueue: MovieDto[];
}

const MatchList: React.FC<MatchListProps> = ({ matches, movieQueue }) => {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold">Matches:</h3>
      <ul className="mt-2 space-y-1">
        {matches.map((movieId, index) => (
          <li key={index} className="text-green-600">
            {movieQueue.find((movie) => movie.id === movieId)?.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchList;
