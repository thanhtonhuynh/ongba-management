"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SaleReportCardProcessedData } from "@/types";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useTransition } from "react";
import { toast } from "sonner";
import { deleteReportAction } from "./actions";

type Props = {
  reportId: string;
  setProcessedReport: Dispatch<
    SetStateAction<SaleReportCardProcessedData | null>
  >;
};

export function DeleteReportButton({ reportId, setProcessedReport }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleDeleteReport() {
    startTransition(async () => {
      const error = await deleteReportAction(reportId);
      if (error) toast.error(error);
      else {
        setProcessedReport(null);
        toast.success(`Report has been deleted.`);
      }
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={"outline"}
          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          Delete this report
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this report?
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-2 text-left">
            <span>This action cannot be undone!</span>
            <span>
              It will also remove all employees' hours and tips associated with
              this report.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
            onClick={handleDeleteReport}
            disabled={isPending}
          >
            Yes, delete it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
