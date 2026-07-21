import { captureNowPlayingSampled } from "../../../lib/server/analytics";
import { hashIp } from "../../../lib/server/db";
import { clientIp, json } from "../../../lib/server/http";
import { getNowPlaying } from "../../../lib/server/now-playing";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const data = await getNowPlaying();
  await captureNowPlayingSampled(hashIp(clientIp(request.headers)), {
    isPlaying: data.isPlaying,
  });
  return json(data, {
    headers: {
      "cache-control": "s-maxage=30, stale-while-revalidate=60",
    },
  });
}
