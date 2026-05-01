import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useExpenses } from "@/hooks/useExpenses";
import { Colors, Spacing, BorderRadius, FontSize } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import SummaryCard from "@/components/SummaryCard";
import ExpenseCard from "@/components/ExpenseCard";
import EmptyState from "@/components/EmptyState";

export default function DashboardScreen() {
  const { user, signOut } = useAuth();
  const { expenses, loading, dailyTotal, monthlyTotal, generalTotal } = useExpenses();
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];

  const recentExpenses = expenses.slice(0, 5);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const firstName = user?.displayName?.split(" ")[0] || "Usuario";

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={{ fontSize: 40, marginBottom: Spacing.md }}>🐱</Text>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Cargando tus gastos...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <FlatList
        data={recentExpenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                  {getGreeting()} 🐾
                </Text>
                <Text style={[styles.userName, { color: colors.text }]}>
                  {firstName}
                </Text>
              </View>
              <TouchableOpacity
                onPress={signOut}
                style={[styles.avatarBtn, { backgroundColor: colors.primaryLight }]}
              >
                <Text style={{ fontSize: 22 }}>😺</Text>
              </TouchableOpacity>
            </View>

            {/* Summary Cards */}
            <View style={styles.summaryRow}>
              <SummaryCard
                title="Hoy"
                amount={dailyTotal}
                icon="☀️"
                accentColor={colors.primary}
              />
              <View style={{ width: Spacing.sm }} />
              <SummaryCard
                title="Este mes"
                amount={monthlyTotal}
                icon="📅"
                accentColor={colors.secondary}
              />
            </View>

            {/* General Total */}
            <View
              style={[
                styles.totalCard,
                {
                  backgroundColor: colors.primary,
                  shadowColor: colors.primaryDark,
                },
              ]}
            >
              <View style={styles.totalLeft}>
                <Text style={styles.totalLabel}>Total general</Text>
                <Text style={styles.totalAmount}>${generalTotal.toFixed(2)}</Text>
              </View>
              <Text style={styles.totalEmoji}>🐱</Text>
            </View>

            {/* Recent header */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Gastos recientes
              </Text>
              {expenses.length > 5 && (
                <TouchableOpacity onPress={() => router.push("/(tabs)/expenses")}>
                  <Text style={[styles.seeAll, { color: colors.primary }]}>
                    Ver todos →
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <ExpenseCard
            expense={item}
            onPress={() => router.push(`/expense/${item.id}`)}
          />
        )}
        ListEmptyComponent={<EmptyState />}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSize.md,
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  headerLeft: {},
  greeting: {
    fontSize: FontSize.sm,
    fontWeight: "500",
  },
  userName: {
    fontSize: FontSize.xxl,
    fontWeight: "800",
    marginTop: 2,
  },
  avatarBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: Spacing.md,
  },
  totalCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  totalLeft: {},
  totalLabel: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  totalAmount: {
    fontSize: FontSize.hero,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 4,
  },
  totalEmoji: {
    fontSize: 42,
    opacity: 0.6,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
  },
  seeAll: {
    fontSize: FontSize.sm,
    fontWeight: "600",
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
