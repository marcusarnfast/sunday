import { SignInForm } from "~/components/forms/sign-in";

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Sign in with a one-time code
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          We'll email you a single-use code to access your account.
        </p>
      </div>
      <SignInForm />
    </div>
  );
}
