import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { useExpenses } from "@/hooks/useExpenses";
import { CATEGORIES } from "@/constants/categories";
import { Colors, Spacing, BorderRadius, FontSize } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import FormInput from "@/components/FormInput";

interface FormErrors {
  titulo?: string;
  monto?: string;
  impuesto?: string;
  categoria?: string;
}

export default function AddExpenseScreen() {
  const { add } = useExpenses();
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];

  const [titulo, setTitulo] = useState("");
  const [monto, setMonto] = useState("");
  const [impuesto, setImpuesto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fecha, setFecha] = useState(new Date());
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!titulo.trim()) {
      newErrors.titulo = "El nombre es requerido";
    }

    if (!monto.trim()) {
      newErrors.monto = "El monto es requerido";
    } else if (isNaN(Number(monto)) || Number(monto) <= 0) {
      newErrors.monto = "Ingresa un monto válido";
    }

    if (impuesto.trim() && (isNaN(Number(impuesto)) || Number(impuesto) < 0)) {
      newErrors.impuesto = "Ingresa un impuesto válido";
    }

    if (!categoria) {
      newErrors.categoria = "Selecciona una categoría";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      await add({
        titulo: titulo.trim(),
        monto: Number(monto),
        impuesto: Number(impuesto) || 0,
        total: Number(monto) + (Number(impuesto) || 0),
        fecha,
        categoria,
      });
      router.back();
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el gasto. Inténtalo de nuevo.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const changeDate = (days: number) => {
    const newDate = new Date(fecha);
    newDate.setDate(newDate.getDate() + days);
    if (newDate <= new Date()) {
      setFecha(newDate);
    }
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cat decoration */}
        <Text style={styles.topEmoji}>🐾</Text>

        <FormInput
          label="Nombre del gasto"
          placeholder="Ej: Almuerzo, Netflix, Gasolina..."
          value={titulo}
          onChangeText={setTitulo}
          error={errors.titulo}
          maxLength={50}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: Spacing.sm }}>
            <FormInput
              label="Monto"
              placeholder="0.00"
              value={monto}
              onChangeText={setMonto}
              error={errors.monto}
              keyboardType="decimal-pad"
              prefix="$"
            />
          </View>
          <View style={{ flex: 1 }}>
            <FormInput
              label="Impuesto (opcional)"
              placeholder="0.00"
              value={impuesto}
              onChangeText={setImpuesto}
              error={errors.impuesto}
              keyboardType="decimal-pad"
              prefix="$"
            />
          </View>
        </View>

        {/* Preview total */}
        {(Number(monto) > 0 || Number(impuesto) > 0) && (
          <View
            style={[
              styles.previewTotal,
              { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>
              Total estimado:
            </Text>
            <Text style={[styles.previewAmount, { color: colors.primary }]}>
              ${((Number(monto) || 0) + (Number(impuesto) || 0)).toFixed(2)}
            </Text>
          </View>
        )}

        {/* Date selector */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>FECHA</Text>
        <View style={styles.dateRow}>
          <TouchableOpacity
            onPress={() => changeDate(-1)}
            style={[styles.dateArrow, { backgroundColor: colors.surfaceAlt }]}
          >
            <Text style={{ fontSize: 18 }}>◀</Text>
          </TouchableOpacity>
          <View
            style={[
              styles.dateDisplay,
              { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
            ]}
          >
            <Text style={{ fontSize: 16, marginRight: Spacing.sm }}>📅</Text>
            <Text style={[styles.dateText, { color: colors.text }]}>
              {formatDate(fecha)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => changeDate(1)}
            style={[styles.dateArrow, { backgroundColor: colors.surfaceAlt }]}
          >
            <Text style={{ fontSize: 18 }}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Category selector */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          CATEGORÍA
        </Text>
        {errors.categoria && (
          <Text style={[styles.errorText, { color: colors.danger }]}>
            ⚠️ {errors.categoria}
          </Text>
        )}
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => {
            const active = categoria === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCategoria(cat.id)}
                activeOpacity={0.7}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: active
                      ? cat.color + "25"
                      : colors.surfaceAlt,
                    borderColor: active ? cat.color : colors.border,
                    borderWidth: active ? 2 : 1,
                  },
                ]}
              >
                <Text style={{ fontSize: 18 }}>{cat.emoji}</Text>
                <Text
                  style={[
                    styles.categoryChipText,
                    { color: active ? cat.color : colors.textSecondary },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Save button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
          style={[
            styles.saveBtn,
            {
              backgroundColor: saving ? colors.primaryLight : colors.primary,
              shadowColor: colors.primaryDark,
            },
          ]}
        >
          <Text style={styles.saveBtnText}>
            {saving ? "Guardando..." : "Guardar Gasto  🐱"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  topEmoji: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: Spacing.md,
    opacity: 0.2,
  },
  row: {
    flexDirection: "row",
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  previewTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  previewLabel: {
    fontSize: FontSize.sm,
    fontWeight: "500",
  },
  previewAmount: {
    fontSize: FontSize.xl,
    fontWeight: "800",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  dateArrow: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  dateDisplay: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  dateText: {
    fontSize: FontSize.md,
    fontWeight: "500",
  },
  errorText: {
    fontSize: FontSize.xs,
    fontWeight: "500",
    marginBottom: 6,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: 6,
  },
  categoryChipText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
  },
  saveBtn: {
    paddingVertical: 18,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: FontSize.lg,
    fontWeight: "700",
  },
});
