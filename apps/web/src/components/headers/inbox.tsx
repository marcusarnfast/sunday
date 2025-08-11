"use client";

import {
  Header,
  HeaderContent,
  HeaderDescription,
  HeaderTitle,
} from "@sunday/ui/components/header";
import { MailIcon, MailOpenIcon, MailsIcon } from "lucide-react";
import { HeaderTabsNav } from "~/components/miscellaneous/header-tabs-nav";
import { useInboxParams } from "~/hooks/use-inbox-params";

const tabs = [
  { label: "All", value: "all", icon: MailsIcon },
  { label: "Unread", value: "unread", icon: MailIcon },
  { label: "Read", value: "read", icon: MailOpenIcon },
] as const;

export function InboxHeader() {
  const {
    params: { status },
    setParams,
  } = useInboxParams();

  return (
    <Header>
      <HeaderContent className="!pb-0 space-y-4">
        <div>
          <HeaderTitle>Inbox</HeaderTitle>
          <HeaderDescription>Manage your inbox</HeaderDescription>
        </div>

        <HeaderTabsNav
          tabs={tabs}
          value={status}
          onChange={(status) => setParams({ status }, { shallow: false })}
        />
      </HeaderContent>
    </Header>
  );
}
