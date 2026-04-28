"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackToTop({ threshold = 400 }: { threshold?: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={cn(
        "fixed bottom-6 right-6 z-40 group",
        "h-12 w-12 rounded-full",
        "bg-gradient-to-br from-violet-500 to-blue-500",
        "shadow-xl shadow-violet-500/40",
        "flex items-center justify-center",
        "transition-all duration-300 ease-out",
        "hover:shadow-violet-500/60 hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none",
      )}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 opacity-60 blur-md group-hover:opacity-90 transition-opacity"
      />
      <ArrowUp className="relative h-5 w-5 text-white group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
}
