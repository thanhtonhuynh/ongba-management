"use client";

import { User } from "@/lib/auth/session";
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
import { useTransition } from "react";
import { toast } from "sonner";
import { reactivateUserAction } from "./actions";

type ReactivateUser = {
  user: User;
};

export function ReactivateUser({ user }: ReactivateUser) {
  const [isPending, startTransition] = useTransition();

  async function handleReactivate() {
    startTransition(async () => {
      const { error } = await reactivateUserAction(user.id);
      if (error) toast.error(error);
      else toast.success(`Employee ${user.name} has been reactivated.`);
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={"outline"}
          size={`sm`}
          className="border-warning text-warning hover:bg-warning hover:text-warning-foreground"
        >
          Reactivate
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reactivate {user.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            Reactivating a user will grant them access to the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-warning hover:bg-warning/80 text-warning-foreground"
            onClick={handleReactivate}
            disabled={isPending}
          >
            Yes, reactivate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
