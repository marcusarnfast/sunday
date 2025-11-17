"use client";

import { api } from "@sunday/monday/api";
import type { Id } from "@sunday/monday/data-model";
import { Badge } from "@sunday/ui/components/badge";
import { Button } from "@sunday/ui/components/button";
import { DataGridTableDndRowHandle } from "@sunday/ui/components/data-grid";
import { Input } from "@sunday/ui/components/input";
import type { ColumnDef } from "@tanstack/react-table";
import { useMutation } from "convex/react";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { RowActions } from "./row-actions";

export type RowData = NonNullable<
  typeof api.tasks.getTasksByHouseId._returnType
>[number];

export const columns = (): ColumnDef<RowData>[] => {
  const updateTask = useMutation(api.tasks.updateTask)
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  // Debounced save function (500ms delay)
  const debouncedSave = useDebounceCallback(
    async (taskId: Id<"tasks">, title: string) => {
      if (title.trim()) {
        await updateTask({
          id: taskId,
          title: title.trim(),
        });
      }
    },
    500,
  );

  return [
    {
      id: "drag",
      cell: ({ row }) => <DataGridTableDndRowHandle rowId={row.original._id} />,
      size: 40,
    },
    {
      accessorKey: "title",
      id: "title",
      header: "Title",
      cell: (info) => {
        const task = info.row.original;

        if (isEditing && selectedRow?._id === task._id) {
          return (
            <Input
              autoFocus
              value={editValue}
              onChange={(e) => {
                const value = e.target.value;
                setEditValue(value);
                debouncedSave(task._id, value); // Debounced save while typing
              }}
              onBlur={() => {
                debouncedSave.cancel(); // Cancel pending debounce
                updateTask({ id: task._id, title: editValue.trim() }); // Save instantly
                setIsEditing(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  debouncedSave.cancel();
                  updateTask({ id: task._id, title: editValue.trim() });
                  setIsEditing(false);
                }
                if (e.key === "Escape") {
                  debouncedSave.cancel();
                  setIsEditing(false);
                }
              }}
            />
          );
        }

        return (
          <Button
            type="button"
            variant="ghost"
            mode="input"
            onClick={() => {
              setSelectedRow(task);
              setEditValue(task.title);
              setIsEditing(true);
            }}
          >
            {task.title}
          </Button>
        );
      },
      size: 150,
      enableSorting: true,
    },
    {
      accessorKey: "sortOrder",
      id: "sortOrder",
      header: "Sort",
      cell: (info) => info.getValue() as number,
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "status",
      id: "status",
      header: "Status",
      cell: (info) => (
        <Badge
          variant={info.getValue() === "done" ? "success" : "secondary"}
          className="capitalize"
        >
          {info.getValue() as string}
        </Badge>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "createdAt",
      id: "createdAt",
      header: "Created",
      cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
      enableSorting: true,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <RowActions row={row} />,
      size: 60,
      enableSorting: false,
    },
  ];
};
