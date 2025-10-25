// Client-side API helper to talk to Next API which forwards to your backend.

// Batch test prompt across parameter pairs
export async function postPromptTest({ prompt, model, param_pairs }) {
  const res = await fetch('/api/test-prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model, param_pairs })
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Backend error ${res.status}: ${msg}`);
  }
  const data = await res.json();
  // Support either bare array or { results: [...] }
  return Array.isArray(data) ? data : (data.results || []);
}

// Fetch analytics (averages per (T,P) pair). We mirror the batch request body for clarity.
export async function postAnalytics({ prompt, model, param_pairs }) {
  const res = await fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model, param_pairs })
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Backend error ${res.status}: ${msg}`);
  }
  const data = await res.json();
  // Backend returns an object with scatter_data, model_comparison, and kpi
  return data;
}
