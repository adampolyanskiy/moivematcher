"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useGameStorage } from "@/hooks/useGameStorage";
import { Game } from "@/services/gameStorageService";
import { format } from "date-fns";
import MovieListItem from "@/components/MovieListItem";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GameHistoryPage() {
  const params = useParams();
  const { getGameById } = useGameStorage();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const gameData = await getGameById(Number(params.id));
        setGame(gameData || null);
      } catch (error) {
        console.error("Failed to fetch game:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [getGameById, params.id]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center">Loading game details...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-4xl mx-auto">
          <CardContent className="pt-6">
            <p className="text-center mb-4">Game not found</p>
            <div className="flex justify-center">
              <Link href="/">
                <Button variant="secondary">Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
      <Card className="w-full max-w-4xl mx-auto h-[calc(100vh-6rem)] sm:h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold">
              Game #{params.id}
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {format(new Date(game.timestamp), "PPP")}
            </p>
          </div>
          <div className="flex justify-center">
            <Link href="/">
              <Button variant="secondary">Home</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] pt-0 overflow-hidden">
          <div className="flex flex-col h-full">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Matched Movies</h2>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {game.matches.length === 0 ? (
                <p className="text-gray-500 text-center">
                  No matches in this game
                </p>
              ) : (
                game.matches.map((movie, index) => (
                  <MovieListItem key={index} movie={movie} />
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 