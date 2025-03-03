import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Home() {
  return (
    <>
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-r dark:from-slate-900 dark:to-slate-700 from-slate-300 to-slate-500 blur-3xl"></div>
      </div>
      <header className="absolute top-4 right-4">
        <ModeToggle />
      </header>
      <div className="flex flex-col items-center justify-start min-h-screen pt-[25vh] text-center">
        <header className="text-center">
          <h1 className="text-6xl font-extrabold tracking-tight">
            🎬 MovieMatcher
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-600 mt-3 max-w-2xl mx-auto">
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
                <Button variant="secondary">Cancel</Button>
                <Button variant="default">Start</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
