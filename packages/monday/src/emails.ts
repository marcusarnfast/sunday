"use node";

import { Resend } from "@convex-dev/resend";
import { pretty, render } from "@react-email/render";
import OnboardingEmail from "@sunday/emails/onboarding";
import OtpEmail from "@sunday/emails/otp";
import { internalAction } from "@sunday/monday/server";
import { v } from "convex/values";
import { components } from "./_generated/api";

export const resend: Resend = new Resend(components.resend, {
	apiKey: process.env.RESEND_API_KEY,
	testMode: false,
});

export const sendInviteEmail = internalAction({
	args: {
		email: v.string(),
		houseName: v.string(),
	},
	handler: async (ctx, args) => {
		const { email, houseName } = args;
		const html = await pretty(await render(OtpEmail({ token: "123-456" })));

		await resend.sendEmail(ctx, {
			from: "Hello <hello@sunday.codes>",
			to: email,
			subject: `You have been invited to ${houseName} | Sunday`,
			html,
		});
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
