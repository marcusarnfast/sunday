"use client";

import type { api } from "@sunday/monday/api";
import { Container } from "@sunday/ui/components/container";
import { Tabs, TabsContent } from "@sunday/ui/components/tabs";
import type { Preloaded } from "convex/react";
import { useAccountParams } from "~/hooks/use-account-params";
import { AccountForm } from "../forms/account";
import { PreferencesForm } from "../forms/preferences";
import {
  TabHeader,
  TabHeaderDescription,
  TabHeaderTitle,
} from "../miscellaneous/tabs-header";

type AccountTabsProps = {
  preloadedUser: Preloaded<typeof api.users.getUser>;
  preloadedPreferences: Preloaded<typeof api.preferences.getByUserId>;
};

export function AccountTabs({
  preloadedUser,
  preloadedPreferences,
}: AccountTabsProps) {
  const { params } = useAccountParams();
  const { tab } = params;

  return (
    <Tabs value={tab}>
      <Container>
        <TabsContent value="account">
          <TabHeader>
            <TabHeaderTitle>Edit account information</TabHeaderTitle>
            <TabHeaderDescription>
              Here you can edit your account information.
            </TabHeaderDescription>
          </TabHeader>

          <AccountForm preloadedUser={preloadedUser} />
        </TabsContent>
        <TabsContent value="preferences">
          <TabHeader>
            <TabHeaderTitle>Manage preferences</TabHeaderTitle>
            <TabHeaderDescription>
              Here you can manage your preferences.
            </TabHeaderDescription>
          </TabHeader>
          <PreferencesForm preloadedPreferences={preloadedPreferences} />
        </TabsContent>
      </Container>
    </Tabs>
  );
}
