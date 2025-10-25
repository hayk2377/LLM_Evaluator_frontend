import { NextResponse } from 'next/server';

// Minimal pass-through to backend /evaluate; Gemini is handled in backend only.
const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(req) {
  try {
    if (!BACKEND_URL) {
      return NextResponse.json({ error: 'BACKEND_URL env not configured' }, { status: 500 });
    }
    // Sanitize payload: clamp temperature/top_p to [0,1] if present
    const raw = await req.json();
    const clamp01 = (v) => {
      const n = Number(v);
      if (!isFinite(n)) return 0;
      return Math.max(0, Math.min(1, n));
    };
    const payload = {
      ...raw,
      temperature: raw.temperature !== undefined ? clamp01(raw.temperature) : undefined,
      top_p: raw.top_p !== undefined ? clamp01(raw.top_p) : undefined,
    };
    const res = await fetch(`${BACKEND_URL.replace(/\/$/, '')}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const msg = await res.text();
      return NextResponse.json({ error: msg || 'Backend error' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
}
