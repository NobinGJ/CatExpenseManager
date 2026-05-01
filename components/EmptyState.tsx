import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Spacing, FontSize } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface Props {
  message?: string;
}

export default function EmptyState({
  message = "No hay gastos registrados aún",
}: Props) {
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];

  return (
    <View style={styles.container}>
      <Text style={styles.catFace}>😿</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>
      <Text style={[styles.hint, { color: colors.textTertiary }]}>
        Toca el botón + para agregar tu primer gasto 🐾
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xxl * 2,
    paddingHorizontal: Spacing.xl,
  },
  catFace: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  message: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    textAlign: "center",
  },
  hint: {
    fontSize: FontSize.sm,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
});
