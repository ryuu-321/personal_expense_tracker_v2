// helpers.js
// Colors, plus small functions that more than one file uses.
// (Lesson 1: variables, loops, if-statements, functions.  Lesson 2: ES6 export.)

// ---------- Colors: change them here and the whole app changes ----------
export const colors = {
  primary: '#158063',
  primaryDark: '#0D5B46',
  light: '#E2F3ED',
  background: '#F5F7F6',
  card: '#FFFFFF',
  text: '#15231E',
  muted: '#6C7D75',
  income: '#158063',
  expense: '#DC4A3D',
  expenseLight: '#FCEAE8',
  warning: '#D99A00',
  orange: '#E07A2C',
  border: '#E6ECE9',
};

// A soft shadow for cards. Use it like this: style={[styles.card, shadow]}
export const shadow = {
  shadowColor: '#0D3B2E',
  shadowOpacity: 0.07,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};

// ---------- Money ----------

// 5000 -> "₱5,000.00"
export function formatMoney(amount) {
  const number = Number(amount);
  return '₱' + number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ---------- Dates ----------
// A date is text like "2026-09-30". A month is text like "2026-09".

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December', 
]; 

// Today as "2026-09-30"
export function getToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return now.getFullYear() + '-' + month + '-' + day; // logic san date arrangement
}

// This month as "2026-09"
export function getThisMonth() {
  return getToday().slice(0, 7);
}

// "2026-09" -> "September 2026"
export function formatMonth(month) {
  const name = MONTH_NAMES[Number(month.slice(5, 7)) - 1];
  return name + ' ' + month.slice(0, 4);
}

// "2026-09-02" -> "Sep 2, 2026"
export function formatDate(date) {
  const name = MONTH_NAMES[Number(date.slice(5, 7)) - 1].slice(0, 3);
  return name + ' ' + Number(date.slice(8, 10)) + ', ' + date.slice(0, 4);
}

// Move a month forward (change = 1) or back (change = -1).
// shiftMonth("2026-12", 1) -> "2027-01"
export function shiftMonth(month, change) {
  let year = Number(month.slice(0, 4));
  let number = Number(month.slice(5, 7)) + change;

  if (number > 12) {
    number = 1;
    year = year + 1;
  }
  if (number < 1) {
    number = 12;
    year = year - 1;
  }

  return year + '-' + String(number).padStart(2, '0'); // logic san  bago san month sa dashboard
}

// Is the text a real-looking date like "2026-09-30"?
export function isValidDate(text) {
  if (text.length !== 10 || text[4] !== '-' || text[7] !== '-') {
    return false;
  }
  const year = Number(text.slice(0, 4));
  const month = Number(text.slice(5, 7));
  const day = Number(text.slice(8, 10));

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return false;
  }
  return month >= 1 && month <= 12 && day >= 1 && day <= 31;
}

// ---------- Budgets ----------

// How much was spent on one category in one month?
// We look at every transaction and add up the ones that match.
export function getSpent(transactions, category, month) {
  let total = 0;

  for (const t of transactions) {
    const isExpense = t.type === 'expense';
    const sameCategory = t.category === category;
    const sameMonth = t.date.slice(0, 7) === month;

    if (isExpense && sameCategory && sameMonth) {
      total = total + t.amount;
    }
  }

  return total;
}

// How close to the limit? Returns the label and color to show.
export function getBudgetStatus(spent, limit) {
  const percent = (spent / limit) * 100;

  if (percent >= 100) {
    return { label: 'Exceeded', color: colors.expense };
  }
  if (percent >= 90) {
    return { label: 'Almost exceeded', color: colors.orange };
  }
  if (percent >= 70) {
    return { label: 'Approaching limit', color: colors.warning };
  }
  return { label: 'Within budget', color: colors.primary };
}
