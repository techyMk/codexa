import "server-only";

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

export async function fetchStats(): Promise<Stats> {
  try {
    const r = await fetch(`${BACKEND}/reviews/stats`, { next: { revalidate: 30 } });
    if (!r.ok) return EMPTY_STATS;
    return await r.json();
  } catch {
    return EMPTY_STATS;
  }
}

export async function fetchReviews(limit = 50): Promise<Review[]> {
  try {
    const r = await fetch(`${BACKEND}/reviews?limit=${limit}`, { next: { revalidate: 15 } });
    if (!r.ok) return [];
    const data = await r.json();
    return data.reviews ?? [];
  } catch {
    return [];
  }
}
