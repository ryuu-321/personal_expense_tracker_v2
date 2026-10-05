// components/TabBar.js
// The bar with three buttons at the bottom of the Dashboard, Transactions
// and Budgets screens. Each screen shows it and says which one is "active".
//
// How it works: tapping a button calls navigation.replace('ScreenName'),
// which swaps the current screen for the new one.

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../helpers';

const TABS = [
  { name: 'Dashboard', icon: 'home' },
  { name: 'Transactions', icon: 'swap-vertical' },
  { name: 'Budgets', icon: 'pie-chart' },
];

export default function TabBar({ navigation, active }) {
  return (
    // SafeAreaView keeps the bar above the phone's own Android/iPhone buttons.
    <SafeAreaView edges={['bottom']} style={styles.bar}>
      <View style={styles.row}>
        {TABS.map((tab) => {
          const isActive = tab.name === active;
          const color = isActive ? colors.primary : colors.muted;

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => {
                if (!isActive) { 
                  navigation.replace(tab.name);
                }
              }}
            >
              <Ionicons name={tab.icon} size={24} color={color} />
              <Text style={[styles.label, { color: color }]}>{tab.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border },
  row: { flexDirection: 'row', paddingTop: 8, paddingBottom: 6 },
  tab: { flex: 1, alignItems: 'center' },
  label: { fontSize: 12, fontWeight: '600', marginTop: 3 },
});
