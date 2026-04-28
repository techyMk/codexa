import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/landing/footer";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar />

      <article className="container max-w-3xl pt-32 pb-16">
        <header className="mb-12 border-b border-border/40 pb-8">
          <p className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-2">
            Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {updated}
          </p>
        </header>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          {children}
        </div>
      </article>

      <Footer />
    </main>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
