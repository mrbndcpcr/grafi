export type OrderStatus =
  | "Inquiry"
  | "Quoted"
  | "Confirmed"
  | "Paid"
  | "In Production"
  | "Ready"
  | "Done"
  | "Picked up"
  | "Shipped"
  | "Cancelled";

export type Order = {
  id: string;
  dateIn: string;
  customer: string;
  igHandle: string;
  phone: string;
  product: string;
  description: string;
  qty: number;
  specs: string;
  quotePhp: number;
  status: OrderStatus;
  dueDate: string;
  payment: string;
  paid: "No" | "Partial" | "Yes";
  notes: string;
};

export type QuoteBand = {
  id: string;
  product: string;
  unit: string;
  baseFrom: number;
  baseTo: number;
  rushPct: number;
  notes: string;
};

export type Customer = {
  id: string;
  name: string;
  igHandle: string;
  phone: string;
  notes: string;
  firstOrder: string;
  lastOrder: string;
  totalOrders: number;
};

export type Store = {
  orders: Order[];
  quotes: QuoteBand[];
  customers: Customer[];
};

export const ORDER_STATUSES: OrderStatus[] = [
  "Inquiry",
  "Quoted",
  "Confirmed",
  "Paid",
  "In Production",
  "Ready",
  "Done",
  "Picked up",
  "Shipped",
  "Cancelled",
];

export const PRODUCTS = [
  "Stickers",
  "Labels",
  "Packaging",
  "Photo magnets",
  "Stationery",
  "Business cards",
  "Signage",
  "Gift set",
  "Logo / custom",
  "Other",
];
