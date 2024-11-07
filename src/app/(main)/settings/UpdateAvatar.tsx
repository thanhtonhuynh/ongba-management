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
  UpdateAvatarSchema,
  UpdateAvatarSchemaInput,
} from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { updateAvatarAction } from "./actions";
import { toast } from "sonner";
import { ProfilePicture } from "@/components/ProfilePicture";

type UpdateAvatarFormProps = {
  user: User;
};

export function UpdateAvatar({ user }: UpdateAvatarFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<UpdateAvatarSchemaInput>({
    resolver: zodResolver(UpdateAvatarSchema),
  });

  async function onSubmit(data: UpdateAvatarSchemaInput) {
    startTransition(async () => {
      const { error } = await updateAvatarAction(data);
      if (error) toast.error(error);
      else toast.success("Profile picture updated.");
    });
  }

  return (
    <div className="flex flex-col space-y-2 rounded-md border p-4 shadow-md sm:flex-row sm:items-center sm:space-x-8 sm:space-y-0">
      <div className="self-center">
        {user.image && <ProfilePicture image={user.image} size={150} />}
      </div>

      <div className="space-y-2">
        <h2>Profile picture</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              name="image"
              control={form.control}
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormDescription>
                    Image size must be less than 2MB and in JPEG, PNG, JPG, or
                    WEBP format.
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="image/jpeg, image/png, image/jpg, image/webp"
                      onChange={(e) =>
                        onChange(e.target.files && e.target.files[0])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton
              variant={"outline"}
              loading={isPending}
              type="submit"
            >
              Update profile picture
            </LoadingButton>
          </form>
        </Form>
      </div>
    </div>
  );
}
