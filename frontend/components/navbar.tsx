"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Github,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Logo } from "@/components/brand";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { INSTALL_URL, GITHUB_REPO_URL } from "@/lib/constants";
import { useUser } from "@/lib/use-user";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useUser();
  const pathname = usePathname();

  function navLinkCls(href: string) {
    const noActive = href.startsWith("http") || href.includes("#");
    const isHome = href === "/";
    const active = noActive
      ? false
      : isHome
        ? pathname === "/"
        : pathname === href || pathname.startsWith(href + "/");

    return cn(
      "relative transition-colors",
      active
        ? "text-foreground font-medium after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-violet-500 after:to-blue-500"
        : "hover:text-foreground",
    );
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/40 bg-background/70 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center group" aria-label="Codexa home">
          <Logo width={170} priority className="transition-transform group-hover:scale-[1.02]" />
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <Link href="/" className={navLinkCls("/")}>Home</Link>
          <Link href="/#features" className={navLinkCls("/#features")}>Features</Link>
          <Link href="/#how-it-works" className={navLinkCls("/#how-it-works")}>How it works</Link>
          <Link href="/docs" className={navLinkCls("/docs")}>Docs</Link>
          {user && (
            <Link href="/dashboard" className={navLinkCls("/dashboard")}>
              Dashboard
            </Link>
          )}
          <Link
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener"
            className={cn(navLinkCls(GITHUB_REPO_URL), "flex items-center gap-1.5")}
          >
            <Github className="h-4 w-4" /> GitHub
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-8 w-20 rounded-md bg-muted/40 animate-pulse" />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href={INSTALL_URL} target="_blank" rel="noopener">
                <Button variant="glow" size="sm">Install free</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const avatar = user.user_metadata?.avatar_url as string | undefined;
  const name =
    (user.user_metadata?.user_name as string | undefined) ??
    (user.user_metadata?.full_name as string | undefined) ??
    user.email ??
    "you";
  const initial = name.charAt(0).toUpperCase();

  async function signOut() {
    await createClient().auth.signOut();
    window.location.href = "/";
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 border border-border/60 bg-card/40 backdrop-blur hover:bg-card/70 hover:border-border transition"
        aria-label="Account menu"
      >
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="" className="h-7 w-7 rounded-full" />
        ) : (
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
            {initial}
          </div>
        )}
        <span className="hidden sm:inline text-sm font-medium text-foreground max-w-[140px] truncate">
          {name}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl p-1.5 z-50">
          <div className="px-3 py-2.5 border-b border-border/40 mb-1">
            <div className="text-sm font-medium truncate">{name}</div>
            {user.email && (
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            )}
          </div>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-accent/60 transition"
          >
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-accent/60 transition"
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            Settings
          </Link>
          <div className="my-1 border-t border-border/40" />
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-accent/60 transition text-left text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
