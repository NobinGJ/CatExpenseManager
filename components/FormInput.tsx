import React from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";
import { Colors, Spacing, BorderRadius, FontSize } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface Props extends TextInputProps {
  label: string;
  error?: string;
  prefix?: string;
}

export default function FormInput({ label, error, prefix, style, ...rest }: Props) {
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.surfaceAlt,
            borderColor: error ? colors.danger : colors.border,
          },
        ]}
      >
        {prefix && (
          <Text style={[styles.prefix, { color: colors.textTertiary }]}>
            {prefix}
          </Text>
        )}
        <TextInput
          style={[
            styles.input,
            { color: colors.text },
            prefix ? { paddingLeft: 0 } : null,
            style,
          ]}
          placeholderTextColor={colors.textTertiary}
          {...rest}
        />
      </View>
      {error ? (
        <Text style={[styles.error, { color: colors.danger }]}>⚠️ {error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
  },
  prefix: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    paddingVertical: 14,
    fontWeight: "500",
  },
  error: {
    fontSize: FontSize.xs,
    marginTop: 4,
    fontWeight: "500",
  },
});
