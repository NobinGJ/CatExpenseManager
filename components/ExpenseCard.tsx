import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getCategoryById } from "@/constants/categories";
import { Colors, Spacing, BorderRadius, FontSize } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Expense } from "@/services/expenseService";

interface Props {
  expense: Expense;
  onPress?: () => void;
}

export default function ExpenseCard({ expense, onPress }: Props) {
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];
  const category = getCategoryById(expense.categoria);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.borderLight,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View
        style={[
          styles.emojiContainer,
          { backgroundColor: category.color + "18" },
        ]}
      >
        <Text style={styles.emoji}>{category.emoji}</Text>
      </View>

      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {expense.titulo}
        </Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {formatDate(expense.fecha)} · {category.name}
        </Text>
      </View>

      <View style={styles.amounts}>
        <Text style={[styles.total, { color: colors.text }]}>
          ${expense.total.toFixed(2)}
        </Text>
        {expense.impuesto > 0 && (
          <Text style={[styles.tax, { color: colors.textTertiary }]}>
            imp. ${expense.impuesto.toFixed(2)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  emojiContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 22,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: "600",
  },
  date: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  amounts: {
    alignItems: "flex-end",
  },
  total: {
    fontSize: FontSize.md,
    fontWeight: "700",
  },
  tax: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
});
