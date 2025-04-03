"use client";
import { MovieDto } from "@/types";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface MovieDetailsProps {
  movie: MovieDto;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Reset expanded state when movie changes
    setIsExpanded(false);
  }, [movie.id]); // Reset when movie ID changes

  const toggleOverview = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="p-4 border rounded-lg shadow-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-[500px] h-[600px] mx-auto overflow-y-auto">
      <CardContent className="pt-2">
        {/* Movie Poster (Enlarged) */}
        {movie.posterPath && (
          <div className="w-full h-80 rounded-lg overflow-hidden">
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
                <DialogTitle className="sr-only" asChild>Movie Poster</DialogTitle>
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
        <div className="mt-3 text-gray-800 dark:text-gray-300 text-sm leading-relaxed text-center overflow-y-auto">
          <p className={isExpanded ? "" : "line-clamp-3"}>
            {movie.overview}
          </p>
          {movie.overview && movie.overview.length > 100 && (
            <Button onClick={toggleOverview} variant="link" className="text-blue-500 hover:underline">
              {isExpanded ? "Read less" : "Read more"}
            </Button>
          )}
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
