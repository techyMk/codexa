"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  GitPullRequest,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Full sidebar navigation. Server-rendered layouts can't pass icon components
 * across the boundary, so all items + icons are co-located in this client file.
 */
export function SidebarNav() {
  return (
    <>
      <SidebarNavItem href="/" icon={Home} exact>
        Home
      </SidebarNavItem>
      <SidebarNavItem href="/dashboard" icon={LayoutDashboard} exact>
        Overview
      </SidebarNavItem>
      <SidebarNavItem href="/dashboard/reviews" icon={GitPullRequest}>
        Reviews
      </SidebarNavItem>
      <SidebarNavItem href="/dashboard/settings" icon={Settings}>
        Settings
      </SidebarNavItem>
    </>
  );
}

function SidebarNavItem({
  href,
  icon: Icon,
  exact = false,
  children,
}: {
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
        active
          ? "bg-accent/70 text-foreground font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/40",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4",
          active ? "text-violet-400" : "text-muted-foreground",
        )}
      />
      {children}
    </Link>
  );
}
