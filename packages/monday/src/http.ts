import { httpRouter } from "convex/server";
import { alphabet, generateRandomString } from "oslo/crypto";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { resend } from "./emails";
import { mimeToExtension } from "./utils/mime";

if (!process.env.CLIENT_ORIGIN) {
  throw new Error("CLIENT_ORIGIN is not set");
}

const clientOrigin = process.env.CLIENT_ORIGIN;

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/resend-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    return await resend.handleResendEventWebhook(ctx, req);
  }),
});

http.route({
  path: "/storage/upload",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Only for authenticated users
    const user = ctx.auth.getUserIdentity();

    if (!user) {
      console.warn("[/storage/upload] Unauthorized request", {
        url: request.url,
        headers: Object.fromEntries(request.headers.entries()),
      });
      return new Response("Unauthorized", { status: 401 });
    }

    // Validate params
    const params = new URLSearchParams(request.url);
    const filePath = params.get("filePath") ?? "/";

    const blob = await request.blob();
    const fileType = blob.type;
    const fileExtension = mimeToExtension(fileType);
    const fileName = `${generateRandomString(10, alphabet("a-z"))}${fileExtension ? `.${fileExtension}` : ""}`;
    const storageId = await ctx.storage.store(blob);

    await ctx.runMutation(api.storage.create, {
      storageId,
      fileName,
      filePath,
      fileType,
      type: "temp",
    });

    return new Response(JSON.stringify({ storageId }), {
      status: 200,
      headers: new Headers({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": clientOrigin,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        Vary: "Origin",
      }),
    });
  }),
});

// Pre-flight request for /storage/upload
http.route({
  path: "/storage/upload",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          // e.g. https://mywebsite.com, configured on your Convex dashboard
          "Access-Control-Allow-Origin": clientOrigin,
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Digest, Authorization",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});

export default http;
