import { promises as fs } from "fs";
import path from "path";
import { seedStore } from "./seed";
import type { Store } from "./types";

function candidatePaths(): string[] {
  const primary = process.env.DATA_DIR || path.join(process.cwd(), "data");
  return [
    path.join(primary, "store.json"),
    path.join("/tmp/grafi-data", "store.json"),
  ];
}

let memoryStore: Store | null = null;
let activePath: string | null = null;

async function tryRead(filePath: string): Promise<Store | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as Store;
  } catch {
    return null;
  }
}

async function tryWrite(filePath: string, store: Store): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(store, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("[db] write failed", filePath, err);
    return false;
  }
}

async function ensureStore(): Promise<Store> {
  if (activePath) {
    const existing = await tryRead(activePath);
    if (existing) return existing;
  }

  for (const filePath of candidatePaths()) {
    const existing = await tryRead(filePath);
    if (existing) {
      activePath = filePath;
      return existing;
    }
  }

  const seeded = seedStore();
  for (const filePath of candidatePaths()) {
    if (await tryWrite(filePath, seeded)) {
      activePath = filePath;
      memoryStore = seeded;
      return seeded;
    }
  }

  console.error("[db] all disk paths failed; using in-memory store");
  memoryStore = seeded;
  return seeded;
}

export async function readStore(): Promise<Store> {
  if (memoryStore && !activePath) return memoryStore;
  return ensureStore();
}

export async function writeStore(store: Store): Promise<void> {
  memoryStore = store;
  const paths = activePath ? [activePath, ...candidatePaths()] : candidatePaths();
  const unique = [...new Set(paths)];
  for (const filePath of unique) {
    if (await tryWrite(filePath, store)) {
      activePath = filePath;
      return;
    }
  }
  console.error("[db] writeStore: persisted to memory only");
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
