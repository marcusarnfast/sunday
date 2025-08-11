"use client";

import type { api } from "@sunday/monday/api";
import {
  Header,
  HeaderContent,
  HeaderDescription,
  HeaderTitle,
} from "@sunday/ui/components/header";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import {
  CalendarDaysIcon,
  HouseIcon,
  ListCheckIcon,
  Settings2Icon,
  UsersRoundIcon,
} from "lucide-react";
import { HeaderTabsNav } from "~/components/miscellaneous/header-tabs-nav";
import { useHouseParams } from "~/hooks/use-house-params";

type HouseHeaderProps = {
  preloadedHouse: Preloaded<typeof api.houses.getById>;
};

const tabs = [
  { label: "Overview", value: "overview", icon: HouseIcon },
  { label: "Calendar", value: "calendar", icon: CalendarDaysIcon },
  { label: "Tasks", value: "tasks", icon: ListCheckIcon },
  { label: "Members", value: "members", icon: UsersRoundIcon },
  { label: "Edit", value: "edit", icon: Settings2Icon },
] as const;

export function HouseHeader({ preloadedHouse }: HouseHeaderProps) {
  const { params, setParams } = useHouseParams();
  const house = usePreloadedQuery(preloadedHouse);

  if (!house) return null;

  return (
    <Header>
      <HeaderContent className="!pb-0 space-y-4">
        <div className="flex justify-between items-center w-full">
          <div>
            <HeaderTitle>{house.name}</HeaderTitle>
            <HeaderDescription>{house.address}</HeaderDescription>
          </div>
        </div>

        <HeaderTabsNav
          tabs={tabs}
          value={params.tab}
          onChange={(tab) => setParams({ tab })}
        />
      </HeaderContent>
    </Header>
  );
}
