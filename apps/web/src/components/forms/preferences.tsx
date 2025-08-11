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
import { SwitchField } from "./fields/switch";

const preferencesFormSchema = z.object({
  userId: z.string(),
  emailNotifications: z.object({
    invitation: z.boolean(),
    invitationResponse: z.boolean(),
    booking: z.boolean(),
    bookingResponse: z.boolean(),
  }),
});

type PreferencesFormProps = {
  preloadedPreferences: Preloaded<typeof api.preferences.getByUserId>;
};

export function PreferencesForm({
  preloadedPreferences,
}: PreferencesFormProps) {
  const preferences = usePreloadedQuery(preloadedPreferences);
  const updateMutation = useMutation(api.preferences.updatePreferences);

  const form = useForm<z.infer<typeof preferencesFormSchema>>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: preferences
      ? {
          ...preferences,
          emailNotifications: { ...preferences.emailNotifications },
        }
      : {
          emailNotifications: {
            invitation: true,
            invitationResponse: true,
            booking: true,
            bookingResponse: true,
          },
        },
  });

  const isDirty = form.formState.isDirty;

  const handleSubmit = (data: z.infer<typeof preferencesFormSchema>) => {
    if (!isDirty) return;

    toast.promise(
      async () => {
        const preferences = await updateMutation({
          ...data,
          userId: data.userId as Id<"users">,
        });

        form.reset({
          ...preferences,
        });
      },
      {
        loading: "Updating preferences...",
        success: "Preferences updated successfully",
        error: "Failed to save preferences",
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
          <SwitchField
            control={form.control}
            name="emailNotifications.invitation"
            label="Invitation"
            description="Receive an email when someone invites you to a house"
          />
          <SwitchField
            control={form.control}
            name="emailNotifications.invitationResponse"
            label="Invitation Responses"
            description="Receive an email when someone accepts or declines an invitation"
          />
          <SwitchField
            control={form.control}
            name="emailNotifications.booking"
            label="Booking"
            description="Receive an email when someone makes a booking"
          />
          <SwitchField
            control={form.control}
            name="emailNotifications.bookingResponse"
            label="Booking Responses"
            description="Receive an email when someone confirms or declines a booking"
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
