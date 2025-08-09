import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval("cleanup files", { hours: 24 }, internal.storage.cleanupFiles);

export default crons;
