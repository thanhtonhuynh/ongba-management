"use client";

import { LoadingButton } from "@/components/buttons/LoadingButton";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/auth/session";
import {
  UpdateUsernameSchema,
  UpdateUsernameSchemaInput,
} from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateUsernameAction } from "./actions";

type UpdateUsernameFormProps = {
  user: User;
};

export function UpdateUsernameForm({ user }: UpdateUsernameFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<UpdateUsernameSchemaInput>({
    resolver: zodResolver(UpdateUsernameSchema),
    mode: "onBlur",
    defaultValues: {
      username: user.username,
    },
  });

  async function onSubmit(data: UpdateUsernameSchemaInput) {
    startTransition(async () => {
      const { error } = await updateUsernameAction(data);
      if (error) toast.error(error);
      else toast.success("Username updated.");
    });
  }

  return (
    <div className="space-y-4 rounded-lg border p-6 shadow-sm">
      <h6>Username</h6>

      <div className="text-muted-foreground space-y-1 text-sm">
        <p>
          Besides your email, your username can also be used to log in to your
          account.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="ongbavietnamese" />
                </FormControl>
                <FormDescription>
                  Must be at least 6 characters and is not case-sensitive.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton variant={"outline"} loading={isPending} type="submit">
            Save
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}
