import { useAuthToken } from "@convex-dev/auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { env } from "~/env";

const convexSiteUrl = env.NEXT_PUBLIC_CONVEX_SITE_URL;

type UseStorageUploadOptions = {
  onSuccess?: (data: { storageId: string }) => void;
  onError?: (error: Error) => void;
};

export const useStorageUpload = (options?: UseStorageUploadOptions) => {
  const token = useAuthToken();
  const [isPending, setIsPending] = useState(false);
  const [progress, setProgress] = useState(0);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  // Automatically reset progress after completion
  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        setProgress(0);
      }, 500); // Reset after 500ms

      return () => clearTimeout(timeout);
    }
  }, [progress]);

  const uploadAsync = useCallback(
    async ({ file, path }: { file: File; path: string }) => {
      const uploadUrl = new URL(`${convexSiteUrl}/storage/upload`);
      uploadUrl.searchParams.set("filePath", path);

      return new Promise<{ storageId: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;

        xhr.open("POST", uploadUrl.toString(), true);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        setIsPending(true);
        setProgress(0);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setProgress((event.loaded / event.total) * 100);
          }
        };

        xhr.onload = () => {
          setIsPending(false);
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              const result = { storageId: response.storageId };
              options?.onSuccess?.(result);
              resolve(result);
            } catch {
              const error = new Error("Failed to parse server response");
              options?.onError?.(error);
              reject(error);
            }
          } else {
            const error = new Error(`Upload failed with status ${xhr.status}`);
            options?.onError?.(error);
            reject(error);
          }
        };

        xhr.onerror = () => {
          setIsPending(false);
          const error = new Error("Upload failed due to network error");
          options?.onError?.(error);
          reject(error);
        };

        xhr.send(file);
      });
    },
    [token, options],
  );

  const abort = useCallback(() => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      setIsPending(false);
    }
  }, []);

  return {
    uploadAsync,
    isPending,
    progress,
    abort,
  };
};
