"use client";

import { motion } from "framer-motion";
import { GitPullRequest, Webhook, Brain, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: GitPullRequest,
    title: "Open a pull request",
    desc: "Codexa listens for new and updated PRs in any repo where the GitHub App is installed.",
  },
  {
    icon: Webhook,
    title: "Webhook fires",
    desc: "FastAPI verifies the signature and queues the diff for review — no polling, no delays.",
  },
  {
    icon: Brain,
    title: "AI reviews the diff",
    desc: "Gemini 2.0 Flash runs first; Groq Llama 3.3 catches the call if Gemini is rate-limited.",
  },
  {
    icon: MessageSquare,
    title: "Comment posted",
    desc: "Findings, severity, and concrete fixes land on the PR within seconds. Reviewers stay focused.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Four steps. <span className="gradient-text">Zero config.</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden md:block" />

          <div className="space-y-6 md:space-y-12">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`flex md:items-center gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                <div className="flex-1 md:text-right md:[.flex-row-reverse_&]:text-left">
                  <div className="border-glow inline-block max-w-md rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur">
                    <div className="text-xs font-mono text-muted-foreground mb-2">
                      Step {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </div>
                <div className="relative flex-shrink-0 hidden md:flex">
                  <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl" />
                  <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                    <s.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
