"use client";

import { motion } from "framer-motion";
import {
  Bug,
  ShieldCheck,
  Zap,
  GitPullRequest,
  Brain,
  Lock,
  Cpu,
  Layers,
} from "lucide-react";

// Two brand-aligned gradients alternate across the grid for visual rhythm.
const ACCENT_A = "from-indigo-500/20 to-blue-500/20";
const ACCENT_B = "from-fuchsia-500/20 to-violet-500/20";

const features = [
  {
    icon: Bug,
    title: "Real bug detection",
    desc: "Logic errors, off-by-one, race conditions, missing null checks — not surface-level lint.",
  },
  {
    icon: ShieldCheck,
    title: "Security-aware",
    desc: "Catches injection, leaked secrets, weak crypto, and unsafe deserialization patterns.",
  },
  {
    icon: Zap,
    title: "Sub-30s reviews",
    desc: "Codexa lands findings in seconds, not minutes. Your CI doesn't wait, and neither do you.",
  },
  {
    icon: GitPullRequest,
    title: "Inline PR comments",
    desc: "Findings posted as a single review comment with file, line, severity, and a suggested fix.",
  },
  {
    icon: Brain,
    title: "Always-on reliability",
    desc: "Codexa runs on multiple AI providers with automatic failover. If one is throttled, the next steps in seamlessly.",
  },
  {
    icon: Lock,
    title: "Bring your own key",
    desc: "Plug in your own AI provider key — your code never touches our servers.",
  },
  {
    icon: Cpu,
    title: "GitHub Actions native",
    desc: "Runs as a GitHub App or as a step in your existing workflow. Zero infra to manage.",
  },
  {
    icon: Layers,
    title: "Self-hostable",
    desc: "FastAPI backend ships in one Docker image. Deploy free on Render, Fly, or Railway.",
  },
].map((f, i) => ({ ...f, accent: i % 2 === 0 ? ACCENT_A : ACCENT_B }));

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Everything you need.
            <br />
            <span className="text-muted-foreground">Nothing you don't pay for.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="border-glow group relative rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur transition-all hover:bg-card/60"
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${f.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/60 border border-border/60 mb-4">
                <f.icon className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
