# MCO1: App Interface Prototype - Personal Expense Tracker

A simple offline prototype. The data is **hardcoded** in `data.js` and kept in
`useState`, so you can add, edit and delete items while the app is open.
Closing the app resets it to the starter data.

## Run it

```bash
npm install
npx expo start -c
```

Scan the QR code with Expo Go.

## Files

```
index.js                       starts the app (rarely edited)
App.js                         data (useState) + add/edit/delete functions + Stack Navigator
data.js                        hardcoded starter categories, transactions, budgets
helpers.js                     colors, peso format, date + budget helper functions
components/                    small pieces used by more than one screen
  TabBar.js                      the Dashboard / Transactions / Budgets bar at the bottom
  MonthStepper.js                "<  September 2026  >"
  CategoryChips.js               tap-to-pick category buttons
  AddButton.js                   the round green "+" button
screens/                       one file per screen
  DashboardScreen.js             totals for a month + spending by category
  TransactionsScreen.js          list + search + filters + sort
  TransactionFormScreen.js       add / edit a transaction
  BudgetsScreen.js               budget cards with progress bars
  BudgetFormScreen.js            add / edit a budget
```

Screen flow:
`Dashboard <-> Transactions <-> Budgets` (the bottom bar), then
`Transactions -> TransactionForm` and `Budgets -> BudgetForm`.

## Where each lesson is used

| Lesson | Topic | Where to see it |
| --- | --- | --- |
| 1 | Procedural concepts (variables, loops, if, functions) | `helpers.js`, the totals loop in `DashboardScreen.js` |
| 1 | OOP concept: objects with properties | every transaction / budget in `data.js` |
| 2 | ES6+ (arrow functions, `map`, `filter`, spread `...`, `import/export`) | `App.js` save/delete functions |
| 2 | Anatomy of a functional component | any file in `screens/` and `components/` |
| 3 | JSX, View, Text, TextInput, ScrollView, StyleSheet | all screens |
| 3 | Flexbox (`flex`, `flexDirection`, `flexWrap`, `justifyContent`, `alignItems`) | the `styles` in each file; the wrapping cards in `DashboardScreen.js` |
| 4 | Touch events (`onPress`) | every `TouchableOpacity` |
| 4 | Text input (`onChangeText`) | search box and form inputs |
| 4 | `useState` | `App.js` (data), `DashboardScreen.js` (month), form screens (inputs) |
| 4 | `FlatList` | `TransactionsScreen.js`, `BudgetsScreen.js` |
| 5 | Stack Navigator | `App.js` |
| 5 | Moving between screens | `navigation.navigate(...)`, `navigation.replace(...)` in `TabBar.js`, `navigation.goBack()` |
| 5 | Passing parameters | `navigate('TransactionForm', { transaction: item })` -> `route.params.transaction` |
