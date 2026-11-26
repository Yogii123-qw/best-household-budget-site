// Hearth Ledger pages: dashboard, transactions, budgets.
// Each render function returns HTML for one hash route. All numbers
// come from the store, so the month switcher recomputes every page.
import { buildCategoryBarChart, escapeHtml } from "./charts.js";
import {
  addCategory,
  addTransaction,
  categoryTotals,
  daysUntilDue,
  deleteTransaction,
  editBudget,
  formatMoney,
  formatMoneyShort,
  isBillPaid,
  markBillPaid,
  markBillUnpaid,
  monthIncome,
  monthLabel,
  monthSpent,
  monthTransactions,
  upcomingBillsTotal,
} from "./store.js";

export function renderDashboard(state) {
  const income = monthIncome(state);
  const spent = monthSpent(state);
  const saved = income - spent;
  const billsLeft = upcomingBillsTotal(state);
  const left = income - spent - billsLeft;
  const totals = categoryTotals(state).sort((a, b) => b.spent - a.spent);
  const chartRows = totals
    .filter((t) => t.spent > 0)
    .map((t) => ({ label: t.name, value: t.spent, color: t.color, text: formatMoneyShort(t.spent) }));
  const bills = state.bills.filter((b) => !isBillPaid(state, b.id));
  const recent = monthTransactions(state).slice(0, 4);
  const summary = [
    { label: "Income, " + monthLabel(state), value: formatMoney(income), sub: "Take-home pay, two salaries" },
    { label: "Spent", value: formatMoney(spent), sub: totals.filter((t) => t.spent > 0).length + " categories with spending" },
    { label: "Saved", value: formatMoney(saved), sub: Math.round((saved / income) * 100) + "% of income kept" },
    { label: "Left to spend", value: formatMoney(left), sub: "After " + formatMoney(billsLeft) + " in upcoming bills" },
  ];
  return `
  <section class="summary-row" aria-label="Month summary">
    ${summary.map((s) => `<div class="stat-card"><div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div><div class="stat-sub">${s.sub}</div></div>`).join("")}
  </section>
  <div class="dash-grid">
    <section class="card chart-card">
      <h2>Spending by category</h2>
      <p class="card-note">${monthLabel(state)}, ${formatMoney(spent)} spent in total</p>
      ${buildCategoryBarChart(chartRows, 400)}
    </section>
    <section class="card">
      <h2>Budget health</h2>
      <p class="card-note">Budget vs actual, ${monthLabel(state)}</p>
      <ul class="budget-list">
        ${totals.slice(0, 4).map((t) => {
          const pct = Math.min(100, Math.round((t.spent / t.budget) * 100));
          return `<li><div class="budget-row"><span>${escapeHtml(t.name)}</span><span class="money">${formatMoney(t.spent)} <span class="muted">of ${formatMoneyShort(t.budget)}</span></span></div>
          <div class="bar"><div class="bar-fill ${t.over ? "over" : ""}" style="width:${pct}%"></div></div>
          <div class="budget-state ${t.over ? "warn" : ""}">${t.over ? "Over budget by " + formatMoney(t.spent - t.budget) : formatMoney(t.left) + " left"}</div></li>`;
        }).join("")}
      </ul>
      <a class="card-link" href="#/budgets">See all budgets</a>
    </section>
    <section class="card">
      <h2>Upcoming bills</h2>
      <p class="card-note">${formatMoney(upcomingBillsTotal(state))} still to pay this month</p>
      <ul class="bill-list">
        ${bills.map((b) => `<li><span>${escapeHtml(b.name)}</span><span class="money">${formatMoney(b.amount)}</span><span class="muted">due day ${b.dueDay}</span></li>`).join("")}
      </ul>
      <a class="card-link" href="#/bills">See all bills</a>
      <h2 class="stack-heading">Savings goals</h2>
      <ul class="goal-list">
        ${state.goals.map((g) => {
          const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
          return `<li><div class="budget-row"><span>${escapeHtml(g.name)}</span><span class="money">${formatMoney(g.saved)} <span class="muted">of ${formatMoneyShort(g.target)}</span></span></div>
          <div class="bar"><div class="bar-fill goal" style="width:${pct}%"></div></div></li>`;
        }).join("")}
      </ul>
      <a class="card-link" href="#/planner">Plan savings</a>
    </section>
  </div>
  <section class="card">
    <h2>Recent transactions</h2>
    <table class="tx-table">
      <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th></tr></thead>
      <tbody>
        ${recent.map((t) => `<tr><td>${t.date.slice(5)}</td><td>${escapeHtml(t.description)}</td><td>${categoryName(state, t.category)}</td><td class="num money">${formatMoney(t.amount)}</td></tr>`).join("")}
      </tbody>
    </table>
    <a class="card-link" href="#/transactions">See all transactions</a>
  </section>
  <p class="sample-note">Sample household data. Edits save in this browser. <button class="link-btn" data-action="reset">Reset sample data</button></p>`;
}

export function renderTransactionsPage(state, filter) {
  const all = monthTransactions(state);
  const q = (filter.q || "").toLowerCase();
  const rows = all.filter((t) => {
    const catOk = !filter.category || t.category === filter.category;
    const qOk = !q || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
    return catOk && qOk;
  });
  const total = rows.reduce((sum, t) => sum + t.amount, 0);
  return `
  <section class="card">
    <h2>Transactions, ${monthLabel(state)}</h2>
    <p class="card-note">${rows.length} of ${all.length} shown. Total ${formatMoney(total)}.</p>
    <form class="tx-form" data-form="add-tx">
      <label>Date <input type="date" name="date" value="2026-11-26" required></label>
      <label>Description <input type="text" name="description" placeholder="Where the money went" required maxlength="80"></label>
      <label>Category <select name="category">${state.categories.map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join("")}</select></label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <button type="submit" class="btn">Add transaction</button>
    </form>
    <div class="filters">
      <label>Filter by category
        <select data-filter="category">
          <option value="">All categories</option>
          ${state.categories.map((c) => `<option value="${c.id}" ${filter.category === c.id ? "selected" : ""}>${escapeHtml(c.name)}</option>`).join("")}
        </select>
      </label>
      <label>Search
        <input type="search" data-filter="q" value="${escapeHtml(filter.q || "")}" placeholder="Search description">
      </label>
    </div>
    ${rows.length === 0 ? `<div class="empty-state"><p>No transactions match this search.</p><button class="btn" data-action="clear-filters">Clear search and filters</button></div>` : `
    <table class="tx-table">
      <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
      <tbody>
        ${rows.map((t) => `<tr><td>${t.date.slice(5)}</td><td>${escapeHtml(t.description)}</td><td>${categoryName(state, t.category)}</td><td class="num money">${formatMoney(t.amount)}</td><td><button class="btn-ghost" data-action="delete-tx" data-id="${t.id}">Delete</button></td></tr>`).join("")}
      </tbody>
    </table>`}
    <p class="card-note">Running total for the shown rows: <strong class="money">${formatMoney(total)}</strong></p>
  </section>`;
}

export function renderBudgetsPage(state) {
  const totals = categoryTotals(state);
  const over = totals.filter((t) => t.over);
  return `
  <section class="card">
    <h2>Budgets, ${monthLabel(state)}</h2>
    <p class="card-note">Monthly budget vs actual spending. Edit any budget inline.</p>
    ${over.length > 0 ? `<div class="alert"><strong>${over.length} categor${over.length === 1 ? "y is" : "ies are"} over budget.</strong> ${over.map((t) => escapeHtml(t.name) + " is over by " + formatMoney(t.spent - t.budget)).join(", ")}. Move money from a category with room left, or raise the budget if the spending was planned.</div>` : `<div class="ok-note">Every category is inside its budget this month.</div>`}
    <ul class="budget-page-list">
      ${totals.map((t) => {
        const pct = Math.min(100, Math.round((t.spent / t.budget) * 100));
        return `<li class="budget-page-row">
          <div class="budget-page-head"><span class="budget-name">${escapeHtml(t.name)}</span>
          <span class="money">${formatMoney(t.spent)} <span class="muted">of ${formatMoneyShort(t.budget)}</span></span></div>
          <div class="bar"><div class="bar-fill ${t.over ? "over" : ""}" style="width:${pct}%"></div></div>
          <div class="budget-page-foot"><span class="${t.over ? "warn" : ""}">${t.over ? "Over by " + formatMoney(t.spent - t.budget) : formatMoney(t.left) + " left"}</span>
          <label class="budget-edit">Budget $ <input type="number" min="0" step="1" value="${t.budget}" data-budget="${t.id}" aria-label="Budget for ${escapeHtml(t.name)}"></label></div>
        </li>`;
      }).join("")}
    </ul>
    <form class="tx-form" data-form="add-category">
      <label>New category <input type="text" name="name" placeholder="Category name" required maxlength="40"></label>
      <label>Monthly budget ($) <input type="number" name="budget" min="0" step="1" placeholder="100" required></label>
      <button type="submit" class="btn">Add category</button>
    </form>
  </section>`;
}

export function renderBillsPage(state) {
  const today = new Date(2026, 10, 26);
  const rows = state.bills.map((bill) => {
    const paid = isBillPaid(state, bill.id);
    const days = daysUntilDue(bill, today);
    return { ...bill, paid, days };
  });
  const unpaid = rows.filter((b) => !b.paid);
  const paid = rows.filter((b) => b.paid);
  const unpaidTotal = unpaid.reduce((sum, b) => sum + b.amount, 0);
  const paidTotal = paid.reduce((sum, b) => sum + b.amount, 0);
  const autoBills = rows.filter((b) => b.autopay);
  const handBills = rows.filter((b) => !b.autopay);
  const autoTotal = autoBills.reduce((sum, b) => sum + b.amount, 0);
  const handTotal = handBills.reduce((sum, b) => sum + b.amount, 0);
  const rowHtml = (b) => `<li class="bill-row ${b.paid ? "is-paid" : ""}">
    <div class="bill-main"><span class="bill-name">${escapeHtml(b.name)}</span>
    <span class="muted">${b.autopay ? "Autopay on" : "Pay by hand"}</span></div>
    <span class="money">${formatMoney(b.amount)}</span>
    <span class="bill-due">Due day ${b.dueDay}</span>
    <span class="bill-days ${b.paid ? "" : b.days <= 7 ? "warn" : ""}">${b.paid ? "Paid" : b.days === 0 ? "Due today" : b.days < 0 ? "Overdue by " + (-b.days) + " days" : b.days + " days left"}</span>
    <button class="btn ${b.paid ? "btn-ghost" : ""}" data-action="toggle-bill" data-id="${b.id}">${b.paid ? "Mark unpaid" : "Mark paid"}</button>
  </li>`;
  const urgent = [...unpaid].sort((a, b) => a.days - b.days)[0];
  const urgentSub = !urgent ? "Every bill is paid" : urgent.days === 0 ? "Due today" : urgent.days < 0 ? "Overdue by " + (-urgent.days) + " days" : "Due in " + urgent.days + " days";
  return `
  <section class="card">
    <h2>Bills, ${monthLabel(state)}</h2>
    <p class="card-note">Recurring household bills. Mark a bill paid when the money leaves the account.</p>
    <div class="summary-row">
      <div class="stat-card"><div class="stat-label">Still to pay</div><div class="stat-value">${formatMoney(unpaidTotal)}</div><div class="stat-sub">${unpaid.length} bills unpaid</div></div>
      <div class="stat-card"><div class="stat-label">Paid this month</div><div class="stat-value">${formatMoney(paidTotal)}</div><div class="stat-sub">${paid.length} bills paid</div></div>
      <div class="stat-card"><div class="stat-label">Monthly bill total</div><div class="stat-value">${formatMoney(unpaidTotal + paidTotal)}</div><div class="stat-sub">${state.bills.length} recurring bills</div></div>
      <div class="stat-card"><div class="stat-label">Next due</div><div class="stat-value">${unpaid.length ? escapeHtml(urgent.name) : "None"}</div><div class="stat-sub">${urgentSub}</div></div>
    </div>
    <p class="card-note">Autopay covers ${autoBills.length} bills (${formatMoney(autoTotal)} a month). ${handBills.length} bills are paid by hand (${formatMoney(handTotal)}).</p>
  </section>
  <section class="card">
    <h2>Upcoming bills</h2>
    ${unpaid.length === 0 ? `<div class="ok-note">Every bill is paid for this month.</div>` : `<ul class="bill-page-list">${unpaid.sort((a, b) => a.days - b.days).map(rowHtml).join("")}</ul>`}
  </section>
  <section class="card">
    <h2>Paid bills</h2>
    ${paid.length === 0 ? `<div class="empty-state"><p>No bills paid yet this month.</p></div>` : `<ul class="bill-page-list">${paid.map(rowHtml).join("")}</ul>`}
  </section>`;
}

export function bindBillButtons(state, rerender) {
  document.querySelectorAll('[data-action="toggle-bill"]').forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      if (isBillPaid(state, id)) markBillUnpaid(state, id);
      else markBillPaid(state, id);
      rerender("Bill updated.");
    });
  });
}

export function categoryName(state, categoryId) {
  const cat = state.categories.find((c) => c.id === categoryId);
  return cat ? cat.name : categoryId;
}

export function bindTransactionForm(state, rerender) {
  const form = document.querySelector('[data-form="add-tx"]');
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      addTransaction(state, {
        date: String(data.get("date")),
        description: String(data.get("description")),
        category: String(data.get("category")),
        amount: Number(data.get("amount")),
      });
      rerender("Transaction added.");
    });
  }
  const catForm = document.querySelector('[data-form="add-category"]');
  if (catForm) {
    catForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(catForm);
      addCategory(state, String(data.get("name")), Number(data.get("budget")));
      rerender("Category added.");
    });
  }
  document.querySelectorAll("[data-budget]").forEach((input) => {
    input.addEventListener("change", () => {
      editBudget(state, input.dataset.budget, input.value);
      rerender("Budget updated.");
    });
  });
}

export function bindDeleteButtons(state, rerender) {
  document.querySelectorAll('[data-action="delete-tx"]').forEach((button) => {
    button.addEventListener("click", () => {
      deleteTransaction(state, button.dataset.id);
      rerender("Transaction deleted.");
    });
  });
}
