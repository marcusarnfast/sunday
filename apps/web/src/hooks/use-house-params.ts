import { useQueryStates } from "nuqs";

import { createLoader, parseAsStringEnum } from "nuqs/server";

export const houseParamsSchema = {
	tab: parseAsStringEnum([
		"overview",
		"calendar",
		"tasks",
		"members",
		"edit",
	]).withDefault("overview"),
};

export function useHouseParams() {
	const [params, setParams] = useQueryStates(houseParamsSchema);

	return { params, setParams };
}

export const loadHouseParams = createLoader(houseParamsSchema);
