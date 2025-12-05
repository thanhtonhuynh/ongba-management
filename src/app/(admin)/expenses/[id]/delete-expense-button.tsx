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
import { Expense } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteExpenseAction } from "../actions";

type Props = {
  expense: Expense;
};

export function DeleteExpenseButton({ expense }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleDeleteExpense() {
    startTransition(async () => {
      const error = await deleteExpenseAction(expense.id);
      if (error) toast.error(error);
      else {
        router.push("/expenses");
        toast.success(`Expense has been deleted.`);
      }
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={"outline"}
          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground w-full"
        >
          Delete this record
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Deleting this record is irreversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
            onClick={handleDeleteExpense}
            disabled={isPending}
          >
            Yes, delete it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
