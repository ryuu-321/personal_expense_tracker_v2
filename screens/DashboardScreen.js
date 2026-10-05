// screens/DashboardScreen.js  -  the Dashboard tab
//
// Shows the totals for one month. It only READS the data, it never changes it.
//   Lesson 2: functional components + props   Lesson 3: View, Text, ScrollView, Flexbox
//   Lesson 4: useState (which month is selected)

import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import TabBar from '../components/TabBar';
import MonthStepper from '../components/MonthStepper';
import { colors, shadow, formatMoney, getThisMonth } from '../helpers';

// A small component for one card. It is used 5 times below with different props.
// wide = true makes the card take the whole row.
function SummaryCard({ label, value, color, wide }) {
  return (
    <View style={[styles.card, shadow, wide && styles.cardWide]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={[styles.cardValue, { color: color }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

export default function DashboardScreen({ navigation, transactions, budgets }) {
  const [month, setMonth] = useState(getThisMonth());

  // ----- Work out the numbers for the selected month with simple loops -----
  let income = 0;
  let expenses = 0;
  const categoryTotals = {}; // example: { Food: 150, Bills: 899 }

  for (const t of transactions) {
    if (t.date.slice(0, 7) === month) {
      if (t.type === 'income') {
        income = income + t.amount;
      } else {
        expenses = expenses + t.amount;
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      }
    }
  }

  let totalBudget = 0;
  for (const b of budgets) {
    if (b.month === month) {
      totalBudget = totalBudget + b.limit;
    }
  }

  const balance = income - expenses;
  const budgetRemaining = totalBudget - expenses;

  // Category names, biggest spending first
  const categoryNames = Object.keys(categoryTotals);
  categoryNames.sort((a, b) => categoryTotals[b] - categoryTotals[a]);

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>₱</Text>
          </View>
          <View>
            <Text style={styles.appName}>Spend Wise</Text>
            <Text style={styles.tagline}>Spend smart, live better.</Text>
          </View>
        </View>

        <MonthStepper month={month} onChange={setMonth} />

        <View style={styles.grid}>
          <SummaryCard label="Total income" value={formatMoney(income)} color={colors.income} />
          <SummaryCard label="Total expenses" value={formatMoney(expenses)} color={colors.expense} />
          <SummaryCard
            label="Balance"
            value={formatMoney(balance)}
            color={balance < 0 ? colors.expense : colors.income}
          />
          <SummaryCard label="Total budget" value={formatMoney(totalBudget)} color={colors.text} />
          <SummaryCard
            label="Budget remaining"
            value={formatMoney(budgetRemaining)}
            color={budgetRemaining < 0 ? colors.expense : colors.text}
            wide
          />
        </View>

        <Text style={styles.sectionTitle}>Spending by category</Text>
        <View style={[styles.breakdown, shadow]}>
          {categoryNames.length === 0 && (
            <Text style={styles.empty}>No expenses recorded for this month yet.</Text>
          )}

          {categoryNames.map((name) => {
            // How wide is this bar compared to all expenses? (0 to 100)
            const barWidth = (categoryTotals[name] / expenses) * 100;

            return (
              <View key={name} style={styles.breakdownRow}>
                <Text style={styles.breakdownName}>{name}</Text>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: barWidth + '%' }]} />
                </View>
                <Text style={styles.breakdownAmount}>{formatMoney(categoryTotals[name])}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <TabBar navigation={navigation} active="Dashboard" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 30 },

  header: { 
     flexDirection: 'row',
     alignItems: 'center',
     marginBottom: 16
   },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  logoText: { fontSize: 30, fontWeight: 'bold', color: '#FFFFFF' },
  appName: { fontSize: 22, fontWeight: 'bold', color: colors.text },
  tagline: { fontSize: 13, color: colors.muted },

  // Flexbox: a row that wraps. Each card is 48% wide, so two fit on one line.
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 16, marginBottom: 14 },
  card: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  cardWide: { width: '100%' },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: 8 },
  cardLabel: { fontSize: 13, color: colors.muted, marginBottom: 2 },
  cardValue: { fontSize: 21, fontWeight: 'bold' },

  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  breakdown: { backgroundColor: colors.card, borderRadius: 16, padding: 16 },
  empty: { color: colors.muted, textAlign: 'center', paddingVertical: 16 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  breakdownName: { width: 100, fontSize: 13, fontWeight: '600', color: colors.text },
  track: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.background, overflow: 'hidden', marginHorizontal: 8 },
  fill: { height: 8, borderRadius: 4, backgroundColor: colors.primary },
  breakdownAmount: { width: 90, fontSize: 12, color: colors.muted, textAlign: 'right' },
});