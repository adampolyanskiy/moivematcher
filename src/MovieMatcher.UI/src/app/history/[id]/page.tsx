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
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Game #{params.id}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {format(new Date(game.timestamp), "PPP")}
            </p>
          </div>
          <div className="flex justify-center">
            <Link href="/">
              <Button variant="secondary">Home</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Matched Movies</h2>
            <div className="space-y-4">
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