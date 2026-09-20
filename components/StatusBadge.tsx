import type { OrderStatus } from "@/lib/types";

const tones: Record<OrderStatus, string> = {
  Inquiry: "bg-amber-100 text-amber-900",
  Quoted: "bg-sky-100 text-sky-900",
  Confirmed: "bg-indigo-100 text-indigo-900",
  Paid: "bg-emerald-100 text-emerald-900",
  "In Production": "bg-orange-100 text-orange-900",
  Ready: "bg-lime-100 text-lime-900",
  Done: "bg-stone-200 text-stone-800",
  "Picked up": "bg-stone-200 text-stone-800",
  Shipped: "bg-stone-200 text-stone-800",
  Cancelled: "bg-red-100 text-red-800",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`badge ${tones[status] || "bg-stone-200 text-stone-800"}`}>
      {status}
    </span>
  );
}
