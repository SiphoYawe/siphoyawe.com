import { createSubscriber } from "../../../lib/server/newsletter";
import { clientIp, json, readJson } from "../../../lib/server/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const raw = await readJson(request);
  const ip = clientIp(request.headers);
  const result = await createSubscriber(raw, ip);
  return json(result.body, { status: result.status, headers: result.headers });
}
