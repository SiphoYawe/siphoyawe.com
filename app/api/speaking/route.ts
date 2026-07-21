import { clientIp, json, readJson } from "../../../lib/server/http";
import { handleSpeaking } from "../../../lib/server/speaking";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const raw = await readJson(request);
  const ip = clientIp(request.headers);
  const result = await handleSpeaking(raw, ip);
  return json(result.body, { status: result.status, headers: result.headers });
}
