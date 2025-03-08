"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { MovieDto } from "@/types";
import MovieDetails from "./MovieDetails";

interface MovieCardProps {
  movie: MovieDto;
  onSwipe: (isLiked: boolean) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onSwipe }) => {
  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white max-w-md mx-auto">
      {/* Reusing MovieDetails component */}
      <MovieDetails movie={movie} />

      {/* Action Buttons */}
      <div className="mt-4 flex justify-around">
        <Button variant="destructive" onClick={() => onSwipe(false)}>
          Dislike
        </Button>
        <Button variant="default" onClick={() => onSwipe(true)}>
          Like
        </Button>
      </div>
    </div>
  );
};

export default MovieCard;
