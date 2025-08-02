import crons from "@convex-dev/crons/convex.config";
import resend from "@convex-dev/resend/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();

app.use(resend);
app.use(crons);

export default app;
