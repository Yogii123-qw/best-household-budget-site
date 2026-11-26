// Hearth Ledger hand-drawn SVG charts.
// No chart library: every bar and arc is built from the numbers here,
// so the first load stays small and the charts are part of the source.
export function buildCategoryBarChart(rows, width) {
  const w = width || 560;
  const rowH = 27;
  const h = rows.length * rowH + 8;
  const max = Math.max(...rows.map((r) => r.value), 1);
  const labelW = 118;
  const valueW = 74;
  const barW = w - labelW - valueW;
  const bars = rows
    .map((row, i) => {
      const y = 8 + i * rowH;
      const bw = Math.max(2, (row.value / max) * barW);
      return (
        `<text x="0" y="${y + 15}" class="chart-label">${escapeHtml(row.label)}</text>` +
        `<rect x="${labelW}" y="${y}" width="${bw}" height="20" rx="5" fill="${row.color}" />` +
        `<text x="${labelW + bw + 8}" y="${y + 15}" class="chart-value">${row.text}</text>`
      );
    })
    .join("");
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="Spending by category bar chart">${bars}</svg>`;
}

export function buildDonutChart(segments, size) {
  const s = size || 220;
  const cx = s / 2;
  const cy = s / 2;
  const r = s / 2 - 14;
  const total = segments.reduce((sum, seg) => sum + seg.value, 0) || 1;
  let angle = -90;
  const arcs = segments
    .map((seg) => {
      const frac = seg.value / total;
      const start = angle;
      angle += frac * 360;
      const end = angle;
      const large = end - start > 180 ? 1 : 0;
      const x1 = cx + r * Math.cos((start * Math.PI) / 180);
      const y1 = cy + r * Math.sin((start * Math.PI) / 180);
      const x2 = cx + r * Math.cos((end * Math.PI) / 180);
      const y2 = cy + r * Math.sin((end * Math.PI) / 180);
      return `<path d="M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="${seg.color}" />`;
    })
    .join("");
  const hole = `<circle cx="${cx}" cy="${cy}" r="${r * 0.58}" fill="var(--bg-surface)" />`;
  return `<svg viewBox="0 0 ${s} ${s}" width="${s}" height="${s}" role="img" aria-label="Budget split donut chart">${arcs}${hole}</svg>`;
}

export function buildMonthlyBarChart(rows, width) {
  const w = width || 560;
  const h = 220;
  const max = Math.max(...rows.map((r) => Math.max(r.income, r.spent)), 1);
  const n = rows.length;
  const slot = w / n;
  const barW = Math.min(34, slot * 0.32);
  const bars = rows
    .map((row, i) => {
      const x = i * slot + slot / 2;
      const incomeH = (row.income / max) * 150;
      const spentH = (row.spent / max) * 150;
      return (
        `<rect x="${(x - barW - 3).toFixed(1)}" y="${(185 - incomeH).toFixed(1)}" width="${barW}" height="${incomeH.toFixed(1)}" rx="4" fill="#0f766e" />` +
        `<rect x="${(x + 3).toFixed(1)}" y="${(185 - spentH).toFixed(1)}" width="${barW}" height="${spentH.toFixed(1)}" rx="4" fill="#c2410c" />` +
        `<text x="${x.toFixed(1)}" y="205" class="chart-label chart-center">${escapeHtml(row.label)}</text>`
      );
    })
    .join("");
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="Monthly income and spending bar chart">${bars}</svg>`;
}

export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
