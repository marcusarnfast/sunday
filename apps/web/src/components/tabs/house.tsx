"use client";

import type { api } from "@sunday/monday/api";
import type { Id } from "@sunday/monday/data-model";
import { Container } from "@sunday/ui/components/container";
import { Tabs, TabsContent } from "@sunday/ui/components/tabs";
import type { Preloaded } from "convex/react";
import { useHouseParams } from "~/hooks/use-house-params";
import { InviteMemberDialog } from "../dialogs/invite-member";
import { HouseForm } from "../forms/house";
import { InviteMemberForm } from "../forms/invite-member";
import HouseCalendar from "../house-calendar";
import HouseTodo from "../house-todo";
import { HouseMembershipsList } from "../lists/house-memberships";

type HouseTabsProps = {
  houseId: Id<"houses">;
  preloadedHouse: Preloaded<typeof api.houses.getById>;
  preloadedMemberships: Preloaded<typeof api.memberships.getHouseMemberships>;
};

export function HouseTabs({
  houseId,
  preloadedHouse,
  preloadedMemberships,
}: HouseTabsProps) {
  const { params } = useHouseParams();
  const { tab } = params;
  return (
    <Tabs value={tab}>
      <Container>
        <TabsContent value="overview">
          <div className="flex gap-4 justify-between pb-6">
            <div>
              <h2 className="text-xl font-semibold">Overview</h2>
              <p className="text-sm text-muted-foreground">
                View and manage bookings for your house.
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="calendar">
          <div className="flex gap-4 justify-between pb-6">
            <div>
              <h2 className="text-xl font-semibold">Calendar</h2>
              <p className="text-sm text-muted-foreground">
                View and manage bookings for your house.
              </p>
            </div>
          </div>
          <HouseCalendar />
        </TabsContent>
        <TabsContent value="tasks">
          <div className="flex gap-4 justify-between pb-6">
            <div>
              <h2 className="text-xl font-semibold">Tasks</h2>
              <p className="text-sm text-muted-foreground">
                View and manage tasks for your house.
              </p>
            </div>
          </div>
          <HouseTodo />
        </TabsContent>
        <TabsContent value="members">
          <div className="flex gap-4 justify-between pb-6">
            <div>
              <h2 className="text-xl font-semibold">Members</h2>
              <p className="text-sm text-muted-foreground">
                Invite new members to your house or manage existing memberships.
              </p>
            </div>
            <InviteMemberDialog houseId={houseId} />
          </div>
          <HouseMembershipsList preloadedMemberships={preloadedMemberships} />
        </TabsContent>
        <TabsContent value="edit">
          <div className="flex gap-4 justify-between pb-6">
            <div>
              <h2 className="text-xl font-semibold">Edit house</h2>
              <p className="text-sm text-muted-foreground">
                Edit the details of your house.
              </p>
            </div>
          </div>
          <HouseForm
            houseId={houseId as Id<"houses">}
            preloadedHouse={preloadedHouse}
          />
        </TabsContent>
      </Container>
    </Tabs>
  );
}
