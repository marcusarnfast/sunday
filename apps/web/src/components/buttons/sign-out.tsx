"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button, type ButtonProps } from "@sunday/ui/components/button";
import { toast } from "@sunday/ui/components/sonner";

type SignOutButtonProps = ButtonProps;

export function SignOutButton({
  variant = "default",
  ...props
}: SignOutButtonProps) {
  const { signOut } = useAuthActions();

  const handleSignOut = async () => {
    toast.promise(signOut(), {
      loading: "Signing out...",
      success: "Signed out successfully",
      error: "Failed to sign out",
    });
  };

  return (
    <Button onClick={handleSignOut} variant={variant} {...props}>
      Sign Out
    </Button>
  );
}
