"use client";
import { MovieDto } from "@/types";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MovieDetailsProps {
  movie: MovieDto;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleOverview = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="p-4 border rounded-lg shadow-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-[500px] h-[600px] mx-auto overflow-y-auto">
      <CardContent className="pt-2">
        {/* Movie Poster (Enlarged) */}
        {movie.posterPath && (
          <div className="w-full h-80 rounded-lg overflow-hidden">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
              alt={movie.title}
              width={500}
              height={750}
              className="w-full h-full object-contain"
            />
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
            📅 Released: {movie.releaseDate}
          </p>
        )}

        {/* Overview */}
        <div className="mt-3 text-gray-800 dark:text-gray-300 text-sm leading-relaxed text-center overflow-y-auto">
          <p className={isExpanded ? "" : "line-clamp-3"}>
            {movie.overview}
          </p>
          {movie.overview.length > 100 && (
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
