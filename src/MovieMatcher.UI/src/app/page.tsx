"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMovieMatcherHub } from "@/hooks/useMovieMatcherHub";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import * as signalR from "@microsoft/signalr";

export default function Home() {
  const { connect, connecting } = useMovieMatcherHub();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateGame = async () => {
    debugger;
    setLoading(true);

    try {
      const connection = await connect();

      if (connection && connection.state == signalR.HubConnectionState.Connected) {
        router.push("/game");
      } else {
        toast.error("Failed to start game. Please try again.");
        console.error("Failed to establish connection.");
      }
    } catch (error) {
      toast("Failed to establish connection.");
      console.error("Error connecting to SignalR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-[25vh] text-center">
      <header className="text-center">
        <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          🎬 MovieMatcher
        </h1>
        <h2 className="text-xl md:text-2xl mt-3 max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
          Swipe through movies, match with friends, and discover the perfect
          film to watch together!
        </h2>
      </header>
      <div className="flex justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4">Create New Game</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Start a New Game</DialogTitle>
            <div className="space-y-4">Game Options</div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>

              <Button
                variant="default"
                onClick={handleCreateGame}
                disabled={loading || connecting}
              >
                {loading || connecting ? "Connecting..." : "Start"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
