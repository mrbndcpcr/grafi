import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { deleteOrder, upsertOrder } from "@/lib/actions";
import { readStore } from "@/lib/db";
import { ORDER_STATUSES, PRODUCTS } from "@/lib/types";

export const dynamic = "force-dynamic";

async function deleteOrderAction(formData: FormData) {
  "use server";
  await deleteOrder(String(formData.get("id")));
}

export default async function OrdersPage() {
  const store = await readStore();

  return (
    <AppShell active="/orders">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          Orders
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Job pipeline
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          Every IG DM → quote → paid → done lives here.
        </p>
      </div>

      <div className="mb-8 card p-5">
        <h2 className="mb-4 text-sm font-semibold">Add order</h2>
        <form action={upsertOrder} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input type="hidden" name="id" value="" />
          <div>
            <label className="label">Date in</label>
            <input
              className="input"
              type="date"
              name="dateIn"
              defaultValue={new Date().toISOString().slice(0, 10)}
            />
          </div>
          <div>
            <label className="label">Customer</label>
            <input className="input" name="customer" placeholder="Name" required />
          </div>
          <div>
            <label className="label">IG handle</label>
            <input className="input" name="igHandle" placeholder="@handle" />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" name="phone" placeholder="09…" />
          </div>
          <div>
            <label className="label">Product</label>
            <select className="input" name="product" defaultValue="Stickers">
              {PRODUCTS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Qty</label>
            <input className="input" type="number" name="qty" min={1} defaultValue={1} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <input className="input" name="description" placeholder="What they asked for" />
          </div>
          <div>
            <label className="label">Specs</label>
            <input className="input" name="specs" placeholder="Size, material…" />
          </div>
          <div>
            <label className="label">Quote ₱</label>
            <input className="input" type="number" name="quotePhp" min={0} defaultValue={0} />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" name="status" defaultValue="Inquiry">
              {ORDER_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Due date</label>
            <input className="input" type="date" name="dueDate" />
          </div>
          <div>
            <label className="label">Payment</label>
            <select className="input" name="payment" defaultValue="GCash">
              <option>GCash</option>
              <option>Bank transfer</option>
              <option>Cash</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="label">Paid?</label>
            <select className="input" name="paid" defaultValue="No">
              <option>No</option>
              <option>Partial</option>
              <option>Yes</option>
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="label">Notes</label>
            <input className="input" name="notes" placeholder="Internal notes" />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <button type="submit" className="btn btn-primary">
              Save order
            </button>
          </div>
        </form>
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">Job</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Quote</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Paid</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {store.orders.map((o) => (
              <tr key={o.id} className="align-top">
                <td className="px-4 py-3">
                  <div className="font-semibold">{o.id}</div>
                  <div className="text-xs text-ink/45">{o.dateIn}</div>
                </td>
                <td className="px-4 py-3">
                  <div>{o.customer}</div>
                  <div className="text-xs text-ink/45">{o.igHandle}</div>
                </td>
                <td className="px-4 py-3">
                  <div>{o.product}</div>
                  <div className="text-xs text-ink/45">
                    qty {o.qty}
                    {o.specs ? ` · ${o.specs}` : ""}
                  </div>
                </td>
                <td className="px-4 py-3">
                  ₱{o.quotePhp.toLocaleString("en-PH")}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3">{o.paid}</td>
                <td className="px-4 py-3">
                  <form action={deleteOrderAction}>
                    <input type="hidden" name="id" value={o.id} />
                    <button type="submit" className="btn btn-danger">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
