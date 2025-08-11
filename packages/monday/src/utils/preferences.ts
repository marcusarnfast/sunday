import { api } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import type { ActionCtx } from "../_generated/server";

export async function shouldSendEmail(
  ctx: ActionCtx,
  userId: Id<"users">,
  type: "invitation" | "invitationResponse" | "booking" | "bookingResponse",
) {
  const prefs = await ctx.runQuery(api.preferences.getByUserId, {
    userId,
  });

  if (!prefs) {
    return true;
  }

  if (prefs.emailNotifications?.[type] === undefined) {
    return true;
  }

  return prefs.emailNotifications[type] === true;
}
