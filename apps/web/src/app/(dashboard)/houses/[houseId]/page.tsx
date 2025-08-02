import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@sunday/monday/api";
import type { Id } from "@sunday/monday/data-model";
import { preloadQuery } from "convex/nextjs";
import { HouseHeader } from "~/components/headers/house";
import { HouseTabs } from "~/components/tabs/house";

type Props = {
  params: Promise<{ houseId: Id<"houses"> }>;
};

export default async function Page({ params }: Props) {
  const { houseId } = await params;
  const token = await convexAuthNextjsToken();

  const [preloadedHouse, preloadedMemberships] = await Promise.all([
    preloadQuery(
      api.houses.getById,
      {
        id: houseId,
      },
      {
        token,
      },
    ),
    preloadQuery(
      api.memberships.getHouseMemberships,
      {
        houseId,
      },
      { token },
    ),
  ]);

  return (
    <>
      <HouseHeader preloadedHouse={preloadedHouse} />
      <HouseTabs
        houseId={houseId}
        preloadedHouse={preloadedHouse}
        preloadedMemberships={preloadedMemberships}
      />
    </>
  );
}
