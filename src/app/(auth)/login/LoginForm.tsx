"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import { ErrorMessage } from "@/components/Message";
import Link from "next/link";
import { loginAction } from "./actions";
import { LoginSchema, LoginSchemaTypes } from "@/lib/auth/validation";

export function LoginForm() {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginSchemaTypes>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginSchemaTypes) {
    setError(undefined);
    startTransition(async () => {
      const { error } = await loginAction(data);

      if (error) setError(error);
    });

    form.resetField("password");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col space-y-4"
      >
        {error && <ErrorMessage message={error} />}

        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email or username</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Email or username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center justify-between">
                Password
                <Link
                  className="text-xs text-blue-500 hover:underline"
                  href="/login/forgot-password"
                >
                  Forgot password?
                </Link>
              </FormLabel>
              <FormControl>
                <PasswordInput {...field} placeholder="Password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton type="submit" className="w-full" loading={isPending}>
          Login
        </LoadingButton>
      </form>
    </Form>
  );
}
