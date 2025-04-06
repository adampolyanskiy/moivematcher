"use client";
import { MovieDto } from "@/types";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ReadMoreText } from "@/components/ReadMoreText";

interface MovieDetailsProps {
  movie: MovieDto;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie }) => {
  return (
    <Card className="h-full border rounded-lg shadow-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-y-auto">
      <CardContent className="p-4 h-full">
        {/* Movie Poster (Enlarged) */}
        {movie.posterPath && (
          <div className="w-full h-[300px] rounded-lg overflow-hidden">
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative w-full h-full cursor-pointer transition-transform hover:scale-105">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 500px) 100vw, 500px"
                    className="object-contain"
                    priority
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 border-0">
                <VisuallyHidden asChild><DialogTitle>Movie Poster</DialogTitle></VisuallyHidden>
                <div className="relative w-full h-[95vh]">
                  <Image
                    src={`https://image.tmdb.org/t/p/original${movie.posterPath}`}
                    alt={movie.title}
                    fill
                    sizes="95vw"
                    className="object-contain bg-black/95"
                    priority
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Movie Title with Tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="w-full">
              <div className="max-w-full px-4">
                <h2 className="text-2xl font-bold text-center hover:text-primary cursor-help whitespace-nowrap overflow-hidden text-ellipsis">
                  {movie.title}
                </h2>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{movie.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Release Date */}
        {movie.releaseDate && (
          <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center justify-center gap-1">
            📅 Released: {format(parseISO(movie.releaseDate), 'MMMM d, yyyy')}
          </p>
        )}

        {/* Overview */}
        <div className="mt-3 text-gray-800 dark:text-gray-300">
          <ReadMoreText text={movie.overview} />
        </div>

        {/* Movie Metadata */}
        <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 flex flex-col items-center">
          <p className="flex items-center gap-1">
            ⭐ <strong>Rating:</strong> {movie.voteAverage} ({movie.voteCount}{" "}
            votes)
          </p>
          <p className="flex items-center gap-1">
            🔥 <strong>Popularity:</strong> {movie.popularity.toFixed(1)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieDetails;
