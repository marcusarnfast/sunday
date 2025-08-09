"use client";

import { api } from "@sunday/monday/api";
import type { Id } from "@sunday/monday/data-model";
import { useQuery } from "convex/react";
import { FileWarningIcon, Loader2Icon } from "lucide-react";
import { getFilePreviewType } from "~/utils/file-preview-type";
import { Image } from "./image";

type FilePreviewProps = {
  storageId?: Id<"_storage">;
};

export function FilePreview({ storageId }: FilePreviewProps) {
  const fileData = useQuery(
    api.storage.getById,
    storageId ? { storageId } : "skip",
  );

  if (!storageId) {
    return null;
  }

  if (!fileData) {
    return <Loading />;
  }

  const { url, fileType, fileName } = fileData;
  const type = getFilePreviewType(fileType);

  switch (type) {
    case "image":
      return <Image src={url} alt={fileName} className="object-cover" />;
    default:
      return <NotSupported />;
  }
}

const Loading = () => (
  <>
    <div className="absolute inset-0 bg-muted flex items-center justify-center">
      <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
    </div>
  </>
);

const NotSupported = () => (
  <>
    <div className="absolute inset-0 bg-muted flex items-center justify-center gap-2">
      <FileWarningIcon className="size-4 text-muted-foreground" />
      <p className="text-sm text-muted-foreground font-medium">
        This file type is not supported in preview.
      </p>
    </div>
  </>
);
