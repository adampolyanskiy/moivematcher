"use client";
import { MovieMatch } from "@/services/gameStorageService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MovieListItem from "./MovieListItem";
import { format } from "date-fns";

interface GameHistoryItemProps {
  gameId: string;
  date: Date;
  matchedMovies: MovieMatch[];
}

const GameHistoryItem: React.FC<GameHistoryItemProps> = ({
  gameId,
  date,
  matchedMovies,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Game #{gameId}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {format(date, 'MMMM d, yyyy')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matchedMovies.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No matches in this game
            </p>
          ) : (
            matchedMovies.map((movie, index) => (
              <MovieListItem key={`${gameId}-${index}`} movie={movie} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameHistoryItem; 