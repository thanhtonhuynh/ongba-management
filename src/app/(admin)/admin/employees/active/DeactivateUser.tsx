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
import { deactivateUserAction } from "./actions";
import { toast } from "sonner";

type DeactivateUserProps = {
  user: User;
};

export function DeactivateUser({ user }: DeactivateUserProps) {
  const [isPending, startTransition] = useTransition();

  async function handleDeactivate() {
    startTransition(async () => {
      const { error } = await deactivateUserAction(user.id);
      if (error) toast.error(error);
      else toast.success(`Employee ${user.name} has been deactivated.`);
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"} className="text-destructive">
          Deactivate
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate {user.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            Deactivating a user will revoke their access to the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant={`destructive`}
            onClick={handleDeactivate}
            disabled={isPending}
          >
            Yes, deactivate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
