"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitPullRequest,
  CheckCircle2,
  LayoutDashboard,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  {
    id: "pr",
    label: "PR Comment",
    icon: GitPullRequest,
    desc: "A single, well-formatted comment on every PR — summary, severity-tagged findings, file:line refs, and concrete fix suggestions.",
    image: "/screenshots/pr-comment.png",
    url: "github.com/your-org/repo/pull/12",
  },
  {
    id: "check",
    label: "Status Check",
    icon: CheckCircle2,
    desc: "Codexa posts a real GitHub status check. Add it to branch protection to block merges with critical issues.",
    image: "/screenshots/github-check.png",
    url: "github.com/your-org/repo/pull/12/checks",
  },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    desc: "Every review tracked. Filter by repo and status. See findings count, duration, and provider at a glance.",
    image: "/screenshots/dashboard-overview.png",
    url: "codexa.dev/dashboard",
  },
  {
    id: "detail",
    label: "Finding Detail",
    icon: Search,
    desc: "Click any review to drill into the full breakdown — every finding with file, line, message, and AI-suggested fix.",
    image: "/screenshots/review-detail.png",
    url: "codexa.dev/dashboard/reviews/...",
  },
] as const;

export function Showcase() {
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>(TABS[0].id);
  const current = TABS.find((t) => t.id === active)!;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Ambient backdrop blobs */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
            See Codexa <span className="gradient-text">in action.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
            From the PR comment to the dashboard — every surface where Codexa shows up.
          </p>
        </motion.div>

        {/* Tab pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {TABS.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300",
                  isActive
                    ? "border-primary/50 bg-primary/10 text-foreground shadow-lg shadow-primary/20"
                    : "border-border/50 bg-card/30 text-muted-foreground hover:text-foreground hover:bg-card/60 hover:border-border",
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Browser chrome + image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
        >
          {/* Glow halo */}
          <div
            aria-hidden
            className="absolute -inset-4 bg-gradient-to-r from-violet-500/30 via-blue-500/30 to-violet-500/30 blur-3xl rounded-3xl opacity-50"
          />

          <div className="relative rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* macOS-style browser chrome */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60 bg-card/80">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <div
                key={current.url}
                className="flex-1 max-w-md mx-auto px-3 py-1 rounded-md bg-background/60 border border-border/40 text-xs text-muted-foreground font-mono text-center truncate animate-fade-up"
                style={{ animationDuration: "300ms" }}
              >
                {current.url}
              </div>
              <div className="w-12" /> {/* spacer for symmetry */}
            </div>

            {/* Screenshot — fades between tabs */}
            <div className="relative aspect-[1920/900] bg-background/40">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={current.image}
                    alt={`${current.label} screenshot`}
                    fill
                    sizes="(min-width: 1280px) 1152px, 100vw"
                    className="object-cover object-top"
                    priority={active === TABS[0].id}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Description fades between tabs */}
        <div className="mt-8 max-w-2xl mx-auto h-12 relative">
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 text-center text-muted-foreground"
            >
              {current.desc}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
