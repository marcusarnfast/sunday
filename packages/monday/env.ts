import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export function convexEnv() {
	return createEnv({
		client: {
			NEXT_PUBLIC_CONVEX_URL: z.string().min(1),
		},
		experimental__runtimeEnv: {
			NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
		},
		skipValidation:
			!!process.env.CI || process.env.npm_lifecycle_event === "lint",
	});
}
