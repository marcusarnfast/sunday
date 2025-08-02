import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink } from "@sunday/ui/components/breadcrumb";
import Link from "next/link";

export default function Page() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}