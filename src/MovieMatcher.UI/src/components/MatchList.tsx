"use client";
import { MovieDto } from "@/types";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MovieDetails from "./MovieDetails";

interface MatchListProps {
  matches: number[];
  movieQueue: MovieDto[];
}

const MatchList: React.FC<MatchListProps> = ({ matches, movieQueue }) => {
  return (
    <Card className="w-full max-w-sm bg-white dark:bg-gray-900 shadow-lg border border-gray-300 dark:border-gray-700 p-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Matched Movies 🎬
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="mt-2 space-y-3">
          {matches.map((movieId) => {
            const movie = movieQueue.find((m) => m.id === movieId);
            if (!movie) return null; // Skip if movie is not found

            return (
              <li
                key={movie.id}
                className="text-blue-600 dark:text-blue-400 font-medium"
              >
                <Popover>
                  <PopoverTrigger className="hover:underline">
                    {movie.title}
                  </PopoverTrigger>
                  <PopoverContent className="w-96">
                    <MovieDetails movie={movie} />
                  </PopoverContent>
                </Popover>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default MatchList;
