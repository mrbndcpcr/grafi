import { AppShell } from "@/components/AppShell";
import { deleteQuote, upsertQuote } from "@/lib/actions";
import { readStore } from "@/lib/db";

export const dynamic = "force-dynamic";

async function deleteQuoteAction(formData: FormData) {
  "use server";
  await deleteQuote(String(formData.get("id")));
}

export default async function QuotesPage() {
  const store = await readStore();

  return (
    <AppShell active="/quotes">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          Quotes
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Price bands
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          Edit these to match your real rates. Final quote still lives on the
          order.
        </p>
      </div>

      <div className="mb-8 card p-5">
        <h2 className="mb-4 text-sm font-semibold">Add band</h2>
        <form
          action={upsertQuote}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <input type="hidden" name="id" value="" />
          <div>
            <label className="label">Product</label>
            <input
              className="input"
              name="product"
              required
              placeholder="Stickers / labels"
            />
          </div>
          <div>
            <label className="label">Unit</label>
            <input className="input" name="unit" placeholder="per piece" />
          </div>
          <div>
            <label className="label">Base from ₱</label>
            <input
              className="input"
              type="number"
              name="baseFrom"
              defaultValue={0}
            />
          </div>
          <div>
            <label className="label">Base to ₱</label>
            <input
              className="input"
              type="number"
              name="baseTo"
              defaultValue={0}
            />
          </div>
          <div>
            <label className="label">Rush %</label>
            <input
              className="input"
              type="number"
              name="rushPct"
              defaultValue={20}
            />
          </div>
          <div>
            <label className="label">Notes</label>
            <input
              className="input"
              name="notes"
              placeholder="What moves the price"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <button type="submit" className="btn btn-primary">
              Save band
            </button>
          </div>
        </form>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {store.quotes.map((q) => (
          <div key={q.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{q.product}</h3>
                <p className="text-xs text-ink/50">{q.unit}</p>
              </div>
              <form action={deleteQuoteAction}>
                <input type="hidden" name="id" value={q.id} />
                <button type="submit" className="btn btn-danger">
                  Delete
                </button>
              </form>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight">
              ₱{q.baseFrom.toLocaleString("en-PH")}–
              {q.baseTo.toLocaleString("en-PH")}
            </p>
            <p className="mt-1 text-sm text-ink/60">
              Rush +{q.rushPct}%{q.notes ? ` · ${q.notes}` : ""}
            </p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
