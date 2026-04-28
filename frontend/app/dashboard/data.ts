import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * GitHub username (login) of the currently signed-in user, or undefined if not logged in.
 * Read from Supabase OAuth metadata — populated automatically by GitHub provider.
 */
export async function getCurrentGithubLogin(): Promise<string | undefined> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return undefined;
  const meta = user.user_metadata as Record<string, unknown> | null;
  return (meta?.user_name as string | undefined) ?? (meta?.preferred_username as string | undefined);
}

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

function buildUrl(path: string, params: Record<string, string | number | undefined>) {
  const url = new URL(path, BACKEND);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }
  return url.toString();
}

export async function fetchStats(owner?: string): Promise<Stats> {
  try {
    const r = await fetch(buildUrl("/reviews/stats", { owner }), {
      next: { revalidate: 30 },
    });
    if (!r.ok) return EMPTY_STATS;
    return await r.json();
  } catch {
    return EMPTY_STATS;
  }
}

export async function fetchReviews(limit = 50, owner?: string): Promise<Review[]> {
  try {
    const r = await fetch(buildUrl("/reviews", { limit, owner }), {
      next: { revalidate: 15 },
    });
    if (!r.ok) return [];
    const data = await r.json();
    return data.reviews ?? [];
  } catch {
    return [];
  }
}
