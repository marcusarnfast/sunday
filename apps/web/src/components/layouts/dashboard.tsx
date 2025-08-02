"use client";

import { Separator } from "@sunday/ui/components/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@sunday/ui/components/sidebar";
import {
  CalendarIcon,
  HomeIcon,
  LifeBuoyIcon,
  MailboxIcon,
  MapPinHouseIcon,
  UserRoundIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "../miscellaneous/logo";
import { UserSidebarMenu } from "../miscellaneous/user-menu";

type DashboardLayoutProps = {
  children: React.ReactNode;
  breadcrumbs: React.ReactNode;
};

export function DashboardLayout({
  children,
  breadcrumbs,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider data-layout="dashboard">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 hidden md:block"
            />
            {breadcrumbs}
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Houses",
    url: "/houses",
    icon: MapPinHouseIcon,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: CalendarIcon,
  },
  {
    title: "Inbox",
    url: "/inbox",
    icon: MailboxIcon,
  },
  {
    title: "Support",
    url: "/support",
    icon: LifeBuoyIcon,
  },
  {
    title: "Account",
    url: "/account",
    icon: UserRoundIcon,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <Link href="/" className="flex items-start p-2">
          <Logo className="h-8 w-auto text-primary-foreground" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => {
                      router.push(item.url);
                    }}
                    onMouseEnter={() => {
                      router.prefetch(item.url);
                    }}
                    isActive={item.url === "/" ? pathname === "/" : pathname.includes(item.url)}
                    className="data-[state=active]:bg-primary/10"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserSidebarMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
