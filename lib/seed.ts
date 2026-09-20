import type { Store } from "./types";

export function seedStore(): Store {
  return {
    orders: [
      {
        id: "GC-0001",
        dateIn: "2026-09-20",
        customer: "Sample Customer",
        igHandle: "@sample",
        phone: "",
        product: "Stickers",
        description: "DELETE after first real order",
        qty: 50,
        specs: "2×5 cm",
        quotePhp: 500,
        status: "Inquiry",
        dueDate: "",
        payment: "GCash",
        paid: "No",
        notes: "Sample row — replace with real IG DMs",
      },
    ],
    quotes: [
      { id: "Q-1", product: "Stickers / labels", unit: "per piece or sheet", baseFrom: 3, baseTo: 15, rushPct: 20, notes: "Size, shape, qty" },
      { id: "Q-2", product: "Photo magnets", unit: "per piece", baseFrom: 50, baseTo: 150, rushPct: 25, notes: "Size + photo quality" },
      { id: "Q-3", product: "Business cards", unit: "per set of 100", baseFrom: 400, baseTo: 1200, rushPct: 20, notes: "Sides, laminate, stock" },
      { id: "Q-4", product: "Packaging stickers", unit: "per design + run", baseFrom: 300, baseTo: 2500, rushPct: 25, notes: "Design tidy-up extra" },
      { id: "Q-5", product: "Signage / lamination", unit: "per sheet", baseFrom: 80, baseTo: 500, rushPct: 20, notes: "A4 / A3 / custom" },
      { id: "Q-6", product: "Personalized gift set", unit: "per set", baseFrom: 150, baseTo: 800, rushPct: 30, notes: "Pens, cases, labels" },
      { id: "Q-7", product: "Custom logo / mark", unit: "per project", baseFrom: 1500, baseTo: 5000, rushPct: 0, notes: "Print apps priced on Orders" },
    ],
    customers: [
      {
        id: "C-0001",
        name: "Sample Customer",
        igHandle: "@sample",
        phone: "",
        notes: "Replace with real clients",
        firstOrder: "",
        lastOrder: "",
        totalOrders: 0,
      },
    ],
  };
}
