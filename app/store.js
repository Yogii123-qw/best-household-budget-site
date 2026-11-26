// Hearth Ledger state store.
// Loads the seed household data once, then keeps every edit in
// localStorage under one key. Month switching recomputes every number
// from the selected month only.
import {
  BILLS,
  CATEGORIES,
  EMERGENCY_FUND,
  GOALS,
  HOUSEHOLD,
  INCOME,
  MONTHS,
  TRANSACTIONS,
} from "./data.js";

export const STORAGE_KEY = "hearth-ledger-v1";

export function defaultState() {
  return {
    month: "2026-11",
    theme: "light",
    income: JSON.parse(JSON.stringify(INCOME)),
    transactions: JSON.parse(JSON.stringify(TRANSACTIONS)),
    bills: JSON.parse(JSON.stringify(BILLS)),
    paidBills: { "2026-10": ["bill-rent", "bill-electric", "bill-school", "bill-stream", "bill-water", "bill-internet", "bill-insurance", "bill-phone", "bill-gym"], "2026-11": ["bill-rent", "bill-electric", "bill-school", "bill-stream", "bill-internet"] },
    budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget])),
    categories: JSON.parse(JSON.stringify(CATEGORIES)),
    goals: JSON.parse(JSON.stringify(GOALS)),
    emergencyFund: JSON.parse(JSON.stringify(EMERGENCY_FUND)),
    takeHome: HOUSEHOLD.takeHome,
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.transactions || !parsed.month) return defaultState();
    return parsed;
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  const fresh = defaultState();
  saveState(fresh);
  return fresh;
}

export function setMonth(state, monthId) {
  if (!MONTHS.some((m) => m.id === monthId)) return state;
  state.month = monthId;
  saveState(state);
  return state;
}

export function monthLabel(state) {
  return (MONTHS.find((m) => m.id === state.month) || MONTHS[1]).label;
}

export function monthIncome(state) {
  return state.income[state.month].reduce((sum, row) => sum + row.amount, 0);
}

export function monthTransactions(state) {
  return [...state.transactions[state.month]].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function monthSpent(state) {
  return state.transactions[state.month].reduce((sum, row) => sum + row.amount, 0);
}

export function categorySpent(state, categoryId) {
  return state.transactions[state.month]
    .filter((row) => row.category === categoryId)
    .reduce((sum, row) => sum + row.amount, 0);
}

export function categoryTotals(state) {
  return state.categories.map((cat) => {
    const spent = categorySpent(state, cat.id);
    const budget = state.budgets[cat.id] ?? cat.budget;
    return { ...cat, spent, budget, left: budget - spent, over: spent > budget };
  });
}

export function addTransaction(state, row) {
  const id = "tx-" + Date.now().toString(36);
  const entry = { id, date: row.date, description: row.description, category: row.category, amount: Number(row.amount) };
  state.transactions[state.month].push(entry);
  saveState(state);
  return entry;
}

export function deleteTransaction(state, id) {
  state.transactions[state.month] = state.transactions[state.month].filter((row) => row.id !== id);
  saveState(state);
}

export function editBudget(state, categoryId, amount) {
  const value = Math.max(0, Math.round(Number(amount) || 0));
  state.budgets[categoryId] = value;
  saveState(state);
  return value;
}

export function addCategory(state, name, budget) {
  const id = "cat-" + Date.now().toString(36);
  const cat = { id, name, color: "#0f766e", budget: Math.max(0, Math.round(Number(budget) || 0)) };
  state.categories.push(cat);
  state.budgets[id] = cat.budget;
  saveState(state);
  return cat;
}

export function markBillPaid(state, billId) {
  const list = state.paidBills[state.month] || (state.paidBills[state.month] = []);
  if (!list.includes(billId)) list.push(billId);
  saveState(state);
}

export function markBillUnpaid(state, billId) {
  state.paidBills[state.month] = (state.paidBills[state.month] || []).filter((id) => id !== billId);
  saveState(state);
}

export function isBillPaid(state, billId) {
  return (state.paidBills[state.month] || []).includes(billId);
}

export function daysUntilDue(bill, today) {
  const due = new Date(today.getFullYear(), today.getMonth(), bill.dueDay);
  return Math.round((due - today) / 86400000);
}

export function upcomingBillsTotal(state) {
  return state.bills
    .filter((bill) => !isBillPaid(state, bill.id))
    .reduce((sum, bill) => sum + bill.amount, 0);
}

export function addGoalContribution(state, goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return null;
  goal.saved = Math.min(goal.target, goal.saved + Math.max(0, Number(amount) || 0));
  saveState(state);
  return goal;
}

export function setEmergencyContribution(state, amount) {
  state.emergencyFund.monthlyContribution = Math.max(0, Math.round(Number(amount) || 0));
  saveState(state);
}

export function computeFiftyThirtyTwenty(income) {
  return {
    needs: Math.round(income * 0.5 * 100) / 100,
    wants: Math.round(income * 0.3 * 100) / 100,
    savings: Math.round(income * 0.2 * 100) / 100,
  };
}

export function computeEmergencyFund(state) {
  const essentials = ["housing", "groceries", "utilities", "transport", "childcare", "health"];
  const monthlyEssential = essentials.reduce((sum, id) => sum + (state.budgets[id] || 0), 0);
  const target = monthlyEssential * state.emergencyFund.monthsTarget;
  const remaining = Math.max(0, target - state.emergencyFund.saved);
  const monthly = state.emergencyFund.monthlyContribution;
  const monthsToReach = monthly > 0 ? Math.ceil(remaining / monthly) : null;
  return { monthlyEssential, target, saved: state.emergencyFund.saved, remaining, monthly, monthsToReach };
}

export function formatMoney(amount) {
  return "$" + Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatMoneyShort(amount) {
  return "$" + Math.round(Number(amount)).toLocaleString("en-US");
}
