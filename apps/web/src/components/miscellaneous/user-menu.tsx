"use client";

import { api } from "@sunday/monday/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@sunday/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@sunday/ui/components/sidebar";
import { useQuery } from "convex/react";
import {
  EllipsisVerticalIcon,
  LogOutIcon,
  MailboxIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "~/hooks/use-auth";
import { Image } from "./image";

export function UserSidebarMenu() {
  const user = useQuery(api.users.getUser);
  const { signOut } = useAuth();
  const image = useQuery(
    api.storage.getById,
    user?.imageId ? { storageId: user.imageId } : "skip",
  );

  if (!user) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="size-8 rounded-lg bg-background overflow-hidden">
                {image ? (
                  <Image
                    src={image.url}
                    alt={user.name ?? ""}
                    className="object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground flex items-center justify-center size-full">
                    {user.name?.charAt(0) ?? ""}
                  </div>
                )}
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="top"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="size-8 rounded-lg bg-background overflow-hidden">
                  {image ? (
                    <Image src={image.url} alt={user.name ?? ""} />
                  ) : (
                    <div className="text-muted-foreground flex items-center justify-center size-full">
                      {user.name?.charAt(0) ?? ""}
                    </div>
                  )}
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/inbox">
                  <MailboxIcon />
                  Inbox
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account">
                  <SettingsIcon />
                  Account
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
