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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/lib/auth/session";
import { MoreHorizontal, ShieldCheck, ShieldOff, UserCog } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { activateUserAction, deactivateUserAction } from "../_actions";
import { ChangeUserRoleDialog } from "./change-role-dialog";

type EmployeeActionsProps = {
  employee: User;
  /** Whether the current user can update this employee */
  canUpdate: boolean;
};

type ConfirmAction = {
  type: "deactivate" | "verify" | "reactivate";
  title: string;
  description: string;
  confirmText: string;
  variant: "destructive" | "default";
};

const CONFIRM_ACTIONS: Record<
  ConfirmAction["type"],
  Omit<ConfirmAction, "type">
> = {
  deactivate: {
    title: "Deactivate employee?",
    description: "Deactivating will revoke their access to the system.",
    confirmText: "Yes, deactivate",
    variant: "destructive",
  },
  verify: {
    title: "Grant access?",
    description:
      "User will have general access to the system. You can then assign them a specific role.",
    confirmText: "Yes, grant access",
    variant: "default",
  },
  reactivate: {
    title: "Reactivate employee?",
    description: "Reactivating will grant them access to the system again.",
    confirmText: "Yes, reactivate",
    variant: "default",
  },
};

export function EmployeeActions({ employee, canUpdate }: EmployeeActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [confirmAction, setConfirmAction] = useState<
    ConfirmAction["type"] | null
  >(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);

  if (!canUpdate) return null;

  const status = employee.accountStatus;
  const actionConfig = confirmAction ? CONFIRM_ACTIONS[confirmAction] : null;

  async function handleConfirm() {
    if (!confirmAction) return;

    startTransition(async () => {
      let result: { error?: string };

      switch (confirmAction) {
        case "deactivate":
          result = await deactivateUserAction(employee.id);
          if (!result.error) {
            toast.success(`${employee.name} has been deactivated.`);
          }
          break;
        case "verify":
          result = await activateUserAction(employee.id);
          if (!result.error) {
            toast.success(`${employee.name} has been verified.`);
          }
          break;
        case "reactivate":
          result = await activateUserAction(employee.id);
          if (!result.error) {
            toast.success(`${employee.name} has been reactivated.`);
          }
          break;
      }

      if (result.error) {
        toast.error(result.error);
      }

      setConfirmAction(null);
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {status === "active" && (
            <>
              <DropdownMenuItem onClick={() => setRoleDialogOpen(true)}>
                <UserCog className="mr-2 h-4 w-4" />
                Change role
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onClick={() => setConfirmAction("deactivate")}
              >
                <ShieldOff className="mr-2 h-4 w-4" />
                Deactivate
              </DropdownMenuItem>
            </>
          )}

          {status === "inactive" && (
            <DropdownMenuItem onClick={() => setConfirmAction("verify")}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Grant access
            </DropdownMenuItem>
          )}

          {status === "deactivated" && (
            <DropdownMenuItem onClick={() => setConfirmAction("reactivate")}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Reactivate
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={confirmAction !== null}
        onOpenChange={(open) => !open && setConfirmAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionConfig?.title.replace("?", ` ${employee.name}?`)}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {actionConfig?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isPending}
              variant={actionConfig?.variant}
            >
              {actionConfig?.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Role Dialog */}
      <ChangeUserRoleDialog
        selectedUser={employee}
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
      />
    </>
  );
}
