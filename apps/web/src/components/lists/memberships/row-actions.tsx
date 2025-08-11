
import { Button } from "@sunday/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@sunday/ui/components/dropdown-menu";
import type { Row } from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import type { RowData } from "./columns";

export function RowActions({ row }: { row: Row<RowData> }) {
  const [_, copy] = useCopyToClipboard()
  const handleCopyId = () => {
    copy(row.original.id);
    const message = `Employee ID successfully copied: ${row.original.id}`;
    toast.success(
      message,
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" mode="icon" variant="ghost">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem onClick={() => { }}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyId}>Copy ID</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => { }}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
