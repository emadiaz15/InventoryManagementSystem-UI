// src/features/category/utils/queryKeys.js
export const categoryKeys = {
  all:               ["categories"],
  lists:             (filters) => ["categories", "list", filters],
  detail:            (id) => ["categories", "detail", id],
  prefixMatch:       (queryKey) => Array.isArray(queryKey) && queryKey[0] === "categories",
};
