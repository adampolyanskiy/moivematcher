"use client";
import { MovieMatch } from "@/services/gameStorageService";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface MovieListItemProps {
  movie: MovieMatch;
}

const MovieListItem: React.FC<MovieListItemProps> = ({ movie }) => {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardContent className="p-4 flex gap-4">
        {/* Movie Poster */}
        <div className="relative w-24 h-36 flex-shrink-0">
          <Image
            src={`https://image.tmdb.org/t/p/w200${movie.posterPath}`}
            alt={movie.title}
            fill
            sizes="96px"
            className="object-cover rounded-md"
          />
        </div>

        {/* Movie Info */}
        <div className="flex flex-col flex-grow">
          <h3 className="text-lg font-semibold">
            {movie.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mt-2">
            {movie.overview}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieListItem; 