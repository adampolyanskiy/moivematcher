"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function JoinGameForm() {
  const [sessionCode, setSessionCode] = useState("");
  const router = useRouter();

  const handleJoinGame = () => {
    if (!sessionCode.trim()) {
      toast.error("Please enter a valid session code.");
      return;
    }
    router.push(`/game?sid=${sessionCode.trim()}`);
  };

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 w-full px-4 sm:px-0 max-w-sm">
      <Input
        type="text"
        placeholder="Enter session code"
        value={sessionCode}
        onChange={(e) => setSessionCode(e.target.value)}
        className="w-full"
      />
      <Button onClick={handleJoinGame} className="w-full">
        Join Game
      </Button>
    </div>
  );
}
