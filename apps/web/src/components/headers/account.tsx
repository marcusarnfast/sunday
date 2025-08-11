"use client";

import {
  Header,
  HeaderContent,
  HeaderDescription,
  HeaderTitle,
} from "@sunday/ui/components/header";
import { Settings2Icon, UserRoundIcon } from "lucide-react";
import { useAccountParams } from "~/hooks/use-account-params";
import { HeaderTabsNav } from "../miscellaneous/header-tabs-nav";

const tabs = [
  { label: "Account", value: "account", icon: UserRoundIcon },
  { label: "Preferences", value: "preferences", icon: Settings2Icon },
] as const;

export function AccountHeader() {
  const {
    params: { tab },
    setParams,
  } = useAccountParams();

  return (
    <Header>
      <HeaderContent className="!pb-0 space-y-4">
        <div>
          <HeaderTitle>Account</HeaderTitle>
          <HeaderDescription>Manage your account</HeaderDescription>
        </div>
        <HeaderTabsNav
          tabs={tabs}
          value={tab}
          onChange={(tab) => setParams({ tab })}
        />
      </HeaderContent>
    </Header>
  );
}
