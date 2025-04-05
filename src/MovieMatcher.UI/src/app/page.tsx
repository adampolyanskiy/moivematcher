import CreateGameDialog from "@/components/CreateGameDialog";
import MovieMatcherHeader from "@/components/MovieMatcherHeader";
import JoinGameForm from "@/components/JoinGameForm";
import GameHistoryList from "@/components/GameHistoryList";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Game History */}
      <div className="w-1/3 p-6">
        <GameHistoryList />
      </div>
      
      {/* Right side content */}
      <div className="w-2/3 flex flex-col items-center justify-start p-6">
        <MovieMatcherHeader />
        <div className="flex flex-col items-center gap-6 w-full max-w-md mt-6">
          <CreateGameDialog />
          <JoinGameForm />
        </div>
      </div>

      <div className="w-1/3 p-6"></div>
    </div>
  );
}