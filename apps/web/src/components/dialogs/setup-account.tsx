import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@sunday/monday/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@sunday/ui/components/dialog";
import { preloadQuery } from "convex/nextjs";
import { AccountForm } from "../forms/account";

export async function SetupAccountDialog() {
  const token = await convexAuthNextjsToken();

  const preloadedUser = await preloadQuery(
    api.users.getUser,
    {},
    {
      token,
    },
  );

  return (
    <Dialog open={true}>
      <DialogContent className="*:data-[slot=dialog-close]:hidden">
        <DialogHeader>
          <DialogTitle>Setup your account</DialogTitle>
          <DialogDescription>
            Enter your name and upload a profile picture to get started.
          </DialogDescription>
        </DialogHeader>
        <AccountForm preloadedUser={preloadedUser} />
      </DialogContent>
    </Dialog>
  );
}
