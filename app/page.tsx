import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { resetSeed } from "@/lib/actions";
import { readStore } from "@/lib/db";
import { ORDER_STATUSES } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const store = await readStore();
  const open = store.orders.filter(
    (o) => !["Done", "Picked up", "Shipped", "Cancelled"].includes(o.status)
  );
  const pipeline = ORDER_STATUSES.map((s) => ({
    status: s,
    count: store.orders.filter((o) => o.status === s).length,
  })).filter((x) => x.count > 0);
  const revenue = store.orders
    .filter(
      (o) =>
        o.paid === "Yes" ||
        ["Paid", "Done", "Picked up", "Shipped"].includes(o.status)
    )
    .reduce((sum, o) => sum + (o.quotePhp || 0), 0);

  return (
    <AppShell active="/">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Dashboard
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">
            Studio pulse
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink/60">
            Log IG DMs as orders, quote from your bands, keep customers in one
            place. Delete the sample row when your first real job lands.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/orders" className="btn btn-primary">
            + New order
          </Link>
          <form action={resetSeed}>
            <button type="submit" className="btn btn-ghost">
              Reset sample data
            </button>
          </form>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink/45">
            Open jobs
          </div>
          <div className="mt-2 text-3xl font-semibold">{open.length}</div>
        </div>
        <div className="card p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink/45">
            Customers
          </div>
          <div className="mt-2 text-3xl font-semibold">
            {store.customers.length}
          </div>
        </div>
        <div className="card p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink/45">
            Quoted / paid (₱)
          </div>
          <div className="mt-2 text-3xl font-semibold">
            {revenue.toLocaleString("en-PH")}
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        <div className="card p-5">
          <h2 className="text-sm font-semibold">By status</h2>
          <ul className="mt-4 space-y-2">
            {pipeline.length === 0 && (
              <li className="text-sm text-ink/50">No orders yet.</li>
            )}
            {pipeline.map((p) => (
              <li
                key={p.status}
                className="flex items-center justify-between gap-3"
              >
                <StatusBadge status={p.status} />
                <span className="text-sm font-semibold">{p.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
            <h2 className="text-sm font-semibold">Recent orders</h2>
            <Link
              href="/orders"
              className="text-sm font-medium text-accent hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-ink/10">
            {store.orders.slice(0, 6).map((o) => (
              <div
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
              >
                <div>
                  <div className="text-sm font-semibold">
                    {o.id} · {o.customer || "No name"}
                  </div>
                  <div className="text-xs text-ink/50">
                    {o.product} · qty {o.qty} · ₱
                    {o.quotePhp.toLocaleString("en-PH")}
                  </div>
                </div>
                <StatusBadge status={o.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-semibold">30-second start</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-ink/70">
          <li>Open Orders → delete sample GC-0001</li>
          <li>Add your next Instagram DM as a new order</li>
          <li>Use Quotes for price bands before you reply</li>
          <li>Customers auto-fill when you save an order</li>
        </ol>
      </div>
    </AppShell>
  );
}
