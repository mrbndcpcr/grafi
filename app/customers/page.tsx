import { AppShell } from "@/components/AppShell";
import { deleteCustomer, upsertCustomer } from "@/lib/actions";
import { readStore } from "@/lib/db";

export const dynamic = "force-dynamic";

async function deleteCustomerAction(formData: FormData) {
  "use server";
  await deleteCustomer(String(formData.get("id")));
}

export default async function CustomersPage() {
  const store = await readStore();

  return (
    <AppShell active="/customers">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          Customers
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Client log
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          IG handle is the key. New orders can auto-add people here.
        </p>
      </div>

      <div className="mb-8 card p-5">
        <h2 className="mb-4 text-sm font-semibold">Add customer</h2>
        <form
          action={upsertCustomer}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <input type="hidden" name="id" value="" />
          <input type="hidden" name="firstOrder" value="" />
          <input type="hidden" name="lastOrder" value="" />
          <input type="hidden" name="totalOrders" value="0" />
          <div>
            <label className="label">Name</label>
            <input className="input" name="name" required />
          </div>
          <div>
            <label className="label">IG handle</label>
            <input className="input" name="igHandle" placeholder="@handle" />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" name="phone" />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="label">Notes</label>
            <input className="input" name="notes" />
          </div>
          <div>
            <button type="submit" className="btn btn-primary">
              Save customer
            </button>
          </div>
        </form>
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">IG</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {store.customers.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-semibold">{c.id}</td>
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3">{c.igHandle}</td>
                <td className="px-4 py-3">{c.phone || "—"}</td>
                <td className="px-4 py-3">{c.totalOrders}</td>
                <td className="px-4 py-3 text-ink/60">{c.notes || "—"}</td>
                <td className="px-4 py-3">
                  <form action={deleteCustomerAction}>
                    <input type="hidden" name="id" value={c.id} />
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
