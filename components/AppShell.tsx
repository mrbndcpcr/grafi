import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/orders", label: "Orders" },
  { href: "/quotes", label: "Quotes" },
  { href: "/customers", label: "Customers" },
];

export function AppShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active: string;
}) {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="Grafi Creative Design"
              width={40}
              height={40}
              className="rounded-full border border-ink/10 object-cover"
            />
            <div>
              <div className="text-sm font-semibold tracking-tight">
                Grafi Creative Ops
              </div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-ink/50">
                Studio OS
              </div>
            </div>
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            {links.map((l) => {
              const on = active === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    on
                      ? "bg-ink text-cream"
                      : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/api/logout"
              className="rounded-full px-3 py-1.5 text-sm font-medium text-ink/50 transition hover:bg-ink/5 hover:text-ink"
            >
              Log out
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs text-ink/40">
        Built by Grafi Solutions for Grafi Creative Design · Davao
      </footer>
    </div>
  );
}
