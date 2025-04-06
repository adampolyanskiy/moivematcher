"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGameStorage } from "@/hooks/useGameStorage";
import { Game } from "@/services/gameStorageService";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";

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
    <Card className="w-full mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl sm:text-2xl font-bold">
            Game History 🎮
          </CardTitle>
          {games.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleClearHistory}
              className="ml-2 sm:ml-4"
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
          <div className="space-y-2">
            {games.map((game) => (
              <Link
                key={game.id}
                href={`/history/${game.id}`}
                className="block"
              >
                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="font-medium text-sm sm:text-base">Game #{game.id}</span>
                    <span className="text-xs sm:text-sm text-gray-500">
                      ({game.matches.length} matches)
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {format(new Date(game.timestamp), 'MMM d, yyyy')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameHistoryList;