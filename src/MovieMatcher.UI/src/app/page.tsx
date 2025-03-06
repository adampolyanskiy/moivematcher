import CreateGameDialog from "@/components/CreateGameDialog";
import MovieMatcherHeader from "@/components/MovieMatcherHeader";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-[25vh] text-center">
      <MovieMatcherHeader />
      <div className="flex justify-center">
        <CreateGameDialog />
      </div>
    </div>
  );
}
