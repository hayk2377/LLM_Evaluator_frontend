export const DELTA = 0.25;

export const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 5);

export const getComparisonSets = ({ mode, baseTemperature, baseTopP, customSets }) => {
  const sanitize = (val) => Math.min(1.0, Math.max(0.0, val));
  if (mode === 'custom') {
    return customSets.map((set, index) => ({ label: `Custom ${index + 1}`, T: sanitize(set.T), P: sanitize(set.P) }));
  }
  const T = baseTemperature;
  const P = baseTopP;
  return [
    { label: 'Baseline (User Set)', T: sanitize(T), P: sanitize(P) },
    { label: `High Temp (+${DELTA})`, T: sanitize(T + DELTA), P: sanitize(P) },
    { label: `Low Temp (-${DELTA})`, T: sanitize(T - DELTA), P: sanitize(P) },
    { label: `High Top-P (+${DELTA})`, T: sanitize(T), P: sanitize(P + DELTA) },
    { label: `Low Top-P (-${DELTA})`, T: sanitize(T), P: sanitize(P - DELTA) },
  ];
};

// Simple color scale from red (low) to green (high)
export const valueToColor = (v, min = 0, max = 100) => {
  const safe = Math.max(min, Math.min(max, v));
  const t = (safe - min) / (max - min || 1);
  const hue = 120 * t; // legacy red->green
  return `hsl(${hue}, 75%, ${40 + 20 * (1 - Math.abs(t - 0.5) * 2)}%)`;
};

// Five-stop palette: dark red -> red -> green -> blue -> deep blue
// Stops: 0.00 #7f1d1d, 0.25 #ef4444, 0.50 #22c55e, 0.75 #3b82f6, 1.00 #1e3a8a
export const valueToColorFiveStop = (v, min = 0, max = 100) => {
  const safe = Math.max(min, Math.min(max, v));
  const t = (safe - min) / (max - min || 1);
  const stops = [
    { p: 0.00, c: [127, 29, 29] },   // #7f1d1d dark red
    { p: 0.25, c: [239, 68, 68] },   // #ef4444 red
    { p: 0.50, c: [34, 197, 94] },   // #22c55e green
    { p: 0.75, c: [59, 130, 246] },  // #3b82f6 blue
    { p: 1.00, c: [30, 58, 138] },   // #1e3a8a deep blue
  ];
  // Find segment
  let i = 0;
  while (i < stops.length - 1 && t > stops[i + 1].p) i++;
  const a = stops[i];
  const b = stops[Math.min(i + 1, stops.length - 1)];
  const span = (b.p - a.p) || 1e-6;
  const lt = (t - a.p) / span;
  const rc = Math.round(a.c[0] + (b.c[0] - a.c[0]) * lt);
  const gc = Math.round(a.c[1] + (b.c[1] - a.c[1]) * lt);
  const bc = Math.round(a.c[2] + (b.c[2] - a.c[2]) * lt);
  return `rgb(${rc}, ${gc}, ${bc})`;
};
