"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMovieMatcherHub } from "@/hooks/useMovieMatcherHub";
import { useRouter } from "next/navigation";
import * as signalR from "@microsoft/signalr";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { GenreDto } from "@/types";
import { getMovieGenres } from "@/lib";
import { MultipleSelector } from "./ui/multiple-selector";

const createGameSchema = z.object({
  includeAdult: z.boolean(),
  years: z.array(z.number()),
  genreIds: z.array(z.number()),
});

export default function CreateGameDialog() {
  const [loading, setLoading] = useState(false);
  const { connect, connecting } = useMovieMatcherHub();
  const router = useRouter();
  const [genres, setGenres] = useState<GenreDto[]>([]);

  const form = useForm<z.infer<typeof createGameSchema>>({
    resolver: zodResolver(createGameSchema),
    defaultValues: {
      includeAdult: false,
      years: [2010, 2023],
      genreIds: [],
    },
  });

  const handleCreateGame = () => {
    form.handleSubmit(async (value) => {
      setLoading(true);

      try {
        const connection = await connect({
          includeAdult: value.includeAdult,
          startDate: value.years[0],
          endDate: value.years[1],
          genreIds: value.genreIds,
        });

        if (
          connection &&
          connection.state == signalR.HubConnectionState.Connected
        ) {
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
    })();
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getMovieGenres();
        setGenres(data);
      } catch {
        toast.error("Failed to load genres.");
      }
    };
    fetchGenres();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4">Create New Game</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Set up your preferences</DialogTitle>
        <Form {...form}>
          <form className="space-y-8">
            <FormField
              control={form.control}
              name="includeAdult"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Include Adult Movies</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="years"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    <span>Release Years</span>
                    <span>
                      {field.value[0]} - {field.value[1]}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Slider
                      step={1}
                      min={1900}
                      max={2023}
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="genreIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genres</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      value={genres
                        .filter((g) => field.value.includes(g.id))
                        .map((g) => ({
                          value: g.id.toString(),
                          label: g.name,
                        }))}
                      options={genres.map((g) => ({
                        value: g.id.toString(),
                        label: g.name,
                      }))}
                      onChange={(selected) =>
                        field.onChange(selected.map((g) => Number(g.value)))
                      }
                      placeholder="Select genres"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
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
  );
}
