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
import { fetchQuery } from "convex/nextjs";
import Link from "next/link";
import { getTitle } from "~/utils/notification-title";

type Props = {
  params: Promise<{ notificationId: Id<"notifications"> }>;
};

export default async function Page({ params }: Props) {
  const { notificationId } = await params;
  const token = await convexAuthNextjsToken();

  const data = await fetchQuery(
    api.notifications.getById,
    {
      id: notificationId,
    },
    {
      token,
    },
  );

  if (!data) {
    return null;
  }

  const title = getTitle(data.type);

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
              <Link href="/inbox">Inbox</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink asChild>
              <Link href={`/inbox/${notificationId}`}>{title}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
