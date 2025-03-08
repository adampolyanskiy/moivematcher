import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SessionInfo({ sessionId }: { sessionId: string }) {
  return (
    <Card className="w-full max-w-md p-4">
      <CardHeader>
        <CardTitle>Session Info</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Session Code:
        </p>
        <pre className="text-xl font-semibold bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg overflow-x-auto max-w-full">
          {sessionId}
        </pre>
      </CardContent>
    </Card>
  );
}
