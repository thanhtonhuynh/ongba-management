"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { User } from "@/lib/auth/session";
import {
  UpdateEmployeeRoleInput,
  UpdateEmployeeRoleSchema,
} from "@/lib/validations/employee";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { updateUserRoleAction } from "./actions";
import { toast } from "sonner";
import { LoadingButton } from "@/components/LoadingButton";
import { useSession } from "@/contexts/SessionProvider";

type ChangeUserRoleDialogProps = {
  selectedUser: User;
};

export function ChangeUserRoleDialog({
  selectedUser,
}: ChangeUserRoleDialogProps) {
  const { user } = useSession();
  const [open, setOpen] = useState(false);
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
        toast.success("Role updated successfully!");
        setOpen(false);
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant={`outline`} size={`sm`}>
          Change role
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change role</DialogTitle>

          <DialogDescription className="flex items-center gap-2 pt-2 font-semibold text-primary">
            {selectedUser.name}
            <span className="rounded-full border bg-muted px-2 font-medium capitalize">
              {selectedUser.role}
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
                    Select a new role for the employee.
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
              <DialogClose asChild>
                <Button variant={`ghost`} type="button">
                  Cancel
                </Button>
              </DialogClose>

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
