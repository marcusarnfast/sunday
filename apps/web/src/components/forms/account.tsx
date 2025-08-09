"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@sunday/monday/api";
import type { Id } from "@sunday/monday/data-model";
import { Button } from "@sunday/ui/components/button";
import { Form } from "@sunday/ui/components/form";
import { toast } from "@sunday/ui/components/sonner";
import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";
import z from "zod/v4";
import { DisplayField } from "./fields/display";
import { TextField } from "./fields/text";
import { UploadField } from "./fields/upload";

const accountFormSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1),
  imageId: z.string().optional(),
});

type AccountFormProps = {
  preloadedUser: Preloaded<typeof api.users.getUser>;
};

export function AccountForm({ preloadedUser }: AccountFormProps) {
  const account = usePreloadedQuery(preloadedUser);
  const updateMutation = useMutation(api.users.updateUser);

  const form = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: account
      ? {
          ...account,
        }
      : {
          name: "",
        },
  });

  const isDirty = form.formState.isDirty;

  const handleSubmit = (data: z.infer<typeof accountFormSchema>) => {
    if (!isDirty) return;

    toast.promise(
      async () => {
        const account = await updateMutation({
          ...data,
          _id: data._id as Id<"users"> | undefined,
          imageId: data.imageId as Id<"_storage"> | undefined,
        });

        form.reset({ ...account });
      },
      {
        loading: "Updating account...",
        success: "Account updated successfully",
        error: "Failed to save account",
      },
    );
  };

  useHotkeys(
    "mod+s",
    () => {
      form.handleSubmit(handleSubmit)();
    },
    {
      enabled: isDirty,
      enableOnFormTags: true,
    },
  );

  return (
    <Form {...form}>
      <form
        className="max-w-2xl"
        id="form"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="space-y-4">
          <TextField
            control={form.control}
            name="name"
            label="Name"
            placeholder="Your name"
          />
          <DisplayField
            value={account?.email}
            name="email"
            label="Email"
            placeholder="Your email"
          />
          <UploadField
            control={form.control}
            name="imageId"
            path="/accounts/"
            label="Profile Image"
            className="aspect-square"
            optional
            description="This image will be shown as your profile image"
          />
          <div className="flex justify-end">
            <Button type="submit" form="form" disabled={!isDirty}>
              Save
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
