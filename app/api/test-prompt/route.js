import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(req) {
  try {
    if (!BACKEND_URL) {
      return NextResponse.json({ error: 'BACKEND_URL env not configured' }, { status: 500 });
    }
    // Read and sanitize payload to ensure temperature/top_p are in [0,1]
    const raw = await req.json();
    const clamp01 = (v) => {
      const n = Number(v);
      if (!isFinite(n)) return 0;
      return Math.max(0, Math.min(1, n));
    };
    const payload = {
      ...raw,
      // Allow either singular params or batch param_pairs; clamp both defensively
      temperature: raw.temperature !== undefined ? clamp01(raw.temperature) : undefined,
      top_p: raw.top_p !== undefined ? clamp01(raw.top_p) : undefined,
      param_pairs: Array.isArray(raw.param_pairs)
        ? raw.param_pairs.map(p => ({
            temperature: clamp01(p?.temperature),
            top_p: clamp01(p?.top_p),
          }))
        : undefined,
    };
    const target = `${BACKEND_URL.replace(/\/$/, '')}/test-prompt`;
    console.log('[api/test-prompt] Proxying to', target);
    const res = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const msg = await res.text();
      console.error('[api/test-prompt] Backend error', res.status, msg);
      return NextResponse.json({ error: msg || 'Backend error' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error('[api/test-prompt] Fetch failed:', e);
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
}
