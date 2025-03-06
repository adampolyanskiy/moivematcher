import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useMovieMatcherHub } from "@/hooks/useMovieMatcherHub";

export default function SessionPreferences() {
  const sessionOptions = useMovieMatcherHub().getContext();
  if (!sessionOptions) return null;

  return (
    <Card className="w-full max-w-md p-4">
      <CardHeader>
        <CardTitle>Session Preferences</CardTitle>
      </CardHeader>
      <CardContent className="text-gray-700 dark:text-gray-300 space-y-2">
        <p>
          <strong>Include Adult:</strong>{" "}
          {sessionOptions.includeAdult ? "Yes" : "No"}
        </p>
        <p>
          <strong>Start Year:</strong> {sessionOptions.startDate}
        </p>
        <p>
          <strong>End Year:</strong> {sessionOptions.endDate}
        </p>
        <p>
          <strong>Genres:</strong>{" "}
          {sessionOptions.genreIds.length > 0
            ? sessionOptions.genreIds.join(", ")
            : "Any"}
        </p>
      </CardContent>
    </Card>
  );
}