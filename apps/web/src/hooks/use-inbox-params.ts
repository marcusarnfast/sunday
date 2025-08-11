import { useQueryStates } from "nuqs";

import { createLoader, parseAsStringEnum } from "nuqs/server";

export const inboxParamsSchema = {
  status: parseAsStringEnum(["unread", "read", "all"]).withDefault("all"),
};

export function useInboxParams() {
  const [params, setParams] = useQueryStates(inboxParamsSchema);

  return { params, setParams };
}

export const loadInboxParams = createLoader(inboxParamsSchema);
