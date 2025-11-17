"use client";

import type { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { api } from "@sunday/monday/api";
import type { Id } from "@sunday/monday/data-model";

import {
  DataGrid,
  DataGridContainer,
  DataGridTableDndRows,
} from "@sunday/ui/components/data-grid";
import { ScrollArea, ScrollBar } from "@sunday/ui/components/scroll-area";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMutation, useQuery } from "convex/react";
import { generateKeyBetween } from "fractional-indexing";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { columns, type RowData } from "./columns";

export function HouseTasksTable() {
  const { houseId } = useParams<{ houseId: string }>();
  const [displayTasks, setDisplayTasks] = useState<RowData[]>([]);

  // Fetch tasks (already sorted by sortOrder in server query)
  const tasks = useQuery(api.tasks.getTasksByHouseId, {
    houseId: houseId as Id<"houses">,
  });

  const updateTask = useMutation(api.tasks.updateTask).withOptimisticUpdate(
    (localStore, args) => {
      if (!args.id || !args.sortOrder || !args.houseId) return;

      const currentTasks = localStore.getQuery(api.tasks.getTasksByHouseId, {
        houseId: args.houseId,
      });
      if (!currentTasks) return;

      const task = currentTasks.find((t) => t._id === args.id);
      if (task?.sortOrder === args.sortOrder) return; // ✅ no change, skip

      const updated = currentTasks.map((t) =>
        t._id === args.id ? { ...t, sortOrder: args.sortOrder } : t
      );

      updated.sort((a, b) => a.sortOrder?.localeCompare(b.sortOrder ?? "") ?? 0);

      localStore.setQuery(
        api.tasks.getTasksByHouseId,
        { houseId: args.houseId },
        updated
      );
    }
  );

  // Stable list of IDs for DnD
  const dataIds = useMemo(() => displayTasks.map((t) => t._id), [displayTasks]);

  // Sync local state when tasks change from server
  useEffect(() => {
    if (tasks) setDisplayTasks(tasks);
  }, [tasks]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    setDisplayTasks((prev) => {
      const oldIndex = prev.findIndex((t) => t._id === active.id);
      const newIndex = prev.findIndex((t) => t._id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);

      let before = reordered[newIndex - 1]?.sortOrder ?? null;
      let after = reordered[newIndex + 1]?.sortOrder ?? null;

      if (before === undefined) before = null;
      if (after === undefined) after = null;

      const newSortOrder =
        before === null && after === null
          ? generateKeyBetween(null, null)
          : generateKeyBetween(before, after);

      updateTask({
        id: active.id as Id<"tasks">,
        sortOrder: newSortOrder,
        houseId: houseId as Id<"houses">,
      });

      return reordered;
    });
  }, [houseId, updateTask]);

  // React Table setup
  const table = useReactTable({
    columns: columns(),
    data: displayTasks,
    getRowId: (row: RowData) => row._id,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (!tasks) return <div>Loading...</div>;

  return (
    <DataGrid
      table={table}
      recordCount={tasks.length}
      tableLayout={{
        columnsVisibility: true,
        headerBackground: false,
        headerBorder: false,
        rowBorder: false,
        rowRounded: true,
      }}
    >
      <div className="w-full space-y-2.5">
        <DataGridContainer border={false}>
          <ScrollArea>
            <DataGridTableDndRows
              handleDragEnd={handleDragEnd}
              dataIds={dataIds}
            />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </DataGridContainer>
      </div>
    </DataGrid>
  );
}