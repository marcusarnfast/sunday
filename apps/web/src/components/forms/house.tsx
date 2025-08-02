"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@sunday/monday/api";
import type { Id } from "@sunday/monday/data-model";
import { Button } from "@sunday/ui/components/button";
import { Form } from "@sunday/ui/components/form";
import { toast } from "@sunday/ui/components/sonner";
import {
  type Preloaded,
  useMutation,
  usePreloadedQuery,
  useQuery,
} from "convex/react";
import { useForm } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";
import z from "zod/v4";
import { useStorageUpload } from "~/hooks/use-storage-upload";
import { TextField } from "./fields/text";
import { TextAreaField } from "./fields/text-area";
import { UploadField } from "./fields/upload";
import { fileMetadataSchema } from "./schemas/file-metadata";


const houseFormSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  description: z.string().optional(),
  image: z.union([z.instanceof(File), fileMetadataSchema]).nullable(),
});


type HouseFormProps = {
  houseId?: Id<"houses">;
  preloadedHouse?: Preloaded<typeof api.houses.getById>;
};

export function HouseForm({ houseId, preloadedHouse }: HouseFormProps) {
  const initialData = preloadedHouse ? usePreloadedQuery(preloadedHouse) : null;
  const createMutation = useMutation(api.houses.createHouse);
  const updateMutation = useMutation(api.houses.updateHouse);
  const { uploadFile } = useStorageUpload();

  const form = useForm<z.infer<typeof houseFormSchema>>({
    resolver: zodResolver(houseFormSchema),
    defaultValues: initialData
      ? {
        ...initialData,
      }
      : {
        name: "",
        address: "",
        image: null,
      },
  });

  const isDirty = form.formState.isDirty;

  const handleSubmit = (data: z.infer<typeof houseFormSchema>) => {
    if (!isDirty) return;

    toast.promise(
      async () => {
        const uploaded = await uploadFile({
          newFile: data.image,
          previousId: initialData?.image?.id as Id<"_storage"> | undefined,
        });

        const payload = {
          name: data.name,
          address: data.address,
          description: data.description,
          imageId: uploaded?.id,
        };

        if (houseId) {
          await updateMutation({ id: houseId, ...payload });
        } else {
          await createMutation(payload);
        }
        form.reset({
          name: data.name,
          address: data.address,
          description: data.description,
          image: data.image,
        });
      },
      {
        loading: houseId ? "Updating house..." : "Creating house...",
        success: houseId
          ? "House updated successfully"
          : "House created successfully",
        error: "Failed to save house",
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
            placeholder="House Name"
          />
          <TextField
            control={form.control}
            name="address"
            label="Address"
            placeholder="House Address"
          />
          <TextAreaField
            control={form.control}
            name="description"
            label="Description"
            placeholder="Description"
            optional
          />
          <UploadField
            control={form.control}
            name="image"
            label="Image"
            optional
            description="This image will be shown as the house's cover image"
            className="min-h-96"
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
