import { api } from "@sunday/monday/api";
import type { Id } from "@sunday/monday/data-model";
import { useMutation } from "convex/react";
import type { FileMetadata } from "./use-file-upload";

type UploadFileParams = {
	newFile: File | FileMetadata | null | undefined;
	previousId?: Id<"_storage">;
};

export function useStorageUpload() {
	const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
	const deleteById = useMutation(api.storage.deleteById);

	const uploadFile = async ({
		newFile,
		previousId,
	}: UploadFileParams): Promise<{ id: Id<"_storage"> } | undefined> => {
		if (!newFile || !(newFile instanceof File)) {
			return undefined;
		}

		if (previousId) {
			await deleteById({ storageId: previousId });
		}

		const uploadUrl = await generateUploadUrl();
		const result = await fetch(uploadUrl, {
			method: "POST",
			headers: { "Content-Type": newFile.type },
			body: newFile,
		});

		const { storageId } = await result.json();
		return { id: storageId };
	};

	return { uploadFile };
}
