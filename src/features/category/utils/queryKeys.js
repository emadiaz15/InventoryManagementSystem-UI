// src/features/category/utils/categoryKeys.js
export const categoryKeys = {
  all: ["categories"],
  list: (filters = {}) => [...categoryKeys.all, filters],
  detail: (id) => [...categoryKeys.all, "detail", id],
  prefetch: () => ["prefetch", "categories"],
};
