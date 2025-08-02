import z from "zod/v4";

export const fileMetadataSchema = z.object({
	id: z.string(),
	name: z.string(),
	size: z.number(),
	type: z.string(),
	url: z.url(),
});
