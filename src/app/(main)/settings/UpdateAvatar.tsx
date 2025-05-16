"use client";

import { LoadingButton } from "@/components/buttons/LoadingButton";
import { ProfilePicture } from "@/components/ProfilePicture";
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
  UpdateAvatarSchema,
  UpdateAvatarSchemaInput,
} from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateAvatarAction } from "./actions";

type UpdateAvatarFormProps = {
  user: User;
};

export function UpdateAvatar({ user }: UpdateAvatarFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<UpdateAvatarSchemaInput>({
    resolver: zodResolver(UpdateAvatarSchema),
    mode: "onBlur",
  });

  async function onSubmit(data: UpdateAvatarSchemaInput) {
    startTransition(async () => {
      const { error } = await updateAvatarAction(data);
      if (error) toast.error(error);
      else toast.success("Profile picture updated.");
    });
  }

  return (
    <div className="flex flex-col space-y-2 rounded-lg border p-6 shadow-sm sm:flex-row sm:items-center sm:space-y-0 sm:space-x-8">
      <div className="self-center">
        {user.image && <ProfilePicture image={user.image} size={150} />}
      </div>

      <div className="space-y-4">
        <h6>Profile picture</h6>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="image"
              control={form.control}
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
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
                  <FormDescription>
                    Image size must be less than 5MB and in JPEG, PNG, JPG, or
                    WEBP format.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton
              variant={"outline"}
              loading={isPending}
              type="submit"
            >
              Upload
            </LoadingButton>
          </form>
        </Form>
      </div>
    </div>
  );
}
