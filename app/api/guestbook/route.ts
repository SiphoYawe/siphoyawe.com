import {
  createGuestbookEntry,
  listGuestbook,
} from "../../../lib/server/guestbook";
import { clientIp, json, readJson } from "../../../lib/server/http";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const result = await listGuestbook();
  return json(result.body, {
    status: result.status,
    headers: {
      "cache-control": "s-maxage=60, stale-while-revalidate=300",
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  const raw = await readJson(request);
  const ip = clientIp(request.headers);
  const result = await createGuestbookEntry(raw, ip);
  return json(result.body, { status: result.status, headers: result.headers });
}
