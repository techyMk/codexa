import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://codexa.dev"),
  title: {
    default: "Codexa — AI Code Review for Pull Requests",
    template: "%s · Codexa",
  },
  description:
    "Free, fast, open-source GitHub bot that reviews every PR with AI. Catches bugs, security issues, and bad patterns before merge.",
  keywords: ["AI code review", "GitHub bot", "pull request", "code quality", "security review"],
  openGraph: {
    title: "Codexa — AI Code Review for Pull Requests",
    description: "AI-powered, free, open-source PR reviewer for GitHub.",
    url: "https://codexa.dev",
    siteName: "Codexa",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Codexa", description: "AI Code Review for PRs" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster position="bottom-right" theme="dark" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
