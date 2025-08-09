import { Resend, vEmailEvent, vEmailId } from "@convex-dev/resend";
import { components } from "@sunday/monday/api";
import { internalMutation } from "@sunday/monday/server";

export const resend: Resend = new Resend(components.resend, {
  apiKey: process.env.RESEND_API_KEY,
  testMode: process.env.NODE_ENV === "development",
});

export const handleEmailEvent = internalMutation({
  args: {
    id: vEmailId,
    event: vEmailEvent,
  },
  handler: async (_ctx, args) => {
    console.log("Got called back!", args.id, args.event);
    // Probably do something with the event if you care about deliverability!
  },
});
