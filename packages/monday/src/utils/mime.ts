import mimeDb from "mime-db";

export const mimeToExtension = (mimeType: string): string | null => {
  return (
    (mimeDb as Record<string, { extensions?: string[] }>)[mimeType]
      ?.extensions?.[0] ?? null
  );
};
