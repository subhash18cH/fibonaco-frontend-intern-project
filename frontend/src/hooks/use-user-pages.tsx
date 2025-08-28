/**
 * User hook for cursor based pagination.
 * Author: Dhaval Shrishrimal
 */

"use client";

import { toast } from "sonner";
import { useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// Hint: Useful when defining a Tanstack Column Definition
export interface UserRow {
  id: number;
  name: string;
  email: string;
  is_superuser: boolean;
  is_verified: boolean;
}

interface UsersPageResponse {
  page: number;
  has_next: boolean;
  data: UserRow[];
}

interface UsePagesQueryOptions<TFilters extends Record<string, unknown> = Record<string, unknown>> {
  limit: number;
  page: number;
  filters: TFilters;
}

function usePagesAPIQuery<TFilters extends Record<string, unknown> = Record<string, unknown>>(
  { limit, page, filters }: UsePagesQueryOptions<TFilters>
) {

  const stringFilters = useMemo(() => {
    const result: Record<string, string> = {};

    // Filter All Results - Useful for your `Select` component filter, Will automatically remove any Filters with value "na"
    // Hint: While designing your filters if nothing is selected:
    // the value in the 'Select' Components Value i.e. Record<value, label> can be "na" and label can be "All"

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value != null && value !== "na" && value !== undefined) {
        result[key] = String(value);
      }
    });
    if (result.are_superusers) {
      result.are_superusers = result.are_superusers === "superuser" ? "true" : "false";
    }
    if (result.are_verified) {
      result.are_verified = result.are_verified === "verified" ? "true" : "false";
    }
    return result;
  }, [filters]);

  const queryKey = useMemo(() => ["users", page, limit, stringFilters], [page, limit, stringFilters]);

  const { data, error, isPending } = useQuery<UsersPageResponse, Error>({
    queryKey,
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), ...stringFilters });
      const res = await fetch(`http://127.0.0.1:8000/api/users?${params}`, { signal });

      if (!res.ok) {
        let message = `Backend returned status ${res.status}`;
        try {
          const errJson = await res.json();
          message = errJson.message ?? errJson.detail ?? message;
        } catch { }
        throw new Error(message);
      }
      return await res.json() as UsersPageResponse;
    },
  });

  useEffect(() => {
    if (error) {
      toast.error("Error fetching data.", { id: `usePagesAPIQueryError` });
    }
  }, [error, page]);

  return { data, error, isPending };
}

export default usePagesAPIQuery;