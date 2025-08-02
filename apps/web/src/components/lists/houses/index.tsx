"use client";

import type { api } from "@sunday/monday/api";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { HouseCard } from "./card";
import { EmptyState } from "./empty-state";

type HouseListProps = {
  preloadedHouses: Preloaded<typeof api.houses.getUserHouses>;
};

export function HousesList({ preloadedHouses }: HouseListProps) {
  const houses = usePreloadedQuery(preloadedHouses);

  if (houses.length === 0)
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <EmptyState />
      </div>
    );

  return (
    <div className="grid grid-cols-1 @sm/main:grid-cols-2 @2xl/main:grid-cols-3 @6xl/main:grid-cols-4 gap-4">
      {houses.map((house) => (
        <HouseCard key={house._id} {...house} />
      ))}
    </div>
  );
}
