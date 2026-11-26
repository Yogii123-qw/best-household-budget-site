[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Yogii123-qw/best-household-budget-site/rank.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Yogii123-qw/best-household-budget-site/reward.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)

# Hearth Ledger

Hearth Ledger is a household budget site that shows where every dollar goes and what is left for what matters. It tracks income, spending, budgets, bills, savings goals and an emergency fund for one household, with real figures for October and November 2026.

## What it does

The dashboard shows the month at a glance: income, spending, savings and what is left, a spending chart by category, budget health per category, upcoming bills, savings goals and recent transactions. The transactions page adds, edits and deletes entries, filters by category and searches descriptions. The budgets page compares each monthly budget with actual spending, flags categories that run over and suggests a fix. The bills page tracks every recurring bill with its due day and paid state. The planner splits take-home pay with the 50/30/20 rule, sizes an emergency fund from essential spending and tracks two savings goals. The reports page compares the last six months, names the top categories and writes a short insight from the numbers.

Every control works: the month switcher recomputes every number, the light and dark themes persist, and all edits save in the browser with localStorage. Nothing leaves the device and the site makes no network request.

## How to run

```sh
node serve.ts
```

Then open http://localhost:8080 in a browser. The site is plain static files under `app/` with no build step and no framework.

## Files

- `app/index.html`: page shell, header navigation, footer and mount point.
- `app/style.css`: design tokens, layout, components, light and dark themes.
- `app/main.js`: hash router, render dispatch and theme handling.
- `app/data.js`: seed household data for October and November 2026.
- `app/store.js`: state, localStorage persistence and computed totals.
- `app/views.js`: dashboard, transactions, budgets and bills pages.
- `app/tools.js`: 50/30/20 planner, emergency fund and savings goals.
- `app/reports.js`: six month reports and the insight paragraph.
- `app/charts.js`: hand drawn SVG bar and donut charts.

## License

MIT. See [LICENSE](LICENSE).
