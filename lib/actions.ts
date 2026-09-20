"use server";

import { revalidatePath } from "next/cache";
import {
  nextCustomerId,
  nextOrderId,
  readStore,
  writeStore,
} from "./db";
import { seedStore } from "./seed";
import type { Customer, Order, OrderStatus, QuoteBand } from "./types";

export async function upsertOrder(formData: FormData) {
  const store = await readStore();
  const id = String(formData.get("id") || "");
  const existing = store.orders.find((o) => o.id === id);

  const order: Order = {
    id: id || (await nextOrderId(store)),
    dateIn: String(formData.get("dateIn") || new Date().toISOString().slice(0, 10)),
    customer: String(formData.get("customer") || "").trim(),
    igHandle: String(formData.get("igHandle") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    product: String(formData.get("product") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    qty: Number(formData.get("qty") || 1),
    specs: String(formData.get("specs") || "").trim(),
    quotePhp: Number(formData.get("quotePhp") || 0),
    status: String(formData.get("status") || "Inquiry") as OrderStatus,
    dueDate: String(formData.get("dueDate") || ""),
    payment: String(formData.get("payment") || "GCash"),
    paid: String(formData.get("paid") || "No") as Order["paid"],
    notes: String(formData.get("notes") || "").trim(),
  };

  if (existing) store.orders = store.orders.map((o) => (o.id === id ? order : o));
  else store.orders.unshift(order);

  if (order.customer) {
    const match = store.customers.find(
      (c) =>
        c.name.toLowerCase() === order.customer.toLowerCase() ||
        (order.igHandle && c.igHandle.toLowerCase() === order.igHandle.toLowerCase())
    );
    if (match) {
      match.lastOrder = order.dateIn;
      if (!match.firstOrder) match.firstOrder = order.dateIn;
      match.totalOrders = store.orders.filter(
        (o) =>
          o.customer.toLowerCase() === match.name.toLowerCase() ||
          (match.igHandle && o.igHandle.toLowerCase() === match.igHandle.toLowerCase())
      ).length;
      if (order.igHandle) match.igHandle = order.igHandle;
      if (order.phone) match.phone = order.phone;
    } else {
      store.customers.unshift({
        id: await nextCustomerId(store),
        name: order.customer,
        igHandle: order.igHandle,
        phone: order.phone,
        notes: "",
        firstOrder: order.dateIn,
        lastOrder: order.dateIn,
        totalOrders: 1,
      });
    }
  }

  await writeStore(store);
  revalidatePath("/");
  revalidatePath("/orders");
  revalidatePath("/customers");
}

export async function deleteOrder(id: string) {
  const store = await readStore();
  store.orders = store.orders.filter((o) => o.id !== id);
  await writeStore(store);
  revalidatePath("/");
  revalidatePath("/orders");
}

export async function upsertQuote(formData: FormData) {
  const store = await readStore();
  const id = String(formData.get("id") || "");
  const band: QuoteBand = {
    id: id || `Q-${Date.now()}`,
    product: String(formData.get("product") || "").trim(),
    unit: String(formData.get("unit") || "").trim(),
    baseFrom: Number(formData.get("baseFrom") || 0),
    baseTo: Number(formData.get("baseTo") || 0),
    rushPct: Number(formData.get("rushPct") || 0),
    notes: String(formData.get("notes") || "").trim(),
  };
  const idx = store.quotes.findIndex((q) => q.id === id);
  if (idx >= 0) store.quotes[idx] = band;
  else store.quotes.push(band);
  await writeStore(store);
  revalidatePath("/quotes");
}

export async function deleteQuote(id: string) {
  const store = await readStore();
  store.quotes = store.quotes.filter((q) => q.id !== id);
  await writeStore(store);
  revalidatePath("/quotes");
}

export async function upsertCustomer(formData: FormData) {
  const store = await readStore();
  const id = String(formData.get("id") || "");
  const customer: Customer = {
    id: id || (await nextCustomerId(store)),
    name: String(formData.get("name") || "").trim(),
    igHandle: String(formData.get("igHandle") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    notes: String(formData.get("notes") || "").trim(),
    firstOrder: String(formData.get("firstOrder") || ""),
    lastOrder: String(formData.get("lastOrder") || ""),
    totalOrders: Number(formData.get("totalOrders") || 0),
  };
  const idx = store.customers.findIndex((c) => c.id === id);
  if (idx >= 0) store.customers[idx] = customer;
  else store.customers.unshift(customer);
  await writeStore(store);
  revalidatePath("/customers");
}

export async function deleteCustomer(id: string) {
  const store = await readStore();
  store.customers = store.customers.filter((c) => c.id !== id);
  await writeStore(store);
  revalidatePath("/customers");
}

export async function resetSeed() {
  await writeStore(seedStore());
  revalidatePath("/");
  revalidatePath("/orders");
  revalidatePath("/quotes");
  revalidatePath("/customers");
}
