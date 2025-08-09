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
import { TextField } from "./fields/text";
import { TextAreaField } from "./fields/text-area";
import { UploadField } from "./fields/upload";

const houseFormSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1),
  address: z.string().optional(),
  description: z.string().optional(),
  imageId: z.string().optional(),
});

type HouseFormProps = {
  preloadedHouse?: Preloaded<typeof api.houses.getById>;
};

export function HouseForm({ preloadedHouse }: HouseFormProps) {
  const house = preloadedHouse ? usePreloadedQuery(preloadedHouse) : null;
  const createOrUpdateMutation = useMutation(api.houses.createOrUpdateHouse);

  const form = useForm<z.infer<typeof houseFormSchema>>({
    resolver: zodResolver(houseFormSchema),
    defaultValues: house
      ? {
          ...house,
        }
      : {
          name: "",
          address: "",
        },
  });

  const isDirty = form.formState.isDirty;
  const isUpdating = !!house;

  const handleSubmit = (data: z.infer<typeof houseFormSchema>) => {
    if (!isDirty) return;

    toast.promise(
      async () => {
        const house = await createOrUpdateMutation({
          ...data,
          _id: data._id as Id<"houses"> | undefined,
          imageId: data.imageId as Id<"_storage"> | undefined,
        });

        form.reset({ ...house });
      },
      {
        loading: isUpdating ? "Updating house..." : "Creating house...",
        success: isUpdating
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
            name="imageId"
            path="/houses/"
            label="Image"
            optional
            description="This image will be shown as the house's cover image"
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
