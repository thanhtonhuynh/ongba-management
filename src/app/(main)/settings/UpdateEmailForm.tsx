"use client";

import { LoadingButton } from "@/components/buttons/LoadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/auth/session";
import {
  UpdateEmailSchema,
  UpdateEmailSchemaInput,
} from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { updateEmailAction } from "./actions";
import { toast } from "sonner";

type UpdateNameFormProps = {
  user: User;
};

export function UpdateEmailForm({ user }: UpdateNameFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<UpdateEmailSchemaInput>({
    resolver: zodResolver(UpdateEmailSchema),
    mode: "onBlur",
    defaultValues: {
      email: user.email,
    },
  });

  async function onSubmit(data: UpdateEmailSchemaInput) {
    startTransition(async () => {
      const { error } = await updateEmailAction(data);
      if (error) toast.error(error);
      else toast.success("Email updated.");
    });
  }

  return (
    <div className="space-y-2 rounded-md border p-4 shadow-md">
      <h2>Email</h2>

      <div className="space-y-1 text-sm text-muted-foreground">
        <p>
          <span className="font-semibold">Note:</span> Please use a real email
          so the system can send you reset password emails if you ever forget
          your password.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="example@gmail.com" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton variant={"outline"} loading={isPending} type="submit">
            Update email
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}
