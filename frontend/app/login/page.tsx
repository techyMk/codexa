"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Github, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/brand";
import { toast } from "sonner";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";
  const error = search.get("error");
  const githubHref = `/auth/login/github?next=${encodeURIComponent(next)}`;

  useEffect(() => {
    if (error) toast.error(decodeURIComponent(error));
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-[800px] bg-violet-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-0 h-72 w-72 bg-blue-500/20 blur-[120px] rounded-full" />
      </div>

      <Link href="/" className="absolute top-6 left-6">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </Link>

      <div className="w-full max-w-md">
        <div className="border-glow rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-primary/40 blur-xl" />
              <Icon size={64} className="relative" priority />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-center tracking-tight">Welcome to Codexa</h1>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Sign in with GitHub to install the bot and view your reviews.
          </p>

          <Link href={githubHref} prefetch={false} className="block mt-8">
            <Button variant="glow" size="lg" className="w-full">
              <Github className="h-5 w-5" />
              Continue with GitHub
            </Button>
          </Link>

          <p className="text-xs text-muted-foreground text-center mt-6">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-foreground">Terms</Link> and{" "}
            <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
