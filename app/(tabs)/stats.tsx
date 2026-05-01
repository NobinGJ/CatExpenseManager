import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useExpenses } from "@/hooks/useExpenses";
import { useExpenseStats } from "@/hooks/useExpenseStats";
import { Colors, Spacing, BorderRadius, FontSize } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import CatHeader from "@/components/CatHeader";
import EmptyState from "@/components/EmptyState";

export default function StatsScreen() {
  const { expenses, dailyTotal, monthlyTotal, generalTotal } = useExpenses();
  const { categoryStats, monthlyBreakdown } = useExpenseStats(expenses);
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];

  const maxCategoryTotal = categoryStats.length > 0
    ? Math.max(...categoryStats.map((c) => c.total))
    : 1;

  if (expenses.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.md }}>
          <CatHeader title="Estadísticas" subtitle="Analiza tus gastos" />
        </View>
        <EmptyState message="Aún no hay datos para mostrar" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <CatHeader title="Estadísticas" subtitle="Analiza tus gastos" />

        {/* Overview cards */}
        <View style={styles.overviewRow}>
          {[
            { label: "Hoy", value: dailyTotal, emoji: "☀️", color: colors.primary },
            { label: "Mes", value: monthlyTotal, emoji: "📅", color: colors.secondary },
            { label: "Total", value: generalTotal, emoji: "💰", color: "#81C784" },
          ].map((item, i) => (
            <View
              key={i}
              style={[
                styles.overviewCard,
                { backgroundColor: colors.surface, borderColor: colors.borderLight },
              ]}
            >
              <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
              <Text style={[styles.overviewValue, { color: colors.text }]}>
                ${item.value.toFixed(0)}
              </Text>
              <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Category breakdown */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Por Categoría 🐾
        </Text>
        <View style={[styles.categoryCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
          {categoryStats.map((cat, i) => (
            <View key={cat.id}>
              <View style={styles.catRow}>
                <View style={styles.catLeft}>
                  <Text style={{ fontSize: 20 }}>{cat.emoji}</Text>
                  <View style={{ marginLeft: Spacing.sm }}>
                    <Text style={[styles.catName, { color: colors.text }]}>
                      {cat.name}
                    </Text>
                    <Text style={[styles.catCount, { color: colors.textTertiary }]}>
                      {cat.count} gasto{cat.count !== 1 ? "s" : ""}
                    </Text>
                  </View>
                </View>
                <View style={styles.catRight}>
                  <Text style={[styles.catTotal, { color: colors.text }]}>
                    ${cat.total.toFixed(2)}
                  </Text>
                  <Text style={[styles.catPercent, { color: colors.textSecondary }]}>
                    {cat.percentage.toFixed(1)}%
                  </Text>
                </View>
              </View>
              {/* Progress bar */}
              <View style={[styles.barBg, { backgroundColor: colors.surfaceAlt }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      backgroundColor: cat.color,
                      width: `${(cat.total / maxCategoryTotal) * 100}%`,
                    },
                  ]}
                />
              </View>
              {i < categoryStats.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
              )}
            </View>
          ))}
        </View>

        {/* Monthly breakdown */}
        {monthlyBreakdown.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Por Mes 📊
            </Text>
            <View style={[styles.categoryCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              {monthlyBreakdown.map((m, i) => (
                <View key={m.key}>
                  <View style={styles.monthRow}>
                    <Text style={[styles.monthLabel, { color: colors.text }]}>
                      {m.label}
                    </Text>
                    <Text style={[styles.monthTotal, { color: colors.text }]}>
                      ${m.total.toFixed(2)}
                    </Text>
                  </View>
                  {i < monthlyBreakdown.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
                  )}
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  overviewRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  overviewCard: {
    flex: 1,
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  overviewValue: {
    fontSize: FontSize.lg,
    fontWeight: "800",
    marginTop: 4,
  },
  overviewLabel: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    marginBottom: Spacing.md,
  },
  categoryCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  catRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  catLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  catName: {
    fontSize: FontSize.md,
    fontWeight: "600",
  },
  catCount: {
    fontSize: FontSize.xs,
  },
  catRight: {
    alignItems: "flex-end",
  },
  catTotal: {
    fontSize: FontSize.md,
    fontWeight: "700",
  },
  catPercent: {
    fontSize: FontSize.xs,
  },
  barBg: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: Spacing.sm,
  },
  barFill: {
    height: "100%",
    borderRadius: 3,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  monthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  monthLabel: {
    fontSize: FontSize.md,
    fontWeight: "500",
  },
  monthTotal: {
    fontSize: FontSize.md,
    fontWeight: "700",
  },
});
