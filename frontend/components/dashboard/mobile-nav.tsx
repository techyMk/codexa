"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";

export function MobileDashboardNav({
  avatarUrl,
  name,
  email,
}: {
  avatarUrl?: string;
  name: string;
  email: string | null;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between gap-3 px-4 py-3 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="p-2 rounded-lg hover:bg-accent/40 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" aria-label="Codexa home">
          <Logo width={120} />
        </Link>
        <div className="w-9" /> {/* spacer for centering */}
      </div>

      {/* Drawer + overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="md:hidden fixed inset-0 z-50 bg-background/70 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] flex flex-col bg-card/95 backdrop-blur-xl border-r border-border/60 shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                <Link href="/" aria-label="Codexa home">
                  <Logo width={130} />
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close navigation"
                  className="p-2 rounded-lg hover:bg-accent/40 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Nav items */}
              <nav className="px-3 py-3 flex-1 space-y-1 overflow-y-auto">
                <SidebarNav />
              </nav>

              {/* User footer */}
              <div className="p-3 border-t border-border/40">
                <div className="flex items-center gap-3 p-2 rounded-lg">
                  {avatarUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="" className="h-8 w-8 rounded-full" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{name}</div>
                    {email && (
                      <div className="text-xs text-muted-foreground truncate">{email}</div>
                    )}
                  </div>
                </div>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="mt-2 w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </form>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
