import { Button } from "@sunday/ui/components/button";
import {
  Header,
  HeaderContent,
  HeaderDescription,
  HeaderTitle,
} from "@sunday/ui/components/header";
import { HousePlusIcon } from "lucide-react";
import Link from "next/link";

export function HousesHeader() {
  return (
    <Header>
      <HeaderContent className="flex justify-between items-center">
        <div>
          <HeaderTitle>Houses</HeaderTitle>
          <HeaderDescription>Manage your houses</HeaderDescription>
        </div>
        <div>
          <Button asChild>
            <Link href="/houses/create">
              Create house
              <HousePlusIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </HeaderContent>
    </Header>
  );
}
