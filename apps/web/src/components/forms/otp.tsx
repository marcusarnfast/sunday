"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@sunday/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@sunday/ui/components/form";
import { Input } from "@sunday/ui/components/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@sunday/ui/components/input-otp";
import { toast } from "@sunday/ui/components/sonner";
import { LogInIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { useAuth } from "~/hooks/use-auth";

const otpFormSchema = z.object({
  email: z.email(),
  code: z.string().regex(/^\d{6}$/, { message: "Code must be 6 digits" }),
});

type OtpFormProps = {
  email: string | null;
};

export function OtpForm({ email }: OtpFormProps) {
  const { signInOtp } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      email: email || "",
      code: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof otpFormSchema>) => {
    toast.promise(
      async () => {
        try {
          await signInOtp(data);

          router.push("/");
        } catch (error) {
          throw new Error();
        }
      },
      {
        loading: "Verifying code...",
        success: "You are now signed in!",
        error: "Failed to verify code, try again later.",
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem
              data-hidden={!!email}
              className="data-[hidden=true]:hidden"
            >
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Verify code
          <LogInIcon />
        </Button>
      </form>
    </Form>
  );
}
