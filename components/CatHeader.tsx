import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Spacing, FontSize } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface Props {
  title: string;
  subtitle?: string;
}

export default function CatHeader({ title, subtitle }: Props) {
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={styles.catEmoji}>🐱</Text>
      </View>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      )}
      <View style={styles.pawPrints}>
        <Text style={styles.paw}>🐾</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: "800",
  },
  catEmoji: {
    fontSize: 28,
    marginLeft: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.sm,
    marginTop: 4,
  },
  pawPrints: {
    position: "absolute",
    right: 0,
    top: -4,
    opacity: 0.15,
  },
  paw: {
    fontSize: 32,
  },
});
