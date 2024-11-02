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
import { verifyUserAction } from "./actions";
import { toast } from "sonner";

type VerifyUserProps = {
  user: User;
};

export function VerifyUser({ user }: VerifyUserProps) {
  const [isPending, startTransition] = useTransition();

  async function handleVerify() {
    startTransition(async () => {
      const { error } = await verifyUserAction(user.id);
      if (error) toast.error(error);
      else toast.success(`Employee ${user.name} has been deactivated.`);
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={"outline"}
          size={`sm`}
          className="border-success text-success hover:bg-success hover:text-success-foreground"
        >
          Grant access
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Grant access to {user.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            User will have general access to the system. <br />
            You can then go to the Active tab to assign them a specific role.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-success hover:bg-success/80 text-success-foreground"
            onClick={handleVerify}
            disabled={isPending}
          >
            Yes, grant access
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
