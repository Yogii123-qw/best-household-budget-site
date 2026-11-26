// Hearth Ledger planner: the 50/30/20 split, the emergency fund
// calculator, and the savings goal tracker. Every figure is computed
// live from the household income and the current month's spending.
import { buildDonutChart, escapeHtml } from "./charts.js";
import {
  addGoalContribution,
  categorySpent,
  computeEmergencyFund,
  computeFiftyThirtyTwenty,
  formatMoney,
  formatMoneyShort,
  monthSpent,
  setEmergencyContribution,
} from "./store.js";

export function renderPlannerPage(state) {
  const income = state.takeHome;
  const plan = computeFiftyThirtyTwenty(income);
  const needsActual = ["housing", "groceries", "utilities", "transport", "childcare", "health"]
    .reduce((sum, id) => sum + categorySpent(state, id), 0);
  const wantsActual = ["foodout", "entertainment", "shopping"]
    .reduce((sum, id) => sum + categorySpent(state, id), 0);
  const savedActual = income - monthSpent(state);
  const fund = computeEmergencyFund(state);
  const donut = buildDonutChart([
    { label: "Needs", value: plan.needs, color: "#0f766e" },
    { label: "Wants", value: plan.wants, color: "#b45309" },
    { label: "Savings", value: plan.savings, color: "#15803d" },
  ], 180);
  const rows = [
    { name: "Needs", target: plan.needs, actual: needsActual, color: "#0f766e", hint: "Housing, groceries, utilities and transport.", goodWhenOver: false },
    { name: "Wants", target: plan.wants, actual: wantsActual, color: "#b45309", hint: "Eating out, entertainment and shopping.", goodWhenOver: false },
    { name: "Savings", target: plan.savings, actual: savedActual, color: "#15803d", hint: "Whatever is left after spending this month.", goodWhenOver: true },
  ];
  return `
  <div class="planner-layout">
  <section class="card">
    <h2>50/30/20 planner</h2>
    <p class="card-note">Split the monthly take-home pay of ${formatMoney(income)} into needs, wants and savings.</p>
    <form class="tx-form" data-form="income">
      <label>Monthly take-home pay ($) <input type="number" name="income" min="0" step="1" value="${income}" required></label>
      <button type="submit" class="btn">Update income</button>
    </form>
    <div class="planner-grid">
      <div>${donut}
        <div class="legend">
          <span><i style="background:#0f766e"></i>Needs 50%</span>
          <span><i style="background:#b45309"></i>Wants 30%</span>
          <span><i style="background:#15803d"></i>Savings 20%</span>
        </div>
      </div>
      <ul class="plan-list">
        ${rows.map((r) => {
          const diff = r.actual - r.target;
          const over = diff > 0;
          const stateText = over
            ? (r.goodWhenOver
              ? formatMoney(diff) + " over target. Extra savings, keep it up."
              : formatMoney(diff) + " over target. Cut it next month.")
            : formatMoney(-diff) + " under target.";
          return `<li>
            <div class="budget-row"><span class="plan-name" style="color:${r.color}">${r.name}</span><span class="money">${formatMoney(r.target)}</span></div>
            <p class="plan-hint">${r.hint}</p>
            <div class="budget-row"><span class="muted">Actual this month</span><span class="money">${formatMoney(r.actual)}</span></div>
            <div class="budget-state ${over && !r.goodWhenOver ? "warn" : ""}">${stateText}</div>
          </li>`;
        }).join("")}
      </ul>
    </div>
  </section>
  <section class="card">
    <h2>Emergency fund</h2>
    <p class="card-note">Essential spending is ${formatMoney(fund.monthlyEssential)} a month. The target is ${state.emergencyFund.monthsTarget} months of essentials.</p>
    <div class="summary-row stat-2col">
      <div class="stat-card"><div class="stat-label">Target</div><div class="stat-value">${formatMoney(fund.target)}</div><div class="stat-sub">${state.emergencyFund.monthsTarget} months of essentials</div></div>
      <div class="stat-card"><div class="stat-label">Saved so far</div><div class="stat-value">${formatMoney(fund.saved)}</div><div class="stat-sub">${Math.round((fund.saved / fund.target) * 100)}% of the target</div></div>
      <div class="stat-card"><div class="stat-label">Still to save</div><div class="stat-value">${formatMoney(fund.remaining)}</div><div class="stat-sub">At ${formatMoney(fund.monthly)} a month</div></div>
      <div class="stat-card"><div class="stat-label">Months to reach it</div><div class="stat-value">${fund.monthsToReach === null ? "Set a contribution" : fund.monthsToReach + " months"}</div><div class="stat-sub">Raise the monthly amount to get there sooner</div></div>
    </div>
    <div class="bar big"><div class="bar-fill goal" style="width:${Math.min(100, Math.round((fund.saved / fund.target) * 100))}%"></div></div>
    <form class="tx-form" data-form="emergency">
      <label>Monthly contribution ($) <input type="number" name="contribution" min="0" step="10" value="${fund.monthly}" required></label>
      <button type="submit" class="btn">Update contribution</button>
    </form>
  </section>
  </div>
  <section class="card">
    <h2>Savings goals</h2>
    <ul class="goal-page-list goal-cols">
      ${state.goals.map((g) => {
        const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
        return `<li>
          <div class="budget-row"><span class="goal-name">${escapeHtml(g.name)}</span><span class="money">${formatMoney(g.saved)} <span class="muted">of ${formatMoneyShort(g.target)}</span></span></div>
          <p class="plan-hint">${escapeHtml(g.note)}</p>
          <div class="bar"><div class="bar-fill goal" style="width:${pct}%"></div></div>
          <form class="goal-form" data-form="goal" data-goal="${g.id}">
            <label>Add to this goal ($) <input type="number" name="amount" min="1" step="1" value="50" required></label>
            <button type="submit" class="btn">Add contribution</button>
          </form>
        </li>`;
      }).join("")}
    </ul>
  </section>`;
}

export function bindPlannerForms(state, rerender) {
  const incomeForm = document.querySelector('[data-form="income"]');
  if (incomeForm) {
    incomeForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = Math.max(0, Math.round(Number(new FormData(incomeForm).get("income")) || 0));
      state.takeHome = value;
      rerender("Income updated to " + formatMoney(value) + ".");
    });
  }
  const fundForm = document.querySelector('[data-form="emergency"]');
  if (fundForm) {
    fundForm.addEventListener("submit", (event) => {
      event.preventDefault();
      setEmergencyContribution(state, Number(new FormData(fundForm).get("contribution")));
      rerender("Monthly contribution updated.");
    });
  }
  document.querySelectorAll('[data-form="goal"]').forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      addGoalContribution(state, form.dataset.goal, Number(new FormData(form).get("amount")));
      rerender("Contribution added to the goal.");
    });
  });
}
