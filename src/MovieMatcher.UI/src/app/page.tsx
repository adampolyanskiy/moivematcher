import CreateGameDialog from "@/components/CreateGameDialog";
import MovieMatcherHeader from "@/components/MovieMatcherHeader";
import JoinGameForm from "@/components/JoinGameForm";
import GameHistoryList from "@/components/GameHistoryList";
import { Spotlight } from "@/components/ui/spotlight-new";

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight xOffset={450} />

      <div className="w-full lg:w-1/3 p-4 lg:p-6 order-2 lg:order-1">
        <GameHistoryList />
      </div>

      <div className="w-full lg:w-2/3 flex lg:-translate-y-1/8 flex-col items-center justify-center order-1 lg:order-2 p-4 lg:p-6 p-4 relative z-10">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          MovieMatcher
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Swipe through movies, match with friends, and discover the perfect film
          to watch together!
        </p>
        <div className="flex flex-col items-center gap-6 w-full max-w-md mt-6">
          <CreateGameDialog />
          <JoinGameForm />
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/3 p-6 order-3"></div>
    </div>
  );
}