"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { resetPasswordAction } from "./actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ErrorMessage } from "@/components/Message";
import { LoadingButton } from "@/components/buttons/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import {
  ResetPasswordSchema,
  ResetPasswordSchemaTypes,
} from "@/lib/validations/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

export function ResetPasswordForm() {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const form = useForm<ResetPasswordSchemaTypes>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      logOutOtherDevices: true,
    },
  });
  const router = useRouter();

  async function onSubmit(data: ResetPasswordSchemaTypes) {
    setError(undefined);
    startTransition(async () => {
      const { error } = await resetPasswordAction(data);

      if (error) {
        setError(error);
        return;
      }
      toast.success("Password reset successfully!");
      router.push("/login");
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && <ErrorMessage message={error} />}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} placeholder="Password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} placeholder="Confirm Password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logOutOtherDevices"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
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
          Reset Password
        </LoadingButton>
      </form>
    </Form>
  );
}
