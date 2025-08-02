"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@sunday/ui/components/form";
import { cn } from "@sunday/ui/utils/cn";
import { AlertCircleIcon, ImageUpIcon, XIcon } from "lucide-react";
import { useEffect } from "react";
import {
  type Control,
  type FieldValues,
  type Path,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { Image } from "~/components/miscellaneous/image";
import type { FileMetadata } from "~/hooks/use-file-upload";
import { useFileUpload } from "~/hooks/use-file-upload";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  maxSize?: number;
  accept?: string;
  description?: string;
  optional?: boolean;
  className?: string;
};

export function UploadField<T extends FieldValues>({
  control,
  name,
  label,
  maxSize = 5 * 1024 * 1024,
  accept = "image/*",
  description,
  optional = false,
  className,
}: Props<T>) {
  const { setValue } = useFormContext<T>();
  const file = useWatch({ control, name }) as File | FileMetadata | null;

  const [state, actions] = useFileUpload({
    accept,
    multiple: false,
    maxSize,
    initialFiles: file && !(file instanceof File) ? [file] : [],
    onFilesChange: ([first]) => {
    },
  });

  const { files, errors, isDragging } = state;
  const {
    getInputProps,
    openFileDialog,
    removeFile,
    handleDrop,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
  } = actions;

  const previewUrl = files[0]?.preview;

  useEffect(() => {
    const currentFile = files[0]?.file ?? null;

    // Avoid setting the same value again
    if (currentFile !== file) {
      setValue(name, currentFile as T[typeof name], { shouldDirty: true });
    }
  }, [files]);


  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <div className="flex items-center justify-between gap-1">
            <FormLabel>{label}</FormLabel>
            {optional && <span className="text-muted-foreground text-xs font-medium">Optional</span>}
          </div>
          <FormControl>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <div
                  role="button"
                  onClick={openFileDialog}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  data-dragging={isDragging || undefined}
                  className={cn("border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]", className)}
                >
                  <input
                    {...getInputProps()}
                    className="sr-only"
                    aria-label="Upload billede"
                  />

                  {previewUrl ? (
                    <div className="absolute inset-0">
                      <Image
                        src={previewUrl}
                        alt="Uploaded"
                        fill
                        className="size-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                      <div className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border">
                        <ImageUpIcon className="size-4 opacity-60" />
                      </div>
                      <p className="mb-1.5 text-sm font-medium">
                        Drag an image or click to select
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Max size: 5MB
                      </p>
                    </div>
                  )}
                </div>

                {previewUrl && (
                  <div className="absolute top-4 right-4">
                    <button
                      type="button"
                      className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 focus-visible:ring-[3px]"
                      onClick={() => {
                        removeFile(files[0]?.id ?? "");
                        setValue(name, null as T[typeof name], {
                          shouldDirty: true,
                        });
                      }}
                      aria-label="Remove image"
                    >
                      <XIcon className="size-4" />
                    </button>
                  </div>
                )}
              </div>

              {errors.length > 0 && (
                <div
                  className="text-destructive flex items-center gap-1 text-xs"
                  role="alert"
                >
                  <AlertCircleIcon className="size-3 shrink-0" />
                  <span>{errors[0]}</span>
                </div>
              )}
            </div>
          </FormControl>
          {description && (
            <FormDescription className="text-muted-foreground text-xs">
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
