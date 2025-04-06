import CreateGameDialog from "@/components/CreateGameDialog";
import MovieMatcherHeader from "@/components/MovieMatcherHeader";
import JoinGameForm from "@/components/JoinGameForm";
import GameHistoryList from "@/components/GameHistoryList";

export default function Home() {
  return (
    <div className="flex flex-col flex lg:flex-row min-h-full">
      {/* Left side - Game History */}
      <div className="w-full lg:w-1/3 p-4 lg:p-6 order-2 lg:order-1">
        <GameHistoryList />
      </div>
      
      {/* Center content */}
      <div className="w-full lg:w-2/3 flex flex-col items-center justify-start order-1 lg:order-2 p-4 lg:p-6">
        <MovieMatcherHeader />
        <div className="flex flex-col items-center gap-6 w-full max-w-md mt-6">
          <CreateGameDialog />
          <JoinGameForm />
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/3 p-6 order-3"></div>
    </div>
  );
}