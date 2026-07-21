import {
  listPendingGuestbook,
  moderateGuestbook,
} from "../../../../lib/server/guestbook";
import { json, readJson } from "../../../../lib/server/http";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  // Preferred: Authorization: Bearer <token>. Query param kept for curl convenience.
  const auth = request.headers.get("authorization");
  const bearer = auth?.match(/^Bearer\s+(.+)$/i)?.[1];
  const token = bearer ?? new URL(request.url).searchParams.get("token");
  const result = await listPendingGuestbook(token);
  return json(result.body, { status: result.status });
}

export async function POST(request: Request): Promise<Response> {
  const raw = await readJson(request);
  const result = await moderateGuestbook(raw);
  return json(result.body, { status: result.status });
}
