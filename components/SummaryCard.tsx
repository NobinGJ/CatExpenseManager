import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Spacing, BorderRadius, FontSize } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface Props {
  title: string;
  amount: number;
  icon: string;
  accentColor?: string;
}

export default function SummaryCard({ title, amount, icon, accentColor }: Props) {
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];
  const accent = accentColor || colors.primary;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.borderLight,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={[styles.iconBg, { backgroundColor: accent + "18" }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
      <Text style={[styles.amount, { color: colors.text }]}>
        ${amount.toFixed(2)}
      </Text>
      <View style={[styles.accentBar, { backgroundColor: accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: "hidden",
    minWidth: 140,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  icon: {
    fontSize: 18,
  },
  title: {
    fontSize: FontSize.xs,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  amount: {
    fontSize: FontSize.xl,
    fontWeight: "800",
    marginTop: 4,
  },
  accentBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
  },
});
