/** Strips optional ```json ... ``` fences and parses JSON. */
export function parseModelJson<T>(raw: string): T {
  let s = raw.trim();
  const fence = /^```(?:json)?\s*\n?([\s\S]*?)\n?```$/m;
  const m = s.match(fence);
  if (m?.[1]) s = m[1].trim();

  return JSON.parse(s) as T;
}
