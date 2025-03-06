"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useMovieMatcherHub } from "@/hooks/useMovieMatcherHub";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import SessionInfo from "@/components/SessionInfo";
import SessionPreferences from "@/components/SessionPreferences";

export default function GamePage() {
  const { isConnected, createSession, joinSession, connect } =
    useMovieMatcherHub();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionIdFromParam = searchParams.get("sid");
  const [sessionId, setSessionId] = useState<string | null>(
    sessionIdFromParam || null
  );
  const [isJoining, setIsJoining] = useState(false);
  const isHost = !sessionIdFromParam;
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Only connect if a session ID is provided
    if (!sessionIdFromParam) return;

    const initializeConnection = async () => {
      if (!isConnected) {
        setIsConnecting(true);
        await connect();
        setIsConnecting(false);
      }

      if (sessionIdFromParam && isConnected) {
        setIsJoining(true);
        try {
          await joinSession(sessionIdFromParam);
          toast.success("Joined game session successfully!");
        } catch {
          toast.error(
            "Failed to join the session. Please check the code and try again."
          );
          router.push("/");
        } finally {
          setIsJoining(false);
        }
      }
    };

    initializeConnection();
  }, [sessionIdFromParam, isConnected, connect, joinSession, router]);

  const handleStartGame = async () => {
    if (!isHost) return;

    try {
      const newSessionId = await createSession();
      if (!newSessionId) {
        toast.error("Failed to create a new session. Please try again.");
      } else {
        setSessionId(newSessionId);
      }
    } catch {
      toast.error("Failed to start game. Please try again.");
    }
  };

  if (!isConnected && sessionIdFromParam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-3xl font-bold text-red-600">Connecting...</h1>
        <p className="text-gray-700 dark:text-gray-300">
          Attempting to connect to the session. Please wait.
        </p>
      </div>
    );
  }

  if (!isConnected && !sessionIdFromParam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-3xl font-bold text-red-600">No Connection</h1>
        <p className="text-gray-700 dark:text-gray-300">
          You are not connected to the game server. Please return to the home
          page and create a game.
        </p>
        <Button className="mt-4" onClick={() => router.push("/")}>
          Go to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center gap-6">
      <h1 className="text-4xl font-bold">
        {isHost ? "Host Game" : "Joined Game"}
      </h1>
      {isConnecting && (
        <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">
          Connecting to server...
        </p>
      )}

      {sessionId && <SessionInfo sessionId={sessionId} />}
      { isHost && <SessionPreferences /> }

      {isHost ? (
        <Button
          className="mt-4"
          onClick={handleStartGame}
          disabled={isConnecting}
        >
          Start a New Game
        </Button>
      ) : (
        isJoining && (
          <p className="text-gray-700 dark:text-gray-300 mt-4">
            Joining session...
          </p>
        )
      )}
    </div>
  );
}
