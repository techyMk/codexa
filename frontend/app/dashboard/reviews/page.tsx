import { fetchReviews } from "../data";

export default async function Page() {
  const reviews = await fetchReviews(100);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground mt-1">All PR reviews Codexa has generated.</p>
      </header>

      <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 text-xs uppercase text-muted-foreground tracking-wider">
            <tr>
              <th className="text-left px-6 py-3 font-medium">Repository</th>
              <th className="text-left px-6 py-3 font-medium">PR</th>
              <th className="text-left px-6 py-3 font-medium">Provider</th>
              <th className="text-left px-6 py-3 font-medium">Findings</th>
              <th className="text-left px-6 py-3 font-medium">Duration</th>
              <th className="text-left px-6 py-3 font-medium">Status</th>
              <th className="text-right px-6 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {reviews.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-muted-foreground">
                  No reviews yet.
                </td>
              </tr>
            )}
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-accent/20 transition-colors">
                <td className="px-6 py-3 font-medium truncate max-w-xs">{r.repo}</td>
                <td className="px-6 py-3 text-muted-foreground">#{r.pr_number}</td>
                <td className="px-6 py-3 text-muted-foreground font-mono text-xs">{r.provider}</td>
                <td className="px-6 py-3 tabular-nums">{r.findings_count ?? 0}</td>
                <td className="px-6 py-3 tabular-nums text-muted-foreground">
                  {r.duration_ms ? `${(r.duration_ms / 1000).toFixed(1)}s` : "—"}
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-md border text-[10px] uppercase font-bold tracking-wide ${
                      r.status === "completed"
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        : r.status === "failed"
                          ? "bg-red-500/15 text-red-400 border-red-500/30"
                          : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-right text-xs text-muted-foreground tabular-nums">
                  {new Date(r.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
