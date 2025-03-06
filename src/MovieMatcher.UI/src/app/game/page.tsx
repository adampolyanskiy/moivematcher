"use client";
import { useRouter } from "next/navigation";
import { useMovieMatcherHub } from "@/hooks/useMovieMatcherHub";
import { Button } from "@/components/ui/button";

export default function GamePage() {
  const { isConnected, getContext } = useMovieMatcherHub();
  const router = useRouter();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-3xl font-bold text-red-600">No Connection</h1>
        <p className="text-gray-700 dark:text-gray-300">
          You are not connected to the game server. Please return to the home page and create a game.
        </p>
        <Button className="mt-4" onClick={() => router.push("/")}>Go to Home</Button>
      </div>
    );
  }

  const context = getContext();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold">Game Page</h1>
      <pre className="text-lg text-gray-700 dark:text-gray-300 mt-2">
        {JSON.stringify(context, null, 2)}
      </pre>
    </div>
  );
}
