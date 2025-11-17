"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@sunday/monday/api";
import type { Id } from "@sunday/monday/data-model";
import { Button } from "@sunday/ui/components/button";
import { Form } from "@sunday/ui/components/form";
import { toast } from "@sunday/ui/components/sonner";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";
import z from "zod/v4";
import { TextField } from "./fields/text";

const taskFormSchema = z.object({
  title: z.string().min(1),
});

export function TaskForm() {
  const { houseId } = useParams<{ houseId: string }>();
  const createTask = useMutation(api.tasks.createTask);

  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
    },
  });

  const isDirty = form.formState.isDirty;

  const handleSubmit = (data: z.infer<typeof taskFormSchema>) => {
    if (!isDirty) return;

    toast.promise(
      async () => {
        await createTask({
          ...data,
          houseId: houseId as Id<"houses">,
        });

        form.reset({ title: "" });
      },
      {
        loading: "Creating task...",
        success: "Task created successfully",
        error: "Failed to save task",
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
            name="title"
            label="Title"
            placeholder="Task"
          />

          <div className="flex justify-end">
            <Button type="submit" form="form" disabled={!isDirty}>
              Add
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
