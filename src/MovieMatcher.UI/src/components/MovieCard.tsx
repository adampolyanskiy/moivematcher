// File: MovieCard.tsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { MovieDto } from "@/types";

interface MovieCardProps {
  movie: MovieDto;
  onSwipe: (isLiked: boolean) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onSwipe }) => {
  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-2xl font-semibold">{movie.title}</h2>
      <p className="mt-2 text-gray-700">{movie.overview}</p>
      <div className="mt-4 flex justify-around">
        <Button onClick={() => onSwipe(false)}>Dislike</Button>
        <Button onClick={() => onSwipe(true)}>Like</Button>
      </div>
    </div>
  );
};

export default MovieCard;