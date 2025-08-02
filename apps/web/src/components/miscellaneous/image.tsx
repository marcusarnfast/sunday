"use client";

import { BugIcon, ImageIcon, Loader2Icon } from "lucide-react";
import NextImage from "next/image";
import { type ComponentProps, useState } from "react";

type ImageProps = ComponentProps<typeof NextImage>;

export function Image({ src, alt, ...props }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <div className="relative size-full">
      <NextImage
        src={src}
        alt={alt}
        {...props}
        fill
        onLoad={() => setIsLoading(false)}
        onError={() => setIsError(true)}
      />
      {isError && <ImageError />}
      {isLoading && <ImageLoading />}
    </div>
  );
}

export function ImageLoading() {
  return (
    <div className="absolute inset-0 bg-muted flex items-center justify-center">
      <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
    </div>
  );
}

export function ImageError() {
  return (
    <div className="absolute inset-0 bg-muted flex items-center justify-center">
      <BugIcon className="size-4 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Error loading image</p>
    </div>
  );
}

