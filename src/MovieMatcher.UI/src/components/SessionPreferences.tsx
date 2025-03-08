import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useMovieMatcherHub } from "@/hooks/useMovieMatcherHub";

export default function SessionPreferences() {
  const context = useMovieMatcherHub().getContext();
  if (!context?.options) return null;

  return (
    <Card className="w-full max-w-md p-4">
      <CardHeader>
        <CardTitle>Session Preferences</CardTitle>
      </CardHeader>
      <CardContent className="text-gray-700 dark:text-gray-300 space-y-2">
        <p>
          <strong>Include Adult:</strong>{" "}
          {context.options.includeAdult ? "Yes" : "No"}
        </p>
        <p>
          <strong>Start Year:</strong> {context.options.startYear}
        </p>
        <p>
          <strong>End Year:</strong> {context.options.endYear}
        </p>
        <p>
          <strong>Genres:</strong>{" "}
          {context.options.genreIds.length > 0
            ? context.options.genreIds.join(", ")
            : "Any"}
        </p>
      </CardContent>
    </Card>
  );
}
