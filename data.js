// data.js
// The HARDCODED starter data. Every transaction and budget is an object
// (Lesson 1: an object has properties like description and amount).
// App.js loads these into state, so you can add, edit and delete them
// while the app is open. Closing the app resets back to this list.

import { getThisMonth } from './helpers';

export const starterCategories = [
  'Food',
  'Transportation',
  'Education',
  'Bills',
  'Entertainment',
  'Shopping',
  'Health',
  'Other',
];

// The sample data uses the current month, so the Dashboard always shows numbers.
export const starterTransactions = [];

export const starterBudgets = [];