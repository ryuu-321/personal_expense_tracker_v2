// components/MonthStepper.js
// "<  September 2026  >"  - two arrows that move to the previous / next month.
// Used on the Dashboard and in the Budget form.
//
// Props: month ("2026-09"), onChange (called with the new month),
//        flat (true = grey background, used inside forms)

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadow, formatMonth, shiftMonth } from '../helpers';

export default function MonthStepper({ month, onChange, flat }) {
  return (
    <View style={[styles.box, flat ? styles.flat : shadow]}>
      <TouchableOpacity style={styles.arrow} onPress={() => onChange(shiftMonth(month, -1))}>
        <Ionicons name="chevron-back" size={20} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.text}>{formatMonth(month)}</Text>

      <TouchableOpacity style={styles.arrow} onPress={() => onChange(shiftMonth(month, 1))}>
        <Ionicons name="chevron-forward" size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 4,
  },
  flat: { backgroundColor: colors.background },
  arrow: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 16, fontWeight: 'bold', color: colors.text },
});
