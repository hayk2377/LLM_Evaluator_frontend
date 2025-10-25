import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(req) {
  try {
    if (!BACKEND_URL) {
      return NextResponse.json({ error: 'BACKEND_URL env not configured' }, { status: 500 });
    }
    const payload = await req.json();
    const target = `${BACKEND_URL.replace(/\/$/, '')}/analytics`;
    console.log('[api/analytics] Proxying to', target);
    const res = await fetch(target, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const msg = await res.text();
      console.error('[api/analytics] Backend error', res.status, msg);
      return NextResponse.json({ error: msg || 'Backend error' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error('[api/analytics] Fetch failed:', e);
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
}
