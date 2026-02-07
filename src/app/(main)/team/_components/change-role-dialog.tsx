"use client";

import { LoadingButton } from "@/components/buttons/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/contexts/SessionProvider";
import { User } from "@/lib/auth/session";
import {
  UpdateEmployeeRoleInput,
  UpdateEmployeeRoleSchema,
} from "@/lib/validations/employee";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateUserRoleAction } from "../_actions";

type ChangeUserRoleDialogProps = {
  selectedUser: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ChangeUserRoleDialog({
  selectedUser,
  open,
  onOpenChange,
}: ChangeUserRoleDialogProps) {
  const { user } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateEmployeeRoleInput>({
    resolver: zodResolver(UpdateEmployeeRoleSchema),
    defaultValues: {
      userId: selectedUser.id,
    },
  });

  async function onSubmit(data: UpdateEmployeeRoleInput) {
    startTransition(async () => {
      const { error } = await updateUserRoleAction(data);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Role updated.");
        onOpenChange(false);
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        onOpenChange(newOpen);
        if (!newOpen) form.reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change role</DialogTitle>

          <DialogDescription className="text-primary flex flex-col gap-2 pt-2 font-semibold">
            {selectedUser.name}
            <span className="font-medium capitalize">
              Current role: {selectedUser.role}
            </span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>
                    Select a new role for the team member. This will change
                    their permissions in the system.
                  </FormDescription>

                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="Unassigned role">
                        Unassigned role
                      </SelectItem>

                      <SelectItem value="Server">Server</SelectItem>

                      <SelectItem value="Chef">Chef</SelectItem>

                      {user?.role === "admin" && (
                        <>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:space-x-0">
              <DialogClose
                render={
                  <Button variant={`ghost`} type="button">
                    Cancel
                  </Button>
                }
              />

              <LoadingButton loading={isPending} type="submit">
                Save
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
