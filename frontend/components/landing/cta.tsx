"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INSTALL_URL } from "@/lib/constants";

export function CTA() {
  return (
    <section className="py-24">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-violet-500/10 via-card/40 to-blue-500/10 p-12 md:p-16 text-center backdrop-blur"
        >
          <div aria-hidden className="absolute inset-0 -z-10">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[600px] bg-violet-500/30 blur-[100px] rounded-full" />
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            Ship better PRs <span className="gradient-text">tonight.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto text-balance">
            Two minutes to install. Free forever. No credit card.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href={INSTALL_URL} target="_blank" rel="noopener">
              <Button variant="glow" size="lg">
                Install on GitHub <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="https://github.com/" target="_blank">
              <Button variant="outline" size="lg">Star on GitHub</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
