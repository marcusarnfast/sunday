import { useQueryStates } from "nuqs";

import { createLoader, parseAsStringEnum } from "nuqs/server";

export const accountParamsSchema = {
  tab: parseAsStringEnum(["account", "preferences"]).withDefault("account"),
};

export function useAccountParams() {
  const [params, setParams] = useQueryStates(accountParamsSchema);

  return { params, setParams };
}

export const loadAccountParams = createLoader(accountParamsSchema);
