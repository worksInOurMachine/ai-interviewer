"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStrapi } from "@/lib/api/useStrapi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function ReportsPage() {
  const { data: user } = useSession<any>();
  const router = useRouter();

  const { data, error, isLoading } = useStrapi("interviews", {
    filters: { user: user?.user?.id },
  });

  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const cleanMarkdown = (markdown: string) => {
    if (!markdown) return "";
    return markdown
      .replace(/```html/g, "")
      .replace(/```/g, "")
      .trim();
  };

  if (isLoading) return <div>Loading reports...</div>;
  if (error) return <div>Error loading reports</div>;

  const interviews: any[] = data?.data || [];

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Interview Reports</h1>

      <div className="grid gap-6">
        {interviews.map((interview) => (
          <Card
            key={interview.id}
            className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div className="flex-1 space-y-1">
              <p>
                <strong>Topic:</strong> {interview.details}
              </p>
              <p>
                <strong>Mode:</strong> {interview.mode}
              </p>
              <p>
                <strong>Difficulty:</strong> {interview.difficulty}
              </p>
              <p>
                <strong>Skills:</strong> {interview.skills}
              </p>
              <p>
                <strong>Number of Questions:</strong>{" "}
                {interview.numberOfQuestions}
              </p>
            </div>

            <div className="flex gap-2 mt-4 md:mt-0">
              <Button
                onClick={() =>
                  setSelectedReport(interview.report || "No report available")
                }
              >
                View Report
              </Button>
              <Button
                variant="default"
                onClick={() =>
                  router.push(`/interview/${interview.documentId}`)
                }
              >
                Retake Interview
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal for Markdown + HTML report */}
      <Dialog
        open={!!selectedReport}
        onOpenChange={() => setSelectedReport(null)}
      >
        <DialogContent className="w-[90vw] h-[90vh] max-w-[95vw] max-h-[95vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Interview Report</DialogTitle>
          </DialogHeader>

          <div className="prose max-w-full bg-black text-white">
            {selectedReport && (
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {cleanMarkdown(selectedReport)}
              </ReactMarkdown>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setSelectedReport(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </main>
  );
}
