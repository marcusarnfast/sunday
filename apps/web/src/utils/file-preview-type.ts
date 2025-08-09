"use client";

import mimeDb from "mime-db";

export type FilePreviewType =
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "text"
  | "spreadsheet"
  | "presentation"
  | "archive"
  | "other";

// Pattern-based mapping for preview types
const mimeTypeMap: { pattern: RegExp; type: FilePreviewType }[] = [
  { pattern: /^image\//, type: "image" },
  { pattern: /^video\//, type: "video" },
  { pattern: /^audio\//, type: "audio" },
  { pattern: /^text\//, type: "text" },
  { pattern: /^application\/pdf$/, type: "pdf" },
  { pattern: /^application\/vnd\.ms-excel/, type: "spreadsheet" },
  {
    pattern: /^application\/vnd\.openxmlformats-officedocument\.spreadsheetml/,
    type: "spreadsheet",
  },
  { pattern: /^application\/vnd\.ms-powerpoint/, type: "presentation" },
  {
    pattern: /^application\/vnd\.openxmlformats-officedocument\.presentationml/,
    type: "presentation",
  },
  { pattern: /^application\/zip$/, type: "archive" },
  { pattern: /^application\/x-7z-compressed$/, type: "archive" },
  { pattern: /^application\/x-rar-compressed$/, type: "archive" },
];

export const getFilePreviewType = (mimeType: string): FilePreviewType => {
  // Ensure MIME type exists in mime-db
  const entry = (mimeDb as Record<string, { extensions?: string[] }>)[mimeType];
  if (!entry) return "other";

  // Match against patterns
  for (const { pattern, type } of mimeTypeMap) {
    if (pattern.test(mimeType)) {
      return type;
    }
  }

  return "other";
};
