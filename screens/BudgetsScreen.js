// screens/BudgetsScreen.js  -  the Budgets tab
//
// A budget is a spending limit for one category in one month.
// "Spent" is not stored: we work it out from the transactions with
// getSpent() every time the screen is drawn.
//
//   Lesson 3: View, Text, Flexbox     Lesson 4: FlatList, touch events
//   Lesson 5: navigate + pass the budget as a parameter

import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import TabBar from '../components/TabBar';
import AddButton from '../components/AddButton';
import { colors, shadow, formatMoney, formatMonth, getSpent, getBudgetStatus } from '../helpers';

export default function BudgetsScreen({ navigation, budgets, transactions, onDelete }) {
  // Newest month first
  const sorted = [...budgets].sort((a, b) => b.month.localeCompare(a.month));

  function confirmDelete(item) {
    Alert.alert('Delete this budget?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(item.id) },
    ]);
  }

  // FlatList calls this once for every budget.
  function renderItem({ item }) {
    const spent = getSpent(transactions, item.category, item.month);
    const left = item.limit - spent;
    const status = getBudgetStatus(spent, item.limit); // { label, color }

    // The colored bar fills up as you spend (never wider than 100).
    let barWidth = (spent / item.limit) * 100;
    if (barWidth > 100) {
      barWidth = 100;
    }

    return (
      <View style={[styles.card, shadow]}>
        <View style={styles.row}>
          <View style={styles.info}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.small}>{formatMonth(item.month)}</Text>
          </View>
          {/* status.color + '22' makes a see-through version of the color */}
          <View style={[styles.pill, { backgroundColor: status.color + '22' }]}>
            <Text style={[styles.pillText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>

        <Text style={styles.spent}>
          {formatMoney(spent)} <Text style={styles.small}>of {formatMoney(item.limit)}</Text>
        </Text>

        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: barWidth + '%', backgroundColor: status.color }]} />
        </View>

        <View style={styles.row}>
          <Text style={[styles.left, left < 0 && { color: colors.expense }]}>
            {left < 0 ? formatMoney(-left) + ' over' : formatMoney(left) + ' left'}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => navigation.navigate('BudgetForm', { budget: item })}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDelete(item)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.body}>
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={sorted}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.empty}>No budgets yet. Tap + to add one and start tracking a category.</Text>
          }
        />

        <AddButton onPress={() => navigation.navigate('BudgetForm')} />
      </View>

      <TabBar navigation={navigation} active="Budgets" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1 },
  list: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 100 },
  empty: { textAlign: 'center', color: colors.muted, fontSize: 15, marginTop: 40 },

  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  info: { flex: 1, marginRight: 8 },
  category: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  small: { fontSize: 13, fontWeight: 'normal', color: colors.muted },
  pill: { borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10 },
  pillText: { fontSize: 12, fontWeight: 'bold' },
  spent: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginTop: 14 },

  barTrack: { height: 10, borderRadius: 5, backgroundColor: colors.background, overflow: 'hidden', marginVertical: 10 },
  barFill: { height: 10, borderRadius: 5 },

  left: { fontSize: 13, fontWeight: 'bold', color: colors.muted },
  actions: { flexDirection: 'row' },
  editText: { color: colors.primary, fontWeight: 'bold', marginRight: 20 },
  deleteText: { color: colors.expense, fontWeight: 'bold' },
});
