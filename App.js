// App.js
// The main file. It does three jobs:
//   1. Keeps ALL the data in state (useState)          - Lesson 4
//   2. Has the functions that add / edit / delete      - Lesson 1 + 2
//   3. Sets up the Stack Navigator with the 5 screens  - Lesson 5
//
// Screens:  Dashboard  <->  Transactions  <->  Budgets     (the 3 tabs)
//           Transactions -> TransactionForm
//           Budgets      -> BudgetForm

import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from './screens/DashboardScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import TransactionFormScreen from './screens/TransactionFormScreen';
import BudgetsScreen from './screens/BudgetsScreen';
import BudgetFormScreen from './screens/BudgetFormScreen';
import { starterCategories, starterTransactions, starterBudgets } from './data';
import { colors } from './helpers';

const Stack = createNativeStackNavigator();

export default function App() {
  // ---------- The data (transactions and budgets start empty) ----------
  const [categories, setCategories] = useState(starterCategories);
  const [transactions, setTransactions] = useState(starterTransactions);
  const [budgets, setBudgets] = useState(starterBudgets);
  const [toast, setToast] = useState(''); // the little message at the bottom

  // ---------- Toast: show a message for 2 seconds ----------
  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(''), 2000);
  }

  // ---------- Categories ----------
  function addCategory(name) {
    // (current) is always the newest list, even if something else changed in the same tap
    setCategories((current) => (current.includes(name) ? current : [...current, name]));
  }
 
  // Remove typed-in (custom) categories that nothing uses anymore.
  // The 8 starter categories are never removed.
  // We pass in the NEW lists, because the state variables still hold the old ones.
  function cleanCategories(newTransactions, newBudgets) {
    setCategories((current) =>
      current.filter((name) => {
        const isStarter = starterCategories.includes(name);
        const usedByTransaction = newTransactions.some((t) => t.category === name);
        const usedByBudget = newBudgets.some((b) => b.category === name);
        return isStarter || usedByTransaction || usedByBudget;
      })
    );
  }

  // ---------- Transactions ----------
  // If the item already has an id we UPDATE it, otherwise we ADD it.
  function saveTransaction(item) {
    let newList;
    if (item.id) {
      newList = transactions.map((t) => (t.id === item.id ? item : t));
      showToast('Transaction updated.');
    } else {
      newList = [{ ...item, id: Date.now() }, ...transactions];
      showToast('Transaction added.');
    }
    setTransactions(newList);
    cleanCategories(newList, budgets);
  }

  function deleteTransaction(id) {
    const newList = transactions.filter((t) => t.id !== id);
    setTransactions(newList);
    cleanCategories(newList, budgets);
    showToast('Transaction deleted.');
  }

  // ---------- Budgets ----------
  function saveBudget(item) {
    let newList;
    if (item.id) {
      newList = budgets.map((b) => (b.id === item.id ? item : b));
      showToast('Budget updated.');
    } else {
      newList = [{ ...item, id: Date.now() }, ...budgets];
      showToast('Budget added.');
    }
    setBudgets(newList);
    cleanCategories(transactions, newList);
  }

  function deleteBudget(id) {
    const newList = budgets.filter((b) => b.id !== id);
    setBudgets(newList);
    cleanCategories(transactions, newList);
    showToast('Budget deleted.');
  }

  // ---------- The screens ----------
  // A screen normally only receives "navigation" and "route".
  // To also give it our data, we write a small function inside <Stack.Screen>
  // and pass the data as props. {...props} keeps navigation and route.
  return (
    <View style={styles.root}>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Dashboard"
          screenOptions={{
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          {/* The three "tab" screens. animation: 'none' makes switching feel like tabs. */}
          <Stack.Screen name="Dashboard" options={{ animation: 'none' }}>
            {(props) => <DashboardScreen {...props} transactions={transactions} budgets={budgets} />}
          </Stack.Screen>

          <Stack.Screen name="Transactions" options={{ animation: 'none' }}>
            {(props) => (
              <TransactionsScreen
                {...props}
                transactions={transactions}
                categories={categories}
                onDelete={deleteTransaction}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Budgets" options={{ animation: 'none' }}>
            {(props) => (
              <BudgetsScreen {...props} budgets={budgets} transactions={transactions} onDelete={deleteBudget} />
            )}
          </Stack.Screen>

          {/* The two form screens slide up from the bottom. */}
          <Stack.Screen
            name="TransactionForm"
            options={({ route }) => ({
              title: route.params ? 'Edit Transaction' : 'Add Transaction',
              presentation: 'modal',
              animation: 'slide_from_bottom',
            })}
          >
            {(props) => (
              <TransactionFormScreen
                {...props}
                categories={categories}
                onAddCategory={addCategory}
                onSave={saveTransaction}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="BudgetForm"
            options={({ route }) => ({
              title: route.params ? 'Edit Budget' : 'Add Budget',
              presentation: 'modal',
              animation: 'slide_from_bottom',
            })}
          >
            {(props) => <BudgetFormScreen {...props} categories={categories} onSave={saveBudget} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>

      {/* The toast sits on top of every screen. It is only drawn when toast is not empty. */}
      {toast !== '' && (
        <View style={styles.toast} pointerEvents="none">
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 100,
    backgroundColor: colors.primaryDark,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    elevation: 10,
    zIndex: 10,
  },
  toastText: { color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' },
});