import { Button } from "@sunday/ui/components/button";
import { HousePlusIcon } from "lucide-react";
import Link from "next/link";

export function EmptyState() {
  return (
    <div className="flex flex-col gap-6 items-center justify-center max-w-sm text-center py-12">
      <div className="flex flex-col gap-2">
        <p className="text-foreground font-bold text-2xl">
          You don't have any houses yet.
        </p>
        <p className="text-sm text-muted-foreground">
          Get started by creating a new house or get your friends to invite you to their house.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Button asChild>
          <Link href="/houses/create">
            Get started
            <HousePlusIcon className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}