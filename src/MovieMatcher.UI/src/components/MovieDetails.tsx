"use client";
import { MovieDto } from "@/types";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface MovieDetailsProps {
  movie: MovieDto;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie }) => {
  return (
    <Card className="p-4 border rounded-lg shadow-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-w-lg mx-auto">
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

        {/* Movie Title */}
        <h2 className="text-2xl font-bold text-center">{movie.title}</h2>

        {/* Release Date */}
        {movie.releaseDate && (
          <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center justify-center gap-1">
            📅 Released: {movie.releaseDate}
          </p>
        )}

        {/* Overview */}
        <p className="mt-3 text-gray-800 dark:text-gray-300 text-sm leading-relaxed text-center">
          {movie.overview}
        </p>

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
