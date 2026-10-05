// screens/TransactionFormScreen.js  -  Add / Edit a transaction
//
// One screen does both jobs:
//   - Opened with the "+" button  -> no parameters -> empty form
//   - Opened with "Edit"          -> route.params.transaction -> filled form
//
//   Lesson 4: useState for every input, TextInput, touch events
//   Lesson 5: receiving parameters (route.params) and going back

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import CategoryChips from '../components/CategoryChips';
import { colors, getToday, isValidDate } from '../helpers';

export default function TransactionFormScreen({ navigation, route, categories, onAddCategory, onSave }) {
  // If we came from "Edit", route.params holds the transaction. Otherwise it is empty.
  const editing = route.params ? route.params.transaction : null;

  // One piece of state per input. The starting value depends on add vs edit.
  const [type, setType] = useState(editing ? editing.type : 'expense');
  const [amount, setAmount] = useState(editing ? String(editing.amount) : '');
  const [category, setCategory] = useState(editing ? editing.category : categories[0]);
  const [newCategory, setNewCategory] = useState('');
  const [description, setDescription] = useState(editing ? editing.description : '');
  const [date, setDate] = useState(editing ? editing.date : getToday());
  const [error, setError] = useState('');

  function handleSave() {
    const number = Number(amount);

    // Check the inputs. If something is wrong, show a message and stop.
    if (isNaN(number) || number <= 0) {
      setError('Amount must be a number greater than 0.');
      return;
    }
    if (description.trim() === '') {
      setError('Please enter a description.');
      return;
    }
    if (!isValidDate(date)) {
      setError('Date must look like 2026-09-30.');
      return;
    }

    // A typed-in new category wins over the chip that was selected.
    let finalCategory = category;
    if (newCategory.trim() !== '') {
      finalCategory = newCategory.trim();
      onAddCategory(finalCategory);
    }

    // Everything is fine: hand the data to App.js, then go back to the list.
    onSave({
      id: editing ? editing.id : null,
      type: type,
      amount: number,
      category: finalCategory,
      description: description.trim(),
      date: date,
    });
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Type</Text>
      <View style={styles.segment}>
        <TouchableOpacity
          style={[styles.segmentButton, type === 'expense' && { backgroundColor: colors.expense }]}
          onPress={() => setType('expense')}
        >
          <Text style={[styles.segmentText, type === 'expense' && styles.segmentTextActive]}>Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentButton, type === 'income' && { backgroundColor: colors.income }]}
          onPress={() => setType('income')}
        >
          <Text style={[styles.segmentText, type === 'income' && styles.segmentTextActive]}>Income</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={[styles.input, styles.amountInput]}
        value={amount}
        onChangeText={setAmount}
        placeholder="0.00"
        placeholderTextColor={colors.muted}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Category</Text>
      <CategoryChips categories={categories} selected={category} onSelect={setCategory} />
      <TextInput
        style={styles.input}
        value={newCategory}
        onChangeText={setNewCategory}
        placeholder="Or type a new category (optional)"
        placeholderTextColor={colors.muted}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="e.g. Grocery run"
        placeholderTextColor={colors.muted}
      />

      <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
      <View style={styles.dateRow}>
        <TextInput
          style={[styles.input, styles.dateInput]}
          value={date}
          onChangeText={setDate}
          placeholder="2026-09-30"
          placeholderTextColor={colors.muted}
        />
        <TouchableOpacity style={styles.todayButton} onPress={() => setDate(getToday())}>
          <Text style={styles.todayText}>Today</Text>
        </TouchableOpacity>
      </View>

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      <View style={styles.buttons}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.card },
  content: { padding: 20, paddingBottom: 40 },

  label: { fontSize: 13, fontWeight: 'bold', color: colors.muted, marginTop: 16, marginBottom: 8 },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  amountInput: { fontSize: 24, fontWeight: 'bold', paddingVertical: 14 },

  segment: { flexDirection: 'row', backgroundColor: colors.background, borderRadius: 16, padding: 4 },
  segmentButton: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  segmentText: { fontWeight: 'bold', color: colors.muted },
  segmentTextActive: { color: '#FFFFFF' },

  dateRow: { flexDirection: 'row', alignItems: 'center' },
  dateInput: { flex: 1, marginRight: 8 },
  todayButton: { backgroundColor: colors.light, borderRadius: 12, paddingVertical: 13, paddingHorizontal: 16 },
  todayText: { color: colors.primaryDark, fontWeight: 'bold' },

  error: {
    marginTop: 16,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.expenseLight,
    color: colors.expense,
    fontWeight: 'bold',
  },

  buttons: { flexDirection: 'row', marginTop: 24 },
  button: { flex: 1, paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  cancelButton: { backgroundColor: colors.background, marginRight: 8 },
  cancelText: { color: colors.text, fontWeight: 'bold' },
  saveButton: { backgroundColor: colors.primary },
  saveText: { color: '#FFFFFF', fontWeight: 'bold' },
});
