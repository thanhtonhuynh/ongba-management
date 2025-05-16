"use client";

import { LoadingButton } from "@/components/buttons/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  UpdatePasswordSchema,
  UpdatePasswordSchemaInput,
} from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updatePasswordAction } from "./actions";

export function UpdatePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<UpdatePasswordSchemaInput>({
    resolver: zodResolver(UpdatePasswordSchema),
    mode: "onBlur",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      logOutOtherDevices: true,
    },
  });

  async function onSubmit(data: UpdatePasswordSchemaInput) {
    startTransition(async () => {
      const { error } = await updatePasswordAction(data);
      if (error) toast.error(error);
      else toast.success("Password updated.");
    });

    form.reset();
  }

  return (
    <div className="space-y-4 rounded-lg border p-6 shadow-sm">
      <h6>Password</h6>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} placeholder="Current password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} placeholder="New password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Confirm new password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-muted-foreground -mb-2 space-y-1 text-sm">
            <p>
              Please sign out of other devices if you think your account has
              been compromised.
            </p>
          </div>

          <FormField
            control={form.control}
            name="logOutOtherDevices"
            render={({ field }) => (
              <FormItem className="mt-2 mb-4 flex flex-row items-center space-y-0 space-x-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Sign out of other devices</FormLabel>
              </FormItem>
            )}
          />

          <LoadingButton type="submit" loading={isPending} variant={"outline"}>
            Update password
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}
