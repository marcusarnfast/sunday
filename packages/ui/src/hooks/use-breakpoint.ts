import * as React from "react";

// Tailwind default breakpoints in pixels
const BREAKPOINTS = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	"2xl": 1536,
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

export function useBreakpoint() {
	const [currentBreakpoint, setCurrentBreakpoint] = React.useState<
		Breakpoint | undefined
	>(undefined);

	React.useEffect(() => {
		const updateBreakpoint = () => {
			const width = window.innerWidth;

			if (width >= BREAKPOINTS["2xl"]) {
				setCurrentBreakpoint("2xl");
			} else if (width >= BREAKPOINTS.xl) {
				setCurrentBreakpoint("xl");
			} else if (width >= BREAKPOINTS.lg) {
				setCurrentBreakpoint("lg");
			} else if (width >= BREAKPOINTS.md) {
				setCurrentBreakpoint("md");
			} else if (width >= BREAKPOINTS.sm) {
				setCurrentBreakpoint("sm");
			} else {
				setCurrentBreakpoint(undefined); // smaller than sm
			}
		};

		// Initial check
		updateBreakpoint();

		// Add resize listener
		window.addEventListener("resize", updateBreakpoint);

		// Cleanup
		return () => window.removeEventListener("resize", updateBreakpoint);
	}, []);

	return currentBreakpoint;
}

// Helper functions to check specific breakpoints
export function useIsBreakpoint(breakpoint: Breakpoint) {
	const currentBreakpoint = useBreakpoint();
	const breakpointOrder: Breakpoint[] = ["sm", "md", "lg", "xl", "2xl"];

	if (!currentBreakpoint) return false;

	const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
	const targetIndex = breakpointOrder.indexOf(breakpoint);

	return currentIndex >= targetIndex;
}
