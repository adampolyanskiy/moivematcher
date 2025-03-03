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
        {/* Invite Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4">Create New Game</Button>
          </DialogTrigger>

          {/* Popup Modal */}
          <DialogContent>
            <DialogTitle>Start a New Game</DialogTitle>

            {/* Form Fields */}
            <div className="space-y-4">Game Options</div>

            {/* Action Buttons */}
            <DialogFooter>
              <Button variant="secondary">Cancel</Button>
              <Button variant="default">Start</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
