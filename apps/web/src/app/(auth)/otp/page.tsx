import { SearchParams } from "nuqs/server";
import { OtpForm } from "~/components/forms/otp";
import { loadOtpParams } from "~/hooks/use-otp-params";

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function Page({ searchParams }: Props) {
  const { email } = await loadOtpParams(searchParams);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold">
          Enter your one-time code
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Check your email and enter the code to continue.
        </p>
      </div>
      <OtpForm email={email} />
    </div>
  )

}