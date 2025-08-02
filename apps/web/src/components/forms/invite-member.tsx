"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@sunday/monday/api";
import type { Id } from "@sunday/monday/data-model";
import { Button } from "@sunday/ui/components/button";
import { Form } from "@sunday/ui/components/form";
import { toast } from "@sunday/ui/components/sonner";
import { useAction } from "convex/react";
import { UserRoundPlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod/v4";
import { SelectorField } from "./fields/selector";
import { TextField } from "./fields/text";

const inviteMemberFormSchema = z.object({
  email: z.email(),
  role: z.enum(["admin", "member"]),
});

type InviteMemberFormProps = {
  houseId?: Id<"houses">;
};

export function InviteMemberForm({ houseId }: InviteMemberFormProps) {
  const inviteMemberAction = useAction(api.actions.inviteHouseMember);

  const form = useForm<z.infer<typeof inviteMemberFormSchema>>({
    resolver: zodResolver(inviteMemberFormSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  const isDirty = form.formState.isDirty;

  const handleSubmit = (data: z.infer<typeof inviteMemberFormSchema>) => {
    if (!isDirty) return;

    toast.promise(
      async () => {
        await inviteMemberAction({
          email: data.email,
          role: data.role as "member" | "moderator",
          houseId: houseId as Id<"houses">,
        });
      },
      {
        loading: "Inviting member...",
        success: "Member invited successfully",
        error: "Failed to invite member",
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
            name="email"
            label="Email"
            placeholder="Email"
          />
          <SelectorField
            control={form.control}
            name="role"
            label="Role"
            placeholder="Role"
            options={[
              { label: "Member", value: "member" },
              { label: "Moderator", value: "moderator" },
            ]}
          />

          <div className="flex justify-end">
            <Button type="submit" form="form" disabled={!isDirty}>
              Invite member <UserRoundPlusIcon />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
