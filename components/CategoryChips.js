// components/CategoryChips.js
// A row of tappable category buttons that wraps onto more lines when needed.
// Used in both forms.
//
// Props: categories (list of names), selected (the chosen name),
//        onSelect (called with the name that was tapped)

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../helpers';

export default function CategoryChips({ categories, selected, onSelect }) {
  return (
    <View style={styles.row}>
      {categories.map((name) => (
        <TouchableOpacity
          key={name}
          style={[styles.chip, selected === name && styles.chipActive]}
          onPress={() => onSelect(name)}
        >
          {/* logic to display and change the color of the text when the chip is selected */}
          <Text style={[styles.text, selected === name && styles.textActive]}>{name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: colors.primary },
  text: { fontSize: 14, color: colors.text },
  textActive: { color: '#FFFFFF', fontWeight: 'bold' },
});
