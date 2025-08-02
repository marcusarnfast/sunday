"use client";

import type { api } from "@sunday/monday/api";
import { Button } from "@sunday/ui/components/button";
import {
  Header,
  HeaderContent,
  HeaderDescription,
  HeaderTitle,
} from "@sunday/ui/components/header";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { CalendarDaysIcon, HouseIcon, ListCheckIcon, Settings2Icon, UsersRoundIcon } from "lucide-react";
import { useHouseParams } from "~/hooks/use-house-params";

type HouseHeaderProps = {
  preloadedHouse: Preloaded<typeof api.houses.getById>;
};

const tabs = [
  {
    label: "Overview",
    value: "overview",
    icon: HouseIcon,
  },
  {
    label: "Calendar",
    value: "calendar",
    icon: CalendarDaysIcon,
  },
  {
    label: "Tasks",
    value: "tasks",
    icon: ListCheckIcon,
  },
  {
    label: "Members",
    value: "members",
    icon: UsersRoundIcon,
  },
  {
    label: "Edit",
    value: "edit",
    icon: Settings2Icon,
  },
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
          <div>
            {/* <Button asChild>
              <Link href={`/houses/${house._id}/edit`}>
                Edit House
                <Settings2Icon className="size-4" />
              </Link>
            </Button> */}
          </div>
        </div>

        <div className="w-full text-foreground">
          {tabs.map((tab) => (
            <Button
              key={tab.value}
              data-state={params.tab === tab.value ? "active" : "inactive"}
              onClick={() => setParams({ tab: tab.value })}
              size="sm"
              variant="ghost"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-[1px] after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <tab.icon
                className="- opacity-60"
                size={16}
                aria-hidden="true"
              />
              {tab.label}
            </Button>
          ))}
        </div>
      </HeaderContent>
    </Header>
  );
}
