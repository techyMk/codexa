import "server-only";
import { createClient } from "@/lib/supabase/server";

export type Review = {
  id: string;
  repo: string;
  pr_number: number;
  installation_id: number;
  provider: string;
  status: "pending" | "completed" | "failed";
  summary: string | null;
  findings_count: number | null;
  duration_ms: number | null;
  error: string | null;
  created_at: string;
};

export type Stats = {
  total_reviews: number;
  completed_reviews: number;
  findings: number;
  avg_duration_ms: number;
};

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const EMPTY_STATS: Stats = {
  total_reviews: 0,
  completed_reviews: 0,
  findings: 0,
  avg_duration_ms: 0,
};

function buildUrl(path: string, params: Record<string, string | number | undefined> = {}) {
  const url = new URL(path, BACKEND);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }
  return url.toString();
}

/**
 * Fetch backend with the user's Supabase access_token in the Authorization header.
 * The backend verifies the JWT against Supabase's JWKS and scopes results to the user.
 */
async function authedFetch(url: string, init?: RequestInit): Promise<Response> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  return fetch(url, {
    ...init,
    headers: {
      ...(init?.headers as Record<string, string> | undefined),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export async function fetchStats(): Promise<Stats> {
  try {
    const r = await authedFetch(buildUrl("/reviews/stats"), {
      cache: "no-store",
    });
    if (!r.ok) return EMPTY_STATS;
    return await r.json();
  } catch {
    return EMPTY_STATS;
  }
}

export async function fetchReviews(limit = 50): Promise<Review[]> {
  try {
    const r = await authedFetch(buildUrl("/reviews", { limit }), {
      cache: "no-store",
    });
    if (!r.ok) return [];
    const data = await r.json();
    return data.reviews ?? [];
  } catch {
    return [];
  }
}
