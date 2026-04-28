"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Github, LayoutDashboard, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/brand";
import { INSTALL_URL } from "@/lib/constants";
import { useUser } from "@/lib/use-user";

export function Hero() {
  const { user, loading } = useUser();
  const greeting =
    (user?.user_metadata?.user_name as string | undefined) ??
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split("@")[0];
  const avatar = user?.user_metadata?.avatar_url as string | undefined;

  return (
    <section className="relative overflow-hidden pt-32 pb-24">
      {/* Background — animated grid + spotlight */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 spotlight" />
        <div
          className="absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Floating gradient blobs */}
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-violet-500/20 blur-[120px] animate-pulse-glow" />
        <div className="absolute top-20 right-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px] animate-pulse-glow [animation-delay:2s]" />
      </div>

      <div className="container max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {user ? (
            <Badge className="pl-1 pr-3 py-1">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="" className="h-5 w-5 rounded-full" />
              ) : (
                <Sparkles className="h-3 w-3 text-violet-400" />
              )}
              <span>
                Welcome back,{" "}
                <span className="text-foreground font-semibold">{greeting}</span>
              </span>
            </Badge>
          ) : (
            <Badge>
              <Sparkles className="h-3 w-3 text-violet-400" />
              <span>Free forever · Open source</span>
            </Badge>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-8 text-5xl md:text-7xl font-semibold tracking-tight text-balance"
        >
          AI code review,
          <br />
          <span className="gradient-text">on every pull request.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground text-balance"
        >
          Codexa catches bugs, security issues, and bad patterns before merge — without
          slowing your CI. Free, open-source, and yours to keep.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          {!loading && user ? (
            <>
              <Link href="/dashboard">
                <Button variant="glow" size="lg">
                  <LayoutDashboard className="h-4 w-4" />
                  Go to dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={INSTALL_URL} target="_blank" rel="noopener">
                <Button variant="outline" size="lg">
                  <Github className="h-4 w-4" /> Install on a repo
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href={INSTALL_URL} target="_blank" rel="noopener">
                <Button variant="glow" size="lg">
                  Install on GitHub <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg">
                  <Github className="h-4 w-4" /> See how it works
                </Button>
              </Link>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-emerald-400" /> Reviews in &lt;30s
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">No credit card</span>
          <span>·</span>
          <span>Self-hostable</span>
        </motion.div>

        <PRPreview />
      </div>
    </section>
  );
}

function PRPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="mt-20 mx-auto max-w-3xl"
    >
      <div className="border-glow relative rounded-2xl border border-border/60 bg-card/40 p-1 backdrop-blur-xl shadow-2xl">
        <div className="rounded-xl bg-card/80 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <span className="h-3 w-3 rounded-full bg-green-500/70" />
            </div>
            <span className="ml-3 text-xs text-muted-foreground font-mono">
              github.com/your-org/repo · #142
            </span>
          </div>

          <div className="p-6 text-left space-y-4 font-mono text-sm">
            <div className="flex items-start gap-3">
              <Icon size={32} className="mt-1 rounded-full" />
              <div className="flex-1">
                <div className="text-foreground font-semibold mb-2">🤖 Codexa AI Review</div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Solid JWT setup overall. Two things worth fixing before merge — a missing
                  env-var guard and an overly long token expiry.
                </p>
                <div className="mt-4 space-y-2.5">
                  <Finding sev="error" file="auth/jwt.py" line={24}
                    msg="App crashes silently if SECRET_KEY isn't set. Fail fast at startup instead." />
                  <Finding sev="warn" file="auth/jwt.py" line={31}
                    msg="30-day access tokens are risky. Use short-lived access + refresh tokens." />
                  <Finding sev="info" file="api/login.py" line={12}
                    msg="Email lookup is case-sensitive — normalize on insert and on lookup." />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Finding({ sev, file, line, msg }: { sev: "error" | "warn" | "info"; file: string; line: number; msg: string }) {
  const colors = {
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    warn: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  } as const;
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/40 border border-border/40">
      <span className={`px-2 py-0.5 rounded-md border text-[10px] uppercase font-bold tracking-wide ${colors[sev]}`}>
        {sev}
      </span>
      <div className="flex-1">
        <span className="text-xs text-muted-foreground">{file}:{line}</span>
        <p className="text-sm text-foreground/90 mt-1">{msg}</p>
      </div>
    </div>
  );
}
