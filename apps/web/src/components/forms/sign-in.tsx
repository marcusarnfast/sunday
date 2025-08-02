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
import { toast } from "@sunday/ui/components/sonner";
import { SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { useAuth } from "~/hooks/use-auth";

const signInFormSchema = z.object({
  email: z.email(),
});

export function SignInForm() {
  const { signIn } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof signInFormSchema>) => {
    toast.promise(
      async () => {
        try {
          await signIn(data);

          router.push(`/otp?email=${data.email}`);
        } catch (error) {
          throw new Error();
        }
      },
      {
        loading: "Sending code...",
        success: "Check your email for a code to sign in!",
        error: "Failed to send code, try again later.",
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
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Send code
          <SendIcon />
        </Button>
      </form>
    </Form>
  );
}
