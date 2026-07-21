import { createHash, randomUUID } from "node:crypto";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { env, isConfigured } from "./env";

export type PublicEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  _mock?: true;
};

export type PendingEntry = PublicEntry & { ipHash: string | null };

export type NewEntry = {
  name: string;
  message: string;
  ipHash: string | null;
};

export interface GuestbookStore {
  listApproved(limit: number): Promise<PublicEntry[]>;
  listPending(limit: number): Promise<PendingEntry[]>;
  insert(entry: NewEntry): Promise<{ id: string }>;
  moderate(id: string, approve: boolean): Promise<boolean>;
}

export function hashIp(ip: string): string {
  return createHash("sha256")
    .update(`${env.database.ipHashSalt}:${ip}`)
    .digest("hex");
}

type Row = {
  id: string;
  name: string;
  message: string;
  created_at: string | Date;
  ip_hash?: string | null;
};

function toIso(v: string | Date): string {
  return v instanceof Date ? v.toISOString() : new Date(v).toISOString();
}

class NeonStore implements GuestbookStore {
  constructor(private readonly sql: NeonQueryFunction<false, false>) {}

  async listApproved(limit: number): Promise<PublicEntry[]> {
    const rows = (await this.sql`
      SELECT id, name, message, created_at
      FROM guestbook_entries
      WHERE approved = true
      ORDER BY created_at DESC
      LIMIT ${limit}
    `) as Row[];
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      message: r.message,
      createdAt: toIso(r.created_at),
    }));
  }

  async listPending(limit: number): Promise<PendingEntry[]> {
    const rows = (await this.sql`
      SELECT id, name, message, created_at, ip_hash
      FROM guestbook_entries
      WHERE approved = false
      ORDER BY created_at DESC
      LIMIT ${limit}
    `) as Row[];
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      message: r.message,
      createdAt: toIso(r.created_at),
      ipHash: r.ip_hash ?? null,
    }));
  }

  async insert(entry: NewEntry): Promise<{ id: string }> {
    const rows = (await this.sql`
      INSERT INTO guestbook_entries (name, message, ip_hash, approved)
      VALUES (${entry.name}, ${entry.message}, ${entry.ipHash}, false)
      RETURNING id
    `) as { id: string }[];
    const id = rows[0]?.id ?? "";
    return { id };
  }

  async moderate(id: string, approve: boolean): Promise<boolean> {
    if (approve) {
      const rows = (await this.sql`
        UPDATE guestbook_entries SET approved = true WHERE id = ${id}
        RETURNING id
      `) as { id: string }[];
      return rows.length > 0;
    }
    const rows = (await this.sql`
      DELETE FROM guestbook_entries WHERE id = ${id} RETURNING id
    `) as { id: string }[];
    return rows.length > 0;
  }
}

type MemRow = {
  id: string;
  name: string;
  message: string;
  approved: boolean;
  createdAt: string;
  ipHash: string | null;
};

export class InMemoryStore implements GuestbookStore {
  private readonly rows: MemRow[];

  constructor(seed = true) {
    this.rows = seed ? seedRows() : [];
  }

  async listApproved(limit: number): Promise<PublicEntry[]> {
    return this.rows
      .filter((r) => r.approved)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit)
      .map((r) => ({
        id: r.id,
        name: r.name,
        message: r.message,
        createdAt: r.createdAt,
        _mock: true as const,
      }));
  }

  async listPending(limit: number): Promise<PendingEntry[]> {
    return this.rows
      .filter((r) => !r.approved)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit)
      .map((r) => ({
        id: r.id,
        name: r.name,
        message: r.message,
        createdAt: r.createdAt,
        ipHash: r.ipHash,
        _mock: true as const,
      }));
  }

  async insert(entry: NewEntry): Promise<{ id: string }> {
    const id = randomUUID();
    this.rows.push({
      id,
      name: entry.name,
      message: entry.message,
      approved: false,
      createdAt: new Date().toISOString(),
      ipHash: entry.ipHash,
    });
    return { id };
  }

  async moderate(id: string, approve: boolean): Promise<boolean> {
    const idx = this.rows.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    if (approve) {
      const row = this.rows[idx];
      if (row) row.approved = true;
    } else {
      this.rows.splice(idx, 1);
    }
    return true;
  }
}

function seedRows(): MemRow[] {
  const now = Date.now();
  const iso = (offsetMs: number) => new Date(now - offsetMs).toISOString();
  return [
    {
      id: randomUUID(),
      name: "Amara",
      message: "Love the coat of arms energy. Coram Deo!",
      approved: true,
      createdAt: iso(0),
      ipHash: null,
    },
    {
      id: randomUUID(),
      name: "Dev from Lagos",
      message: "The hidden terminal made my day. whoami is gold.",
      approved: true,
      createdAt: iso(3_600_000),
      ipHash: null,
    },
    {
      id: randomUUID(),
      name: "Ssebo Musisi",
      message: "Webale nnyo, this site feels like home.",
      approved: true,
      createdAt: iso(7_200_000),
      ipHash: null,
    },
  ];
}

let store: GuestbookStore | null = null;

export function getGuestbookStore(): GuestbookStore {
  if (store) return store;
  if (isConfigured.database && env.database.url) {
    const sql = neon(env.database.url);
    store = new NeonStore(sql);
  } else {
    console.warn(
      "[db] DATABASE_URL not set — using in-memory guestbook store (dev mode).",
    );
    store = new InMemoryStore();
  }
  return store;
}

export function __setGuestbookStore(next: GuestbookStore | null): void {
  store = next;
}
