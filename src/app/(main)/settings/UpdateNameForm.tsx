"use client";

import { LoadingButton } from "@/components/buttons/LoadingButton";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/auth/session";
import {
  UpdateNameSchema,
  UpdateNameSchemaInput,
} from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { updateNameAction } from "./actions";
import { toast } from "sonner";

type UpdateNameFormProps = {
  user: User;
};

export function UpdateNameForm({ user }: UpdateNameFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<UpdateNameSchemaInput>({
    resolver: zodResolver(UpdateNameSchema),
    mode: "onBlur",
    defaultValues: {
      name: user.name,
    },
  });

  async function onSubmit(data: UpdateNameSchemaInput) {
    startTransition(async () => {
      const { error } = await updateNameAction(data);
      if (error) toast.error(error);
      else toast.success("Name updated.");
    });
  }

  return (
    <div className="space-y-2 rounded-md border p-4 shadow-md">
      <h2>Display name</h2>

      <div className="space-y-1 text-sm text-muted-foreground">
        <p>
          <span className="font-semibold">Note:</span> Please use your real name
          so your colleagues can easily identify you when they create reports.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your real name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ong Ba" />
                </FormControl>
                <FormDescription>
                  Must be at least 2 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton variant={"outline"} loading={isPending} type="submit">
            Update name
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}
