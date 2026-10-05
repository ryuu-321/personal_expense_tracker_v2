// screens/BudgetFormScreen.js  -  Add / Edit a budget
// Works exactly like TransactionFormScreen, just with fewer inputs.

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import CategoryChips from '../components/CategoryChips';
import MonthStepper from '../components/MonthStepper';
import { colors, getThisMonth } from '../helpers';

export default function BudgetFormScreen({ navigation, route, categories, onSave }) {
  // Came from "Edit"? Then route.params holds the budget.
  const editing = route.params ? route.params.budget : null;

  const [category, setCategory] = useState(editing ? editing.category : categories[0]);
  const [limit, setLimit] = useState(editing ? String(editing.limit) : '');
  const [month, setMonth] = useState(editing ? editing.month : getThisMonth());
  const [error, setError] = useState('');

  function handleSave() {
    const number = Number(limit);

    if (isNaN(number) || number <= 0) {
      setError('Budget amount must be a number greater than 0.');
      return;
    }

    onSave({
      id: editing ? editing.id : null,
      category: category,
      limit: number,
      month: month,
    });
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Category</Text>
      <CategoryChips categories={categories} selected={category} onSelect={setCategory} />

      <Text style={styles.label}>Budget amount</Text>
      <TextInput
        style={styles.input}
        value={limit}
        onChangeText={setLimit}
        placeholder="0.00"
        placeholderTextColor={colors.muted}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Month</Text>
      <MonthStepper month={month} onChange={setMonth} flat />

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
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },

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
