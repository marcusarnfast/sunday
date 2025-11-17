"use client";

import type { api } from "@sunday/monday/api";
import type { Id } from "@sunday/monday/data-model";
import { Container } from "@sunday/ui/components/container";
import { Tabs, TabsContent } from "@sunday/ui/components/tabs";
import type { Preloaded } from "convex/react";
import { useHouseParams } from "~/hooks/use-house-params";
import { InviteMemberDialog } from "../dialogs/invite-member";
import { HouseForm } from "../forms/house";
import { TaskForm } from "../forms/task";
import HouseCalendar from "../house-calendar";
import HouseTodo from "../house-todo";
import { HouseMembershipsTable } from "../lists/memberships/table";
import TasksList from "../lists/tasks";
import { HouseTasksTable } from "../lists/tasks/table";
import {
  TabHeader,
  TabHeaderActions,
  TabHeaderDescription,
  TabHeaderTitle,
} from "../miscellaneous/tabs-header";

type HouseTabsProps = {
  houseId: Id<"houses">;
  preloadedHouse: Preloaded<typeof api.houses.getById>;
  preloadedMemberships: Preloaded<typeof api.memberships.getHouseMemberships>;
  preloadedTasks: Preloaded<typeof api.tasks.getTasksByHouseId>;
};

export function HouseTabs({
  houseId,
  preloadedHouse,
  preloadedMemberships,
  preloadedTasks,
}: HouseTabsProps) {
  const { params } = useHouseParams();
  const { tab } = params;
  return (
    <Tabs value={tab}>
      <Container>
        <TabsContent value="overview">
          <TabHeader>
            <TabHeaderTitle>Overview</TabHeaderTitle>
            <TabHeaderDescription>
              View and manage bookings for your house.
            </TabHeaderDescription>
          </TabHeader>
        </TabsContent>
        <TabsContent value="calendar">
          <TabHeader>
            <TabHeaderTitle>Calendar</TabHeaderTitle>
            <TabHeaderDescription>
              View and manage bookings for your house.
            </TabHeaderDescription>
          </TabHeader>
          <HouseCalendar />
        </TabsContent>
        <TabsContent value="tasks">
          <TabHeader>
            <TabHeaderTitle>Tasks</TabHeaderTitle>
            <TabHeaderDescription>
              View and manage tasks for your house.
            </TabHeaderDescription>
          </TabHeader>
          <TaskForm />
          <TasksList />
        </TabsContent>
        <TabsContent value="members">
          <TabHeader>
            <div>
              <TabHeaderTitle>Members</TabHeaderTitle>
              <TabHeaderDescription>
                Invite new members to your house or manage existing memberships.
              </TabHeaderDescription>
            </div>
            <TabHeaderActions>
              <InviteMemberDialog houseId={houseId} />
            </TabHeaderActions>
          </TabHeader>
          <HouseMembershipsTable preloadedMemberships={preloadedMemberships} />
        </TabsContent>
        <TabsContent value="edit">
          <TabHeader>
            <TabHeaderTitle>Edit house</TabHeaderTitle>
            <TabHeaderDescription>
              Edit the details of your house.
            </TabHeaderDescription>
          </TabHeader>
          <HouseForm preloadedHouse={preloadedHouse} />
        </TabsContent>
      </Container>
    </Tabs>
  );
}
