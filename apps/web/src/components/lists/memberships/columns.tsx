import type { api } from "@sunday/monday/api";
import { Badge } from "@sunday/ui/components/badge";
import {
  DataGridColumnHeader,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from "@sunday/ui/components/data-grid";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { RowActions } from "./row-actions";

export type RowData = NonNullable<
  typeof api.memberships.getHouseMemberships._returnType
>[number];

export const columns: ColumnDef<RowData>[] = [
  {
    accessorKey: "id",
    id: "id",
    header: () => <DataGridTableRowSelectAll size="sm" />,
    cell: ({ row }) => <DataGridTableRowSelect row={row} />,
    enableSorting: false,
    size: 35,
    meta: {
      headerClassName: "",
      cellClassName: "",
    },
    enableResizing: false,
  },
  {
    accessorKey: "email",
    id: "email",
    header: ({ column }) => (
      <DataGridColumnHeader title="Email" visibility={true} column={column} />
    ),
    cell: (info) => (
      <Link
        href={`mailto:${info.getValue()}`}
        className="hover:text-primary hover:underline"
      >
        {info.getValue() as string}
      </Link>
    ),
    size: 150,
    enableSorting: true,
    enableHiding: true,
    enableResizing: true,
  },
  {
    accessorKey: "role",
    id: "role",
    header: ({ column }) => (
      <DataGridColumnHeader title="Role" visibility={true} column={column} />
    ),
    cell: (info) => (
      <Badge variant="outline" className="capitalize">
        {info.getValue() as string}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <RowActions row={row} />,
    size: 60,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
  },
];
