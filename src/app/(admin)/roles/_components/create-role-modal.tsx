"use client";

import { LoadingButton } from "@/components/buttons/LoadingButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateRoleInput, CreateRoleSchema } from "@/lib/validations/roles";
import { zodResolver } from "@hookform/resolvers/zod";
import { Permission } from "@prisma/client";
import { useState, useTransition, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createRoleAction } from "../actions";

type CreateRoleModalProps = {
  children: ReactElement;
  permissionsGrouped: Record<string, Permission[]>;
};

export function CreateRoleModal({ children, permissionsGrouped }: CreateRoleModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateRoleInput>({
    resolver: zodResolver(CreateRoleSchema),
    defaultValues: {
      name: "",
      description: "",
      permissionIds: [],
    },
  });

  async function onSubmit(data: CreateRoleInput) {
    startTransition(async () => {
      const result = await createRoleAction(data);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Role created successfully.");
        setOpen(false);
        form.reset();
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) form.reset();
      }}
    >
      <DialogTrigger render={children} />

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader showBorder>
          <DialogTitle>Create Role</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogBody className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Shift Lead" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of this role's responsibilities"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="permissionIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permissions</FormLabel>
                    <div className="space-y-4">
                      {Object.entries(permissionsGrouped).map(([resource, permissions]) => (
                        <div key={resource} className="space-y-2">
                          <p className="text-sm font-medium capitalize">
                            {resource.replace("_", " ")}
                          </p>
                          <div className="ml-2 space-y-1">
                            {permissions.map((permission) => (
                              <label
                                key={permission.id}
                                className="flex cursor-pointer items-center gap-2 text-sm"
                              >
                                <Checkbox
                                  checked={field.value?.includes(permission.id)}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...(field.value || []), permission.id]
                                      : (field.value || []).filter((id) => id !== permission.id);
                                    field.onChange(newValue);
                                  }}
                                />
                                <span>{permission.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogBody>

            <DialogFooter>
              <DialogClose render={<Button variant="ghost">Cancel</Button>} />
              <LoadingButton loading={isPending} type="submit">
                Create
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
