import { promises as fs } from "fs";
import path from "path";
import { seedStore } from "./seed";
import type { Store } from "./types";

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), "data");
const DATA_PATH = path.join(dataDir, "store.json");

async function ensureStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    return JSON.parse(raw) as Store;
  } catch {
    const seeded = seedStore();
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify(seeded, null, 2), "utf8");
    return seeded;
  }
}

export async function readStore(): Promise<Store> {
  return ensureStore();
}

export async function writeStore(store: Store): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function nextOrderId(store: Store): Promise<string> {
  const nums = store.orders
    .map((o) => parseInt(o.id.replace(/\D/g, ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `GC-${String(next).padStart(4, "0")}`;
}

export async function nextCustomerId(store: Store): Promise<string> {
  const nums = store.customers
    .map((c) => parseInt(c.id.replace(/\D/g, ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `C-${String(next).padStart(4, "0")}`;
}
