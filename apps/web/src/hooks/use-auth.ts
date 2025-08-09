"use client";

import { useAuthActions } from "@convex-dev/auth/react";

export function useAuth() {
  const { signIn: convexSignIn, signOut: convexSignOut } = useAuthActions();

  const signIn = async (data: { email: string }) => {
    return convexSignIn("resend-otp", data);
  };

  const signInOtp = async (data: { email: string; code: string }) => {
    return convexSignIn("resend-otp", data);
  };

  const signOut = async () => {
    return convexSignOut();
  };

  return { signIn, signInOtp, signOut };
}
