import fs from "fs";
import path from "path";

const CACHE_DIR = process.env.DISK_CACHE_DIR || path.join(process.cwd(), ".next", "disk-cache");
const DEFAULT_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days

function getPath(key: string): string {
  const safe = key.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 200);
  return path.join(CACHE_DIR, `${safe}.json`);
}

export function cacheGet<T>(key: string, ttl = DEFAULT_TTL): T | null {
  try {
    const file = getPath(key);
    if (!fs.existsSync(file)) return null;
    const raw = fs.readFileSync(file, "utf-8");
    const entry = JSON.parse(raw);
    if (Date.now() - entry.ts > ttl) {
      fs.unlinkSync(file);
      return null;
    }
    return entry.data as T;
  } catch {
    return null;
  }
}

export function cacheSet(key: string, data: unknown): void {
  try {
    const file = getPath(key);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // silent
  }
}
