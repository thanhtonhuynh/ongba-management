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
import { UpdateRoleInput, UpdateRoleSchema } from "@/lib/validations/roles";
import { zodResolver } from "@hookform/resolvers/zod";
import { Permission, Role } from "@prisma/client";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateRoleAction } from "../actions";

type RoleWithDetails = Role & {
  permissions: Permission[];
};

type EditRoleModalProps = {
  role: RoleWithDetails;
  permissionsGrouped: Record<string, Permission[]>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditRoleModal({
  role,
  permissionsGrouped,
  open,
  onOpenChange,
}: EditRoleModalProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateRoleInput>({
    resolver: zodResolver(UpdateRoleSchema),
    defaultValues: {
      id: role.id,
      name: role.name,
      description: role.description ?? "",
      permissionIds: role.permissions.map((p) => p.id),
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        id: role.id,
        name: role.name,
        description: role.description ?? "",
        permissionIds: role.permissions.map((p) => p.id),
      });
    }
  }, [open, role, form]);

  async function onSubmit(data: UpdateRoleInput) {
    startTransition(async () => {
      const result = await updateRoleAction(data);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Role updated successfully.");
        onOpenChange(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader showBorder>
          <DialogTitle>Edit Role: {role.name}</DialogTitle>
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
                      <Input placeholder="e.g., Shift Lead" {...field} disabled={!role.editable} />
                    </FormControl>
                    <FormMessage />
                    {!role.editable && (
                      <p className="text-muted-foreground text-xs">
                        Default role names cannot be changed
                      </p>
                    )}
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
                Save Changes
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
