import manifest from "@/lib/generated/ai-assets.json";

/**
 * AI-generated asset slots (AI-ASSET-PROMPTS.md). Components call aiAsset()
 * and render the generated image when the slot is filled, their hand-drawn
 * SVG/CSS fallback otherwise. The manifest is rebuilt by
 * scripts/sync-ai-assets.mjs whenever new finals land in content-drop.
 */
export function aiAsset(slot: string): string | null {
  return (manifest as Record<string, string>)[slot] ?? null;
}
