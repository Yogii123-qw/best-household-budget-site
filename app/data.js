// Hearth Ledger seed data.
// One household, two adults and one child. Figures are monthly USD.
// All amounts are editable in the app; edits persist in localStorage.
export const HOUSEHOLD = {
  name: "Household budget",
  takeHome: 4850,
  adults: 2,
  children: 1,
  currency: "USD",
};

export const MONTHS = [
  { id: "2026-10", label: "October 2026" },
  { id: "2026-11", label: "November 2026" },
];

export const CATEGORIES = [
  { id: "housing", name: "Housing", color: "#0f766e", budget: 1450 },
  { id: "groceries", name: "Groceries", color: "#15803d", budget: 650 },
  { id: "transport", name: "Transport", color: "#1d4ed8", budget: 180 },
  { id: "utilities", name: "Utilities", color: "#b45309", budget: 380 },
  { id: "foodout", name: "Eating out", color: "#be185d", budget: 160 },
  { id: "childcare", name: "Child and school", color: "#7c3aed", budget: 220 },
  { id: "health", name: "Health", color: "#0891b2", budget: 180 },
  { id: "entertainment", name: "Entertainment", color: "#c2410c", budget: 90 },
  { id: "shopping", name: "Shopping", color: "#475569", budget: 150 },
];

export const INCOME = {
  "2026-10": [
    { id: "inc-oct-1", date: "2026-10-01", description: "Salary, first half", amount: 2900 },
    { id: "inc-oct-2", date: "2026-10-15", description: "Salary, second half", amount: 1950 },
  ],
  "2026-11": [
    { id: "inc-nov-1", date: "2026-11-01", description: "Salary, first half", amount: 2900 },
    { id: "inc-nov-2", date: "2026-11-15", description: "Salary, second half", amount: 1950 },
  ],
};

export const TRANSACTIONS = {
  "2026-10": [
    { id: "oct-01", date: "2026-10-01", description: "Rent, November lease month", category: "housing", amount: 1450 },
    { id: "oct-02", date: "2026-10-02", description: "Whole Foods Market, weekly shop", category: "groceries", amount: 178.2 },
    { id: "oct-03", date: "2026-10-03", description: "Electric bill, September usage", category: "utilities", amount: 121.4 },
    { id: "oct-04", date: "2026-10-04", description: "Fuel, Shell station", category: "transport", amount: 44.3 },
    { id: "oct-05", date: "2026-10-05", description: "School lunch, October", category: "childcare", amount: 64 },
    { id: "oct-06", date: "2026-10-06", description: "Pharmacy, vitamins and cold medicine", category: "health", amount: 29.5 },
    { id: "oct-07", date: "2026-10-07", description: "Streaming subscription", category: "entertainment", amount: 15.99 },
    { id: "oct-08", date: "2026-10-09", description: "Trader Joe's, weekly shop", category: "groceries", amount: 96.75 },
    { id: "oct-09", date: "2026-10-10", description: "Bus pass, monthly", category: "transport", amount: 55 },
    { id: "oct-10", date: "2026-10-11", description: "Pizza night, family dinner", category: "foodout", amount: 36.8 },
    { id: "oct-11", date: "2026-10-12", description: "Water bill", category: "utilities", amount: 58.9 },
    { id: "oct-12", date: "2026-10-14", description: "Internet, monthly", category: "utilities", amount: 79 },
    { id: "oct-13", date: "2026-10-15", description: "Costco, bulk groceries", category: "groceries", amount: 198.4 },
    { id: "oct-14", date: "2026-10-17", description: "Fuel, Shell station", category: "transport", amount: 39.6 },
    { id: "oct-15", date: "2026-10-18", description: "Dentist checkup copay", category: "health", amount: 60 },
    { id: "oct-16", date: "2026-10-20", description: "School supplies, notebooks", category: "childcare", amount: 31.2 },
    { id: "oct-17", date: "2026-10-21", description: "Groceries, midweek top up", category: "groceries", amount: 132.6 },
    { id: "oct-18", date: "2026-10-22", description: "Phone bill, two lines", category: "utilities", amount: 96 },
    { id: "oct-19", date: "2026-10-24", description: "Takeout, Thai restaurant", category: "foodout", amount: 38.5 },
    { id: "oct-20", date: "2026-10-26", description: "Winter jacket, child", category: "shopping", amount: 68.9 },
  ],
  "2026-11": [
    { id: "nov-01", date: "2026-11-01", description: "Rent, November lease month", category: "housing", amount: 1450 },
    { id: "nov-02", date: "2026-11-02", description: "Whole Foods Market, weekly shop", category: "groceries", amount: 186.4 },
    { id: "nov-03", date: "2026-11-03", description: "Electric bill, October usage", category: "utilities", amount: 128.75 },
    { id: "nov-04", date: "2026-11-04", description: "Fuel, Shell station", category: "transport", amount: 42.1 },
    { id: "nov-05", date: "2026-11-05", description: "School lunch, November", category: "childcare", amount: 64 },
    { id: "nov-06", date: "2026-11-06", description: "Pharmacy, prescription refill", category: "health", amount: 38.2 },
    { id: "nov-07", date: "2026-11-07", description: "Streaming subscription", category: "entertainment", amount: 15.99 },
    { id: "nov-08", date: "2026-11-08", description: "Trader Joe's, weekly shop", category: "groceries", amount: 92.35 },
    { id: "nov-09", date: "2026-11-09", description: "Bus pass, monthly", category: "transport", amount: 55 },
    { id: "nov-10", date: "2026-11-10", description: "Pizza night, family dinner", category: "foodout", amount: 34.5 },
    { id: "nov-11", date: "2026-11-12", description: "Water bill", category: "utilities", amount: 61.2 },
    { id: "nov-12", date: "2026-11-13", description: "Kids shoes, size 2", category: "shopping", amount: 47.99 },
    { id: "nov-13", date: "2026-11-14", description: "Internet, monthly", category: "utilities", amount: 79 },
    { id: "nov-14", date: "2026-11-15", description: "Costco, bulk groceries", category: "groceries", amount: 214.6 },
    { id: "nov-15", date: "2026-11-16", description: "Fuel, Shell station", category: "transport", amount: 38.75 },
    { id: "nov-16", date: "2026-11-17", description: "Dentist copay, filling", category: "health", amount: 85 },
    { id: "nov-17", date: "2026-11-18", description: "Movie night, two tickets", category: "entertainment", amount: 28 },
    { id: "nov-18", date: "2026-11-19", description: "School supplies, art class", category: "childcare", amount: 23.4 },
    { id: "nov-19", date: "2026-11-20", description: "Coffee shop, morning coffee", category: "foodout", amount: 12.8 },
    { id: "nov-20", date: "2026-11-21", description: "Groceries, midweek top up", category: "groceries", amount: 148.9 },
    { id: "nov-21", date: "2026-11-22", description: "Phone bill, two lines", category: "utilities", amount: 96 },
    { id: "nov-22", date: "2026-11-23", description: "Gym membership, monthly", category: "health", amount: 32 },
    { id: "nov-23", date: "2026-11-24", description: "Takeout, Thai restaurant", category: "foodout", amount: 41.25 },
    { id: "nov-24", date: "2026-11-25", description: "Fuel, Shell station", category: "transport", amount: 45.6 },
    { id: "nov-25", date: "2026-11-26", description: "Groceries, weekly shop", category: "groceries", amount: 121.45 },
    { id: "nov-26", date: "2026-11-26", description: "Kids haircut", category: "childcare", amount: 25 },
  ],
};

export const BILLS = [
  { id: "bill-rent", name: "Rent", amount: 1450, dueDay: 1, autopay: true },
  { id: "bill-electric", name: "Electric", amount: 128.75, dueDay: 5, autopay: false },
  { id: "bill-school", name: "School lunch", amount: 64, dueDay: 5, autopay: true },
  { id: "bill-stream", name: "Streaming", amount: 15.99, dueDay: 7, autopay: true },
  { id: "bill-water", name: "Water", amount: 61.2, dueDay: 12, autopay: false },
  { id: "bill-internet", name: "Internet", amount: 79, dueDay: 14, autopay: true },
  { id: "bill-insurance", name: "Home insurance", amount: 142, dueDay: 18, autopay: true },
  { id: "bill-phone", name: "Phone, two lines", amount: 96, dueDay: 22, autopay: false },
  { id: "bill-gym", name: "Gym membership", amount: 32, dueDay: 23, autopay: true },
];

export const GOALS = [
  { id: "goal-holiday", name: "Holiday fund", target: 1200, saved: 640, note: "Summer trip, flights and stay" },
  { id: "goal-washer", name: "New washing machine", target: 850, saved: 510, note: "Replace the old machine before winter" },
];

export const EMERGENCY_FUND = {
  monthsTarget: 3,
  saved: 2400,
  monthlyContribution: 300,
};

export const HISTORY = [
  { month: "Jun 2026", income: 4850, spent: 3980 },
  { month: "Jul 2026", income: 4850, spent: 4210 },
  { month: "Aug 2026", income: 4850, spent: 3875 },
  { month: "Sep 2026", income: 4850, spent: 4050 },
  { month: "Oct 2026", income: 4850, spent: 3890 },
  { month: "Nov 2026", income: 4850, spent: 0 },
];
