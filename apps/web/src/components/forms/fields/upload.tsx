"use client";

import type { Id } from "@sunday/monday/data-model";
import { Button, buttonVariants } from "@sunday/ui/components/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@sunday/ui/components/form";
import { Progress } from "@sunday/ui/components/progress";
import { SlidingNumber } from "@sunday/ui/components/sliding-number";
import { toast } from "@sunday/ui/components/sonner";
import { cn } from "@sunday/ui/utils/cn";
import { motion } from "framer-motion";
import {
  CloudUpload,
  CloudUploadIcon,
  FolderSearch2Icon,
  Trash2Icon,
} from "lucide-react";
import { useEffect } from "react";
import {
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { FilePreview } from "~/components/miscellaneous/file-preview";
import { useFileUpload } from "~/hooks/use-file-upload";
import { useStorageUpload } from "~/hooks/use-storage";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  description?: string;
  path?: string;
  accept?: string;
  maxSize?: number;
  className?: string;
  label?: string;
  optional?: boolean;
};

export function UploadField<T extends FieldValues>({
  control,
  description,
  accept = "image/png, image/jpeg, image/webp",
  path = "/",
  maxSize = 5 * 1024 * 1024,
  className,
  name,
  label,
  optional,
}: Props<T>) {
  const { setValue } = useFormContext<T>();
  const storageId = useWatch({ control, name }) as Id<"_storage"> | undefined;

  const { uploadAsync, isPending, progress } = useStorageUpload({
    onSuccess: (data) => {
      setValue(name, data.storageId as PathValue<T, Path<T>>, {
        shouldDirty: true,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [
    { isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize,
    accept,
    multiple: false,
    onFilesChange: (files) => {
      if (files.length > 0) {
        const file = files[0]?.file as File;
        uploadAsync({ file, path });
      }
    },
  });

  const handleRemove = () => {
    setValue(name, undefined as PathValue<T, Path<T>>, { shouldDirty: true });
  };

  const hasImage = Boolean(storageId);

  useEffect(() => {
    if (errors.length > 0) {
      toast.error(errors[0]);
    }
  }, [errors]);

  return (
    <>
      <FormField
        control={control}
        name={name}
        render={() => (
          <FormItem>
            <div className="flex items-center justify-between gap-1">
              <FormLabel>{label}</FormLabel>
              {optional && (
                <span className="text-muted-foreground text-xs font-medium">
                  Optional
                </span>
              )}
            </div>
            <FormControl>
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    openFileDialog();
                  }
                }}
                data-is-dragging={isDragging}
                className={cn(
                  "group relative aspect-[16/9] overflow-hidden",
                  "border border-input rounded-lg shadow-xs transition-[color,box-shadow] duration-200",
                  "data-[is-dragging=true]:has-data-[slot=upload-placeholder]:border-dashed",
                  "data-[is-dragging=true]:border-ring data-[is-dragging=true]:ring-ring/50 data-[is-dragging=true]:ring-[3px]",
                  "focus:outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px]",
                  className,
                )}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => {
                  if (!hasImage && !isDragging && !isPending) {
                    openFileDialog();
                  }
                }}
              >
                <input {...getInputProps()} className="sr-only" tabIndex={-1} />

                {hasImage || isPending ? (
                  <>
                    <FilePreview storageId={storageId} />
                    <HoverOverlay
                      openFileDialog={openFileDialog}
                      handleRemove={handleRemove}
                    />
                    {isPending && <UploadProgress progress={progress} />}
                  </>
                ) : (
                  <UploadPlaceholder />
                )}
              </div>
            </FormControl>
            <FormDescription className="text-xs text-muted-foreground">
              {description}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

type HoverOverlayProps = {
  openFileDialog: () => void;
  handleRemove: () => void;
};

const HoverOverlay = ({ openFileDialog, handleRemove }: HoverOverlayProps) => (
  <>
    <div
      data-slot="hover-overlay"
      className="absolute inset-0 backdrop-brightness-25 opacity-0 group-hover:opacity-100 hidden group-hover:flex transition-opacity duration-200 gap-2 items-center justify-center"
    >
      <Button onClick={openFileDialog} variant="secondary" size="sm">
        <CloudUploadIcon />
        Change file
      </Button>
      <Button onClick={handleRemove} variant="destructive" size="sm">
        <Trash2Icon />
        Remove
      </Button>
    </div>
  </>
);

type UploadProgressProps = {
  progress: number;
};

const UploadProgress = ({ progress }: UploadProgressProps) => (
  <>
    <div
      data-slot="upload-progress"
      className="absolute inset-0 bg-muted flex flex-col gap-4 items-center justify-center"
    >
      <motion.div
        initial={{ y: 0, fontSize: `${16}px` }}
        animate={{ y: 0, fontSize: `${16}px` }}
        transition={{
          ease: [1, 0, 0.35, 0.95],
          duration: 1.5,
          delay: 0.3,
        }}
        className="leading-none text-muted-foreground font-medium"
      >
        <div className="inline-flex items-center gap-1">
          <SlidingNumber value={Number(progress.toFixed(0))} />%
        </div>
      </motion.div>
      <div className="w-2/3">
        <Progress
          value={progress}
          className="h-1  [&_[data-slot=progress-indicator]]:bg-muted-foreground  bg-muted-foreground/20"
        />
      </div>
    </div>
  </>
);

function UploadPlaceholder() {
  return (
    <>
      <div
        data-slot="upload-placeholder"
        className="absolute inset-0 bg-background flex flex-col gap-2 items-center justify-center hover:bg-muted"
      >
        <CloudUpload className="size-8 text-muted-foreground" />
        <p className="text-foreground font-medium">Upload file</p>
        <p className="text-sm text-muted-foreground font-medium">
          Drag and drop a file here, or click to browse
        </p>
        <div className={buttonVariants({ variant: "outline", size: "sm" })}>
          <FolderSearch2Icon />
          Browse Files
        </div>
      </div>
    </>
  );
}
