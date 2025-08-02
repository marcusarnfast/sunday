"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@sunday/monday/api";
import type { Id } from "@sunday/monday/data-model";
import { Button } from "@sunday/ui/components/button";
import { Form } from "@sunday/ui/components/form";
import { toast } from "@sunday/ui/components/sonner";
import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod/v4";
import { useStorageUpload } from "~/hooks/use-storage-upload";
import { TextField } from "./fields/text";
import { UploadField } from "./fields/upload";
import { fileMetadataSchema } from "./schemas/file-metadata";

const accountFormSchema = z.object({
  name: z.string().min(1),
  image: z.union([z.instanceof(File), fileMetadataSchema]).nullable(),
});

type SetupAccountProps = {
  preloadedUser: Preloaded<typeof api.users.getUser>;
};

export function SetupAccount({ preloadedUser }: SetupAccountProps) {
  const initialData = usePreloadedQuery(preloadedUser);
  const updateMutation = useMutation(api.users.updateUser);
  const { uploadFile } = useStorageUpload();
  const router = useRouter();

  const form = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: initialData
      ? {
        ...initialData,
      }
      : {
        name: "",
        image: null,
      },
  });

  const handleSubmit = (data: z.infer<typeof accountFormSchema>) => {

    toast.promise(
      async () => {
        try {
          const uploaded = await uploadFile({
            newFile: data.image,
            previousId: initialData?.imageId as Id<"_storage"> | undefined,
          });

          const payload = {
            name: data.name,
            imageId: uploaded?.id,
          };

          await updateMutation(payload);

          form.reset({
            name: data.name,
            image: data.image,
          });

          router.push("/");
        } catch (error) {
          console.error(error);
        }
      },
      {
        loading: "Updating account...",
        success: "Account updated successfully",
        error: "Failed to update account",
      },
    );
  };


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
          <UploadField
            control={form.control}
            name="image"
            label="Profile picture"
            optional
            description="This image will be shown as your profile picture"
            className="aspect-square size-64"
          />
          <div className="flex justify-end">
            <Button type="submit" form="form">
              Finish
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
