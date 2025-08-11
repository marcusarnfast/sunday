import type { api } from "@sunday/monday/api";
import { Button } from "@sunday/ui/components/button";
import { Card, CardFooter, CardHeader, CardHeading, CardTable, CardToolbar } from "@sunday/ui/components/card";
import {
  DataGrid,
  DataGridPagination,
  DataGridTable,
} from "@sunday/ui/components/data-grid";
import { Input } from "@sunday/ui/components/input";
import { ScrollArea, ScrollBar } from "@sunday/ui/components/scroll-area";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { Search, UserRoundPlus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { columns, type RowData } from "./columns";

type HouseMembershipsTableProps = {
  preloadedMemberships: Preloaded<typeof api.memberships.getHouseMemberships>;
};

export function HouseMembershipsTable({
  preloadedMemberships,
}: HouseMembershipsTableProps) {
  const memberships = usePreloadedQuery(preloadedMemberships);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "email", desc: true },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    return memberships.filter((item) => {
      // Filter by search query (case-insensitive)
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        Object.values(item)
          .join(" ") // Combine all fields into a single string
          .toLowerCase()
          .includes(searchLower);

      return matchesSearch;
    });
  }, [searchQuery]);

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string),
  );

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
    getRowId: (row: RowData) => row.id,
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination,
      sorting,
      columnOrder,
    },
    columnResizeMode: "onChange",
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <DataGrid
      table={table}
      recordCount={filteredData?.length || 0}
      tableLayout={{
        columnsPinnable: true,
        columnsResizable: true,
        columnsMovable: true,
        columnsVisibility: true,
      }}
    >
      <Card>
        <CardHeader className="py-4">
          <CardHeading >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-9 w-40"
                />
                {searchQuery.length > 0 && (
                  <Button
                    mode="icon"
                    variant="ghost"
                    className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => setSearchQuery("")}
                  >
                    <X />
                  </Button>
                )}
              </div>
            </div>
          </CardHeading>

        </CardHeader>
        <CardTable>
          <ScrollArea>
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
        <CardFooter>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
