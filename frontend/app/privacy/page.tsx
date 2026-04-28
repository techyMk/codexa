import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section } from "@/components/legal/legal-page";
import { GITHUB_REPO_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Codexa handles your data.",
};

export default function Page() {
  return (
    <LegalPage title="Privacy Policy" updated="April 28, 2026">
      <p>
        Codexa values your privacy. This page explains exactly what we collect, what we do with it,
        and what we don&apos;t do. If you&apos;d rather read the source code, the entire pipeline is
        public on{" "}
        <Link href={GITHUB_REPO_URL} target="_blank" rel="noopener" className="text-primary hover:underline">
          GitHub
        </Link>.
      </p>

      <Section title="What we collect">
        <p>When you install the GitHub App and open a pull request in a connected repo:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong className="text-foreground">Pull request diff</strong> — the text changes in your PR are sent to the AI provider so it can review them.
          </li>
          <li>
            <strong className="text-foreground">Review metadata</strong> — repo name, PR number, AI provider used, status (completed/failed), finding count, duration. Stored in our database for the dashboard.
          </li>
        </ul>
        <p>When you sign in to the dashboard:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong className="text-foreground">GitHub identity</strong> — your username, email, and avatar URL, via GitHub OAuth.
          </li>
        </ul>
      </Section>

      <Section title="What we don&apos;t collect">
        <ul className="list-disc pl-6 space-y-2">
          <li>We don&apos;t store your code. Diffs are sent to the AI provider in real time and discarded immediately afterward — only the AI&apos;s short summary is saved.</li>
          <li>We don&apos;t track your browsing, set marketing cookies, or use third-party analytics.</li>
          <li>We don&apos;t sell, share, or rent any data to third parties.</li>
        </ul>
      </Section>

      <Section title="Where the data goes">
        <p>Codexa uses the following sub-processors:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong className="text-foreground">Google Gemini</strong> &amp; <strong className="text-foreground">Groq</strong> — receive your PR diff to generate the review. Subject to their respective privacy policies.
          </li>
          <li>
            <strong className="text-foreground">Supabase</strong> — stores review metadata and user accounts. Hosted in their managed Postgres.
          </li>
          <li>
            <strong className="text-foreground">GitHub</strong> — webhook source and authoritative location of your PR comments.
          </li>
          <li>
            <strong className="text-foreground">Vercel</strong> &amp; <strong className="text-foreground">Render</strong> — hosting infrastructure for the website and backend.
          </li>
        </ul>
      </Section>

      <Section title="Data retention">
        <p>
          Review metadata is kept indefinitely so you can browse historical reviews on the dashboard. PR
          diffs are not retained — they exist only in transit between the webhook and the AI provider.
          AI providers may retain prompt data per their own policies (typically 30 days for safety
          monitoring; check their docs for specifics).
        </p>
      </Section>

      <Section title="Your rights">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong className="text-foreground">Stop reviews:</strong> uninstall the GitHub App at any time from your GitHub settings — Codexa loses all access immediately.
          </li>
          <li>
            <strong className="text-foreground">Delete your account:</strong> contact us via the email below and we&apos;ll remove your user record and associated review history within 7 days.
          </li>
          <li>
            <strong className="text-foreground">Export your data:</strong> all your review metadata is available via the dashboard. Open an issue if you need a bulk export.
          </li>
        </ul>
      </Section>

      <Section title="Cookies">
        <p>
          We use only essential cookies — those required for sign-in (Supabase session) and for the
          site to function. No advertising or tracking cookies. No consent banner is shown because no
          consent is required for essential cookies under GDPR.
        </p>
      </Section>

      <Section title="Self-hosting">
        <p>
          If you self-host Codexa with your own keys, none of your data ever touches our servers. The
          source is fully open and the deployment guide is in our{" "}
          <Link href={GITHUB_REPO_URL} target="_blank" rel="noopener" className="text-primary hover:underline">
            README
          </Link>.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          When this policy changes meaningfully, we&apos;ll update the &quot;Last updated&quot; date at the top
          and announce it on the GitHub repo. Continued use of Codexa constitutes acceptance of the new
          terms.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Privacy questions? Open an issue on{" "}
          <Link href={GITHUB_REPO_URL} target="_blank" rel="noopener" className="text-primary hover:underline">
            GitHub
          </Link>
          {" "}or reach out to{" "}
          <Link href="https://techymk.vercel.app/" target="_blank" rel="noopener" className="text-primary hover:underline">
            techyMk
          </Link>.
        </p>
      </Section>
    </LegalPage>
  );
}
