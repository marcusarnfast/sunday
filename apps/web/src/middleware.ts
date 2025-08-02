import {
	convexAuthNextjsMiddleware,
	createRouteMatcher,
} from "@convex-dev/auth/nextjs/server";
import { NextResponse } from "next/server";

const publicRoutes = createRouteMatcher(["/sign-in", "/otp"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
	const isAuthenticated = await convexAuth.isAuthenticated();
	const isPublic = publicRoutes(request);

	if (!isAuthenticated && !isPublic) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}
	// Otherwise, allow the request through
	return NextResponse.next();
});

export const config = {
	// The following matcher runs middleware on all routes
	// except static assets.
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
