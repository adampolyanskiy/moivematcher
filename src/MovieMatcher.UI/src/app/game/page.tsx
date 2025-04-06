// File: GamePage.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useMovieMatcherHub } from "@/hooks/useMovieMatcherHub";
import { toast } from "sonner";
import { useEffect, useState, useRef, use } from "react";
import GameHostView from "./GameHostView";
import GameParticipantView from "./GameParticipantView";
import { Button } from "@/components/ui/button";
import { MovieDto } from "@/types";
import { useGameStorage } from "@/hooks/useGameStorage";
import { MovieMatch } from "@/services/gameStorageService";

export default function GamePage() {
  const {
    isConnected,
    disconnecting,
    createSession,
    joinSession,
    connect,
    on,
    off,
    startMatching,
    swipeMovie,
    finishMatching,
    isJoinedSession,
    disconnect
  } = useMovieMatcherHub();
  const { saveGame, addMatchToGame } = useGameStorage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionIdFromParam = searchParams.get("sid");
  const [sessionId, setSessionId] = useState<string | null>(
    sessionIdFromParam || null
  );
  const isHost = !sessionIdFromParam;

  // Shared state for matching & movie queue
  const [joinedUsersCount, setJoinedUsersCount] = useState(0);
  const [isMatchingStarted, setIsMatchingStarted] = useState(false);
  const [movieQueue, setMovieQueue] = useState<MovieDto[]>([]);
  const movieQueueRef = useRef<MovieDto[]>([]);
  const [matches, setMatches] = useState<number[]>([]);
  const [noMoreMovies, setNoMoreMovies] = useState(false);
  const [currentGameId, setCurrentGameId] = useState<number | null>(null);
  const currentGameIdRef = useRef<number | null>(null);

  // Update ref whenever movieQueue changes
  useEffect(() => {
    movieQueueRef.current = movieQueue;
  }, [movieQueue]);

  // Update ref whenever currentGameId changes
  useEffect(() => {
    currentGameIdRef.current = currentGameId;
  }, [currentGameId]);

  useEffect(() => {
    if (matches.length === 0) return;

    const lastMatchedMovieId = matches[matches.length - 1];
    const movie = movieQueueRef.current.find((m) => m.id === lastMatchedMovieId);
    if (!movie) return;

    const movieMatch = {
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.posterPath
    };

    storeMatch(movie, movieMatch, matches.slice(0, -1));
  }, [matches]);

  // Subscribe to SignalR hub events
  useEffect(() => {
    console.log("Subscribing to SignalR hub events...");
    on("ReceiveMovie", handleReceiveMovie);
    on("NoMoreMovies", handleNoMoreMovies);
    on("MatchFound", handleMatchFound);
    on("UserJoined", handleUserJoined);
    on("UserLeft", handleUserLeft);
    on("SessionTerminated", handleSessionTerminated);
    on("MatchingComplete", handleMatchingComplete);
    on("MatchingStarted", handleMatchingStarted);

    return () => {
      console.log("Unsubscribing from SignalR hub events...");
      off("ReceiveMovie", handleReceiveMovie);
      off("NoMoreMovies", handleNoMoreMovies);
      off("MatchFound", handleMatchFound);
      off("UserJoined", handleUserJoined);
      off("UserLeft", handleUserLeft);
      off("SessionTerminated", handleSessionTerminated);
      off("MatchingComplete", handleMatchingComplete);
      off("MatchingStarted", handleMatchingStarted);
    };
  }, [on, off, router]);

  // Establish connection and join session if a sessionId is provided
  useEffect(() => {
    if (!sessionIdFromParam || disconnecting) return;
    const initializeConnection = async () => {
      if (!isConnected) {
        console.log("Connecting...");
        await connect();
      }
      if (sessionIdFromParam && isConnected && !isJoinedSession()) {
        try {
          console.log("Joining session...");
          await joinSession(sessionIdFromParam);
        } catch {
          toast.error(
            "Failed to join the session. Please check the code and try again."
          );
          router.push("/");
        } finally {
        }
      }
    };
    initializeConnection();
  }, [
    sessionIdFromParam,
    isConnected,
    connect,
    joinSession,
    router,
    isJoinedSession,
  ]);

  const handleReceiveMovie = (movie: MovieDto) => {
    setMovieQueue((prev) => [...prev, movie]);
    setNoMoreMovies(false);
    toast(`Received movie: ${movie.title || "Unknown Title"}`);
  };

  const handleMatchingStarted = () => {
    setIsMatchingStarted(true);
    toast.info("Matching started!");
  };

  const handleNoMoreMovies = () => {
    setNoMoreMovies(true);
    toast.info("No more movies available.");
  };

  const handleMatchFound = (movieId: number) => {
    const movie = movieQueueRef.current.find((movie) => movie.id === movieId);

    if (!movie) {
      console.error("Movie not found in queue.");
      return;
    }

    toast.success(`Match found for movie ${movie.title}!`);
    setMatches((prev) => [...prev, movieId]);
  };

  const storeMatch = async (movie: MovieDto, movieMatch: MovieMatch, prevMatches: number[]) => {
    if (prevMatches.length === 0) {
      const newGameId = await saveGame([movieMatch]);
      if (newGameId) {
        setCurrentGameId(newGameId);
        console.log(`New game created with ID: ${newGameId}`);
      }
      else {
        console.error("Failed to create new game in storage");
      }
    } else if (currentGameId) {
      await addMatchToGame(currentGameId, movieMatch);
    }
  };

  const handleUserJoined = (connectionId: string) => {
    setJoinedUsersCount((prev) => prev + 1);
    toast(`User ${connectionId} joined.`);
  };

  const handleUserLeft = (connectionId: string) => {
    setJoinedUsersCount((prev) => Math.max(prev - 1, 0));
    toast(`User ${connectionId} left.`);
  };

  const handleSessionTerminated = (message: string) => {
    toast.error(message);
    router.push("/");
  };

  const handleFinishMatching = () => {
    toast.info("Finishing matching...");
    finishMatching(sessionId!);
  };

  // Host: Create new session
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

  // Host: Start matching (swiping)
  const handleStartMatching = async () => {
    if (!sessionId) return;
    try {
      await startMatching(sessionId);
    } catch {
      toast.error("Failed to start matching. Please try again.");
    }
  };

  // Handle swipe action for both host and joined users
  const handleSwipe = async (isLiked: boolean) => {
    const currentMovie = movieQueue[movieQueue.length - 1];
    if (!sessionId || !currentMovie) return;
    try {
      await swipeMovie(sessionId, currentMovie.id, isLiked);
    } catch {
      toast.error("Failed to swipe. Please try again.");
    }
  };

  const handleMatchingComplete = async () => {
    try {
      toast.info("Matching complete!");
      await disconnect();
    } catch (error) {
      console.log("Connection may already be closed:", error);
    }
    finally {
      if (currentGameIdRef.current) {
        router.push(`/history/${currentGameIdRef.current}`);
      }
      else {
        router.push("/");
      }
    }
  };

  // Render connection state
  if (!isConnected && sessionIdFromParam) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-red-600">Connecting...</h1>
        <p className="text-gray-700 dark:text-gray-300">
          Attempting to connect to the session. Please wait.
        </p>
      </div>
    );
  }
  if (!isConnected && !sessionIdFromParam) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-red-600">No Connection</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          You are not connected to the game server. Please return to the home
          page and create a game.
        </p>
        <Button onClick={() => router.push("/")}>Return to Home</Button>
      </div>
    );
  }

  // Render based on user role
  if (isHost) {
    return sessionId ? (
      <GameHostView
        onFinishMatching={handleFinishMatching}
        sessionId={sessionId}
        joinedUsersCount={joinedUsersCount}
        isMatchingStarted={isMatchingStarted}
        movieQueue={movieQueue}
        matches={matches}
        noMoreMovies={noMoreMovies}
        onStartMatching={handleStartMatching}
        onSwipe={handleSwipe}
      />
    ) : (
      <div className="flex flex-col items-center justify-center text-center">
        <Button className="mt-4" onClick={handleStartGame}>
          Start a New Game
        </Button>
      </div>
    );
  } else {
    return (
      <GameParticipantView
        sessionId={sessionId!}
        isMatchingStarted={isMatchingStarted}
        movieQueue={movieQueue}
        matches={matches}
        noMoreMovies={noMoreMovies}
        onSwipe={handleSwipe}
      />
    );
  }
}
