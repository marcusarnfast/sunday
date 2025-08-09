import type { Id } from "@sunday/monday/data-model";
import { Button } from "@sunday/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@sunday/ui/components/dialog";
import { UserRoundPlusIcon } from "lucide-react";
import { InviteMemberForm } from "../forms/invite-member";

type InviteMemberFormProps = {
  houseId?: Id<"houses">;
};

export function InviteMemberDialog({ houseId }: InviteMemberFormProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Invite member <UserRoundPlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
          <DialogDescription>
            Invite a new member to your house.
          </DialogDescription>
        </DialogHeader>
        <InviteMemberForm houseId={houseId} />
      </DialogContent>
    </Dialog>
  );
}
