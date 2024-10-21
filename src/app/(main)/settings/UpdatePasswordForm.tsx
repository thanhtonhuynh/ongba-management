"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { updatePasswordAction } from "./actions";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import {
  UpdatePasswordSchema,
  UpdatePasswordSchemaInput,
} from "@/lib/auth/validation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/lib/auth/session";

type ResetPasswordFormProps = {
  user: User;
};

export function UpdatePasswordForm({ user }: ResetPasswordFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<UpdatePasswordSchemaInput>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      logOutOtherDevices: true,
    },
  });
  const router = useRouter();

  async function onSubmit(data: UpdatePasswordSchemaInput) {
    startTransition(async () => {
      const { error } = await updatePasswordAction(data);
      if (error) toast.error(error);
      else toast.success("Password updated.");
    });
  }

  return (
    <div className="space-y-2 rounded-md border p-4 shadow-md">
      <h2 className="font-semibold">Password</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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

          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              Please sign out of other devices if you think your account has
              been compromised.
            </p>
          </div>

          <FormField
            control={form.control}
            name="logOutOtherDevices"
            render={({ field }) => (
              <FormItem className="mb-4 mt-2 flex flex-row items-center space-x-3 space-y-0">
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

          <LoadingButton type="submit" loading={isPending} className="w-full">
            Update password
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}