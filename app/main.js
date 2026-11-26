// Hearth Ledger router and shell.
// Hash routes reach every page by link. After each render the
// __shotReady flag is set so screenshot scripts know the page settled.
import { loadState, saveState, setMonth, resetState } from "./store.js";
import {
  bindBillButtons,
  bindDeleteButtons,
  bindTransactionForm,
  renderBillsPage,
  renderBudgetsPage,
  renderDashboard,
  renderTransactionsPage,
} from "./views.js";
import { bindPlannerForms, renderPlannerPage } from "./tools.js";
import { renderReportsPage } from "./reports.js";

const state = loadState();
let filter = { category: "", q: "" };

export function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  const button = document.querySelector('[data-action="theme"]');
  if (button) button.textContent = state.theme === "dark" ? "Light theme" : "Dark theme";
}

export function setMonthAndRerender(monthId) {
  setMonth(state, monthId);
  render();
}

export function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toast._timer);
  toast._timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

export function render() {
  const app = document.querySelector("#app");
  const hash = window.location.hash || "#/";
  const route = hash.replace(/^#/, "") || "/";
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + route || (route === "/" && link.getAttribute("href") === "#/"));
  });
  let html = "";
  if (route === "/") html = renderDashboard(state);
  else if (route === "/transactions") html = renderTransactionsPage(state, filter);
  else if (route === "/budgets") html = renderBudgetsPage(state);
  else if (route === "/bills") html = renderBillsPage(state);
  else if (route === "/planner") html = renderPlannerPage(state);
  else if (route === "/reports") html = renderReportsPage(state);
  else html = `<section class="card"><h2>Page not found</h2><p class="card-note">That page does not exist. Use the navigation above to go back.</p><a class="btn" href="#/">Back to dashboard</a></section>`;
  app.innerHTML = html;
  applyTheme();
  bindTransactionForm(state, (message) => {
    render();
    if (message) showToast(message);
  });
  bindDeleteButtons(state, (message) => {
    render();
    if (message) showToast(message);
  });
  bindBillButtons(state, (message) => {
    render();
    if (message) showToast(message);
  });
  bindPlannerForms(state, (message) => {
    saveState(state);
    render();
    if (message) showToast(message);
  });
  document.querySelectorAll('[data-action="reset"]').forEach((button) => {
    button.addEventListener("click", () => {
      const fresh = resetState();
      Object.assign(state, fresh);
      filter = { category: "", q: "" };
      render();
      showToast("Sample data restored.");
    });
  });
  document.querySelectorAll('[data-action="clear-filters"]').forEach((button) => {
    button.addEventListener("click", () => {
      filter = { category: "", q: "" };
      render();
    });
  });
  document.querySelectorAll('[data-filter="category"]').forEach((select) => {
    select.addEventListener("change", () => {
      filter.category = select.value;
      render();
    });
  });
  document.querySelectorAll('[data-filter="q"]').forEach((input) => {
    input.addEventListener("input", () => {
      filter.q = input.value;
      render();
    });
  });
  window.__shotReady = true;
}

export function initShell() {
  const monthSelect = document.querySelector("#month-select");
  if (monthSelect) {
    monthSelect.value = state.month;
    monthSelect.addEventListener("change", () => setMonthAndRerender(monthSelect.value));
  }
  const themeButton = document.querySelector('[data-action="theme"]');
  if (themeButton) {
    themeButton.addEventListener("click", () => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      saveState(state);
      render();
    });
  }
  window.addEventListener("hashchange", render);
  applyTheme();
  render();
}

initShell();
