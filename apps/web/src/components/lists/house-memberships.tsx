"use client";

import type { api } from "@sunday/monday/api";
import { Button } from "@sunday/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@sunday/ui/components/table";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { EllipsisVerticalIcon } from "lucide-react";

type HouseMembershipsListProps = {
  preloadedMemberships: Preloaded<typeof api.memberships.getHouseMemberships>;
};

export function HouseMembershipsList({
  preloadedMemberships,
}: HouseMembershipsListProps) {
  const memberships = usePreloadedQuery(preloadedMemberships);

  return (
    <div className="bg-background overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memberships.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <p className="font-medium">{item.email}</p>
              </TableCell>
              <TableCell>{item.role}</TableCell>
              <TableCell>{item.role}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <EllipsisVerticalIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
