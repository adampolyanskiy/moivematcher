"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GameHistoryItem from "./GameHistoryItem";
import { useGameStorage } from "@/hooks/useGameStorage";
import { Game } from "@/services/gameStorageService";
import { toast } from "sonner";

const GameHistoryList: React.FC = () => {
  const { getGames, clearAllGames } = useGameStorage();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gameData = await getGames();
        setGames(gameData);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [getGames]);

  const handleClearHistory = async () => {
    try {
      await clearAllGames();
      setGames([]);
      toast.success("Game history cleared successfully!");
    } catch (error) {
      console.error("Failed to clear game history:", error);
      toast.error("Failed to clear game history");
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            Game History 🎮
          </CardTitle>
          {games.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleClearHistory}
              className="ml-4"
            >
              Clear History
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Loading games...
          </p>
        ) : games.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No games played yet
          </p>
        ) : (
          <div className="space-y-6">
            {games.map((game) => (
              <GameHistoryItem
                key={game.id}
                gameId={game.id?.toString() ?? "unknown"}
                date={new Date(game.timestamp)}
                matchedMovies={game.matches}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameHistoryList;