// Hearth Ledger reports: six-month comparison, top categories,
// daily averages, the biggest single expense, and a short insight
// paragraph written from the numbers, not from a template.
import { HISTORY } from "./data.js";
import { buildMonthlyBarChart, escapeHtml } from "./charts.js";
import {
  categoryTotals,
  formatMoney,
  formatMoneyShort,
  monthIncome,
  monthLabel,
  monthSpent,
  monthTransactions,
} from "./store.js";

export function renderReportsPage(state) {
  const income = monthIncome(state);
  const spent = monthSpent(state);
  const totals = categoryTotals(state).filter((t) => t.spent > 0).sort((a, b) => b.spent - a.spent);
  const top = totals[0];
  const daysInMonth = 26;
  const daily = spent / daysInMonth;
  const biggest = [...monthTransactions(state)].sort((a, b) => b.amount - a.amount)[0];
  const history = HISTORY.map((h) => (h.month === "Nov 2026" ? { ...h, spent } : h));
  const avgSpent = Math.round(history.reduce((sum, h) => sum + h.spent, 0) / history.length);
  const fullMonths = history.slice(0, -1);
  const bestMonth = fullMonths.reduce((best, h) => (h.spent < best.spent ? h : best), fullMonths[0]);
  const chartRows = history.map((h) => ({ label: h.month, income: h.income, spent: h.spent }));
  return `
  <section class="card">
    <h2>Reports, ${monthLabel(state)}</h2>
    <p class="card-note">Income ${formatMoney(income)}, spending ${formatMoney(spent)}, kept ${formatMoney(income - spent)}.</p>
    <div class="summary-row">
      <div class="stat-card"><div class="stat-label">Top category</div><div class="stat-value">${escapeHtml(top.name)}</div><div class="stat-sub">${formatMoney(top.spent)} this month</div></div>
      <div class="stat-card"><div class="stat-label">Average daily spend</div><div class="stat-value">${formatMoney(daily)}</div><div class="stat-sub">Over the first ${daysInMonth} days</div></div>
      <div class="stat-card"><div class="stat-label">Biggest single expense</div><div class="stat-value">${formatMoneyShort(biggest.amount)}</div><div class="stat-sub">${escapeHtml(biggest.description)}</div></div>
      <div class="stat-card"><div class="stat-label">6 month average spend</div><div class="stat-value">${formatMoney(avgSpent)}</div><div class="stat-sub">Lowest full month was ${bestMonth.month}, ${formatMoney(bestMonth.spent)}</div></div>
    </div>
  </section>
  <section class="card">
    <h2>Income vs spending, last 6 months</h2>
    <p class="card-note">Teal bars are income, orange bars are spending.</p>
    ${buildMonthlyBarChart(chartRows, 560)}
    <p class="card-note">Spending stayed below income in all six months. The gap is what the household keeps.</p>
  </section>
  <section class="card">
    <h2>Top spending categories</h2>
    <ol class="top-list">
      ${totals.slice(0, 5).map((t, i) => `<li><span class="top-rank">${i + 1}</span><span>${escapeHtml(t.name)}</span><span class="money">${formatMoney(t.spent)}</span><span class="muted">${Math.round((t.spent / spent) * 100)}% of spending</span></li>`).join("")}
    </ol>
  </section>
  <section class="card">
    <h2>What the numbers say</h2>
    <p class="insight">${buildInsightParagraph(state, totals, top, daily, biggest, bestMonth)}</p>
  </section>`;
}

export function buildInsightParagraph(state, totals, top, daily, biggest, bestMonth) {
  const spent = monthSpent(state);
  const income = monthIncome(state);
  const over = totals.filter((t) => t.over);
  const grocery = totals.find((t) => t.id === "groceries");
  const parts = [
    `${top.name} is the largest cost this month at ${formatMoney(top.spent)}, which is ${Math.round((top.spent / spent) * 100)} percent of all spending.`,
    `The household spends about ${formatMoney(daily)} a day and keeps ${formatMoney(income - spent)} of the ${formatMoney(income)} take-home pay.`,
  ];
  if (grocery && grocery.over) {
    parts.push(`Groceries ran ${formatMoney(grocery.spent - grocery.budget)} over budget, so the next weekly shop is the first place to pull back.`);
  }
  if (over.length > 1) {
    parts.push(`${over.length} categories are over budget in total, and the rest have room to cover them.`);
  }
  parts.push(`The cheapest full month in the last six was ${bestMonth.month} at ${formatMoney(bestMonth.spent)} spent, and the biggest single payment was ${formatMoney(biggest.amount)} for ${biggest.description.toLowerCase()}.`);
  return parts.join(" ");
}
