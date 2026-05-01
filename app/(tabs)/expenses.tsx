import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useExpenses } from "@/hooks/useExpenses";
import { Colors, Spacing, BorderRadius, FontSize } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import ExpenseCard from "@/components/ExpenseCard";
import EmptyState from "@/components/EmptyState";
import CatHeader from "@/components/CatHeader";
import { Expense } from "@/services/expenseService";

export default function ExpensesScreen() {
  const { expenses, loading, remove } = useExpenses();
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];

  const [search, setSearch] = useState("");
  const [filterMonth, setFilterMonth] = useState<number | null>(null);

  const months = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
  ];

  const filtered = useMemo(() => {
    let result = expenses;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.titulo.toLowerCase().includes(q) ||
          e.categoria.toLowerCase().includes(q)
      );
    }
    if (filterMonth !== null) {
      result = result.filter((e) => new Date(e.fecha).getMonth() === filterMonth);
    }
    return result;
  }, [expenses, search, filterMonth]);

  const handleDelete = (expense: Expense) => {
    Alert.alert(
      "Eliminar gasto",
      `¿Seguro que deseas eliminar "${expense.titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => remove(expense.id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <CatHeader
          title="Mis Gastos"
          subtitle={`${expenses.length} gastos registrados`}
        />

        {/* Search */}
        <View
          style={[
            styles.searchBox,
            { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
          ]}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar gastos..."
            placeholderTextColor={colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Text style={{ fontSize: 16, color: colors.textTertiary }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Month filter */}
        <FlatList
          horizontal
          data={months}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.monthFilter}
          keyExtractor={(item, i) => String(i)}
          renderItem={({ item, index }) => {
            const active = filterMonth === index;
            return (
              <TouchableOpacity
                onPress={() => setFilterMonth(active ? null : index)}
                style={[
                  styles.monthChip,
                  {
                    backgroundColor: active ? colors.primary : colors.surfaceAlt,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.monthChipText,
                    { color: active ? "#FFF" : colors.textSecondary },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* Expense list */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ExpenseCard
              expense={item}
              onPress={() => router.push(`/expense/${item.id}`)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              message={
                search || filterMonth !== null
                  ? "No se encontraron gastos 🔍"
                  : "No hay gastos registrados"
              }
            />
          }
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      </View>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => router.push("/expense/add")}
        activeOpacity={0.85}
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            shadowColor: colors.primaryDark,
          },
        ]}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    paddingVertical: 12,
    fontWeight: "500",
  },
  monthFilter: {
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  monthChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  monthChipText: {
    fontSize: FontSize.xs,
    fontWeight: "600",
  },
  list: {
    paddingBottom: Spacing.xxl,
  },
  fab: {
    position: "absolute",
    bottom: 90,
    right: Spacing.lg,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  fabText: {
    fontSize: 30,
    color: "#FFFFFF",
    fontWeight: "600",
    marginTop: -2,
  },
});
