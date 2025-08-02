import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@sunday/monday/api";
import { Container } from "@sunday/ui/components/container";
import { preloadQuery } from "convex/nextjs";
import { HousesHeader } from "~/components/headers/houses";
import { HousesList } from "~/components/lists/houses";

export default async function Page() {
  const token = await convexAuthNextjsToken();
  const preloadedHouses = await preloadQuery(
    api.houses.getUserHouses,
    {},
    {
      token,
    },
  );

  return (
    <>
      <HousesHeader />
      <Container>
        <HousesList preloadedHouses={preloadedHouses} />
      </Container>
    </>
  );
}
