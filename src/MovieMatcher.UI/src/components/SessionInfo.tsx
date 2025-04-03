import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export default function SessionInfo({ sessionId }: { sessionId: string }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(sessionId);
    toast.success("Session code copied to clipboard!");
  };

  return (
    <Card className="w-full max-w-md p-4">
      <CardHeader>
        <CardTitle>Session Info</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Session Code:
        </p>
        <div className="flex items-center gap-2">
          <pre className="text-xl font-semibold bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg overflow-x-auto max-w-full">
            {sessionId}
          </pre>
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            className="shrink-0"
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy session code</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
