import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@sunday/monday/api";
import type { Id } from "@sunday/monday/data-model";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@sunday/ui/components/breadcrumb";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import Link from "next/link";
import { HouseHeader } from "~/components/headers/house";
import { HouseTabs } from "~/components/tabs/house";

type Props = {
  params: Promise<{ houseId: Id<"houses"> }>;
};

export default async function Page({ params }: Props) {
  const { houseId } = await params;
  const token = await convexAuthNextjsToken();


  const data = await fetchQuery(
    api.houses.getById,
    {
      id: houseId,
    },
    {
      token,
    },
  );

  if (!data) {
    return null;
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink asChild>
              <Link href="/houses">Houses</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink asChild>
              <Link href={`/houses/${houseId}`}>{data.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
