"use node";

import { Resend } from "@convex-dev/resend";
import { pretty, render } from "@react-email/render";
import OnboardingEmail from "@sunday/emails/onboarding";
import { internalAction } from "@sunday/monday/server";
import { v } from "convex/values";
import { components } from "./_generated/api";

export const resend: Resend = new Resend(components.resend, {
  apiKey: process.env.RESEND_API_KEY,
  testMode: false,
});

export const sendHouseInvitationEmail = internalAction({
  args: {
    email: v.string(),
    houseName: v.string(),
    inviteeName: v.string(),
  },
  handler: async (_ctx, args) => {
    // TODO: Implement email
    console.log("sendHouseInvitationEmail", args);
  },
});

export const sendHouseInvitationAcceptedEmail = internalAction({
  args: {
    email: v.string(),
    houseName: v.string(),
    inviteeName: v.string(),
  },
  handler: async (_ctx, args) => {
    // TODO: Implement email
    console.log("sendInvitationAcceptedEmail", args);
  },
});

export const sendHouseInvitationDeclinedEmail = internalAction({
  args: {
    email: v.string(),
    houseName: v.string(),
    inviteeName: v.string(),
  },
  handler: async (_ctx, args) => {
    // TODO: Implement email
    console.log("sendInvitationDeclinedEmail", args);
  },
});

export const sendInvitationEmail = internalAction({
  args: {
    inviteeEmail: v.string(),
    inviterName: v.string(),
    inviterEmail: v.string(),
    houseName: v.string(),
  },
  handler: async (_ctx, args) => {
    // TODO: Implement email
    console.log("You have been invited to join Sunday", args);
  },
});

export const sendOnboardingEmail = internalAction({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const { email } = args;

    const html = await pretty(await render(OnboardingEmail()));

    await resend.sendEmail(ctx, {
      from: "Hello <hello@sunday.codes>",
      to: email,
      subject: `Welcome to Sunday | Sunday`,
      html,
    });
  },
});
