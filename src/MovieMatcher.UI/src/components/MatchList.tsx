"use client";
import { MovieDto } from "@/types";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MovieDetails from "./MovieDetails";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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
        <ul className="mt-2 space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {matches.map((movieId) => {
            const movie = movieQueue.find((m) => m.id === movieId);
            if (!movie) return null; // Skip if movie is not found

            return (
              <li
                key={movie.id}
                className="text-blue-600 dark:text-blue-400 font-medium"
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="hover:underline text-left w-full">
                      {movie.title}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl p-0">
                    <VisuallyHidden asChild><DialogTitle>Movie Details for {movie.title}</DialogTitle></VisuallyHidden>
                    <MovieDetails movie={movie} />
                  </DialogContent>
                </Dialog>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default MatchList;
