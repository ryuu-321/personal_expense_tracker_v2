// screens/TransactionsScreen.js  -  the Transactions tab
//
// A list of all transactions with a search box, filters and a sort button.
//   Lesson 4: useState, TextInput, FlatList, touch events
//   Lesson 5: navigate to the form and pass the transaction as a parameter

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Alert, StyleSheet } from 'react-native';
import TabBar from '../components/TabBar';
import AddButton from '../components/AddButton';
import { colors, shadow, formatMoney, formatDate } from '../helpers';

const TYPE_FILTERS = [
  { value: '', label: 'All types' },
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
];

const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest first' },
  { key: 'oldest', label: 'Oldest first' },
  { key: 'highest', label: 'Highest amount' },
  { key: 'lowest', label: 'Lowest amount' },
];

// A small component for one filter button.
function FilterChip({ label, active, onPress }) {
  return (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function TransactionsScreen({ navigation, transactions, categories, onDelete }) {
  // What the user typed / tapped. Changing any of these re-draws the screen.
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortIndex, setSortIndex] = useState(0);

  const sort = SORT_OPTIONS[sortIndex];

  // Step 1: keep only the transactions that match the search and the filters.
  const filtered = transactions.filter((t) => {
    const text = (t.description + ' ' + t.category).toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());
    const matchesType = typeFilter === '' || t.type === typeFilter;
    const matchesCategory = categoryFilter === '' || t.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  // Step 2: sort a copy of the list.
  const shown = [...filtered].sort((a, b) => {
    if (sort.key === 'newest') return b.date.localeCompare(a.date);
    if (sort.key === 'oldest') return a.date.localeCompare(b.date);
    if (sort.key === 'highest') return b.amount - a.amount;
    return a.amount - b.amount;
  });

  // Ask first, then delete.
  function confirmDelete(item) {
    Alert.alert('Delete this transaction?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(item.id) },
    ]);
  }

  // FlatList calls this once for every item in "shown".
  function renderItem({ item }) {
    const isExpense = item.type === 'expense';
    const color = isExpense ? colors.expense : colors.income;

    return (
      <View style={[styles.card, shadow]}>
        <View style={styles.row}>
          <View style={[styles.avatar, { backgroundColor: isExpense ? colors.expenseLight : colors.light }]}>
            <Text style={[styles.avatarText, { color: color }]}>{item.category.charAt(0).toUpperCase()}</Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.small}>
              {item.category} • {formatDate(item.date)}
            </Text>
          </View>

          <Text style={[styles.amount, { color: color }]}>
            {isExpense ? '-' : '+'}
            {formatMoney(item.amount)}
          </Text>
        </View>

        <View style={styles.actions}>
          {/* Pass the whole transaction to the form as a parameter */}
          <TouchableOpacity onPress={() => navigation.navigate('TransactionForm', { transaction: item })}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => confirmDelete(item)}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.body}>
        <View style={styles.top}>
          <TextInput
            style={[styles.search, shadow]}
            value={search}
            onChangeText={setSearch}
            placeholder="Search description or category"
            placeholderTextColor={colors.muted}
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {TYPE_FILTERS.map((f) => (
              <FilterChip
                key={f.label}
                label={f.label}
                active={typeFilter === f.value}
                onPress={() => setTypeFilter(f.value)}
              />
            ))}
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            <FilterChip label="All categories" active={categoryFilter === ''} onPress={() => setCategoryFilter('')} />
            {categories.map((name) => (
              <FilterChip
                key={name}
                label={name}
                active={categoryFilter === name}
                onPress={() => setCategoryFilter(name)}
              />
            ))}
          </ScrollView>

          {/* Each tap moves to the next sort option */}
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setSortIndex((sortIndex + 1) % SORT_OPTIONS.length)}
          >
            <Text style={styles.sortText}>Sort: {sort.label}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={shown}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.empty}>
                {transactions.length === 0 ? 'No transactions yet.' : 'No transactions match your search or filters.'}
              </Text>
            </View>
          }
        />

        <AddButton onPress={() => navigation.navigate('TransactionForm')} />
      </View>

      <TabBar navigation={navigation} active="Transactions" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1 },

  top: { padding: 16, paddingBottom: 4 },
  search: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.text,
  },
  chipRow: { marginTop: 10, flexGrow: 0 },
  chip: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  chipActive: { backgroundColor: colors.primary },
  chipText: { fontSize: 13, color: colors.text },
  chipTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
  sortButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.light,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  sortText: { fontSize: 12, fontWeight: 'bold', color: colors.primaryDark },

  list: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 100 },
  emptyBox: { paddingVertical: 40 },
  empty: { textAlign: 'center', color: colors.muted, fontSize: 15 },

  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 17, fontWeight: 'bold' },
  info: { flex: 1, marginRight: 8 },
  description: { fontSize: 15, fontWeight: 'bold', color: colors.text },
  small: { fontSize: 12, color: colors.muted, marginTop: 3 },
  amount: { fontSize: 16, fontWeight: 'bold' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  editText: { color: colors.primary, fontWeight: 'bold', marginRight: 20 },
  deleteText: { color: colors.expense, fontWeight: 'bold' },
});
