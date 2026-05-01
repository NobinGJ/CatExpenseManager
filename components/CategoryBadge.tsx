import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getCategoryById } from "@/constants/categories";
import { BorderRadius, FontSize, Spacing } from "@/constants/theme";

interface Props {
  categoryId: string;
  size?: "sm" | "md";
}

export default function CategoryBadge({ categoryId, size = "sm" }: Props) {
  const cat = getCategoryById(categoryId);
  const isLarge = size === "md";

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: cat.color + "20",
          paddingHorizontal: isLarge ? Spacing.md : Spacing.sm,
          paddingVertical: isLarge ? 6 : 3,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize: isLarge ? FontSize.sm : FontSize.xs }]}>
        {cat.emoji} {cat.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.full,
    alignSelf: "flex-start",
  },
  text: {
    fontWeight: "600",
  },
});
