import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { Colors, Spacing, BorderRadius, FontSize } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function LoginScreen() {
  const { signInWithGoogle, signInAsGuest } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      // Si el usuario cancela el flujo, no mostrar error
      if (error?.code === "SIGN_IN_CANCELLED") return;
      // Si ya hay un sign-in en progreso, ignorar
      if (error?.code === "SIGN_IN_IN_PROGRESS" || error?.code === "IN_PROGRESS") return;

      // Mostrar el error real para poder diagnosticar
      const errorMessage = error?.message || "Error desconocido";
      const errorCode = error?.code || "sin código";
      console.error("❌ Sign in error:", JSON.stringify(error, null, 2));
      Alert.alert(
        "Error de inicio de sesión",
        `${errorMessage}\n\nCódigo: ${errorCode}`
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGuestSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInAsGuest();
    } catch (error: any) {
      console.error("❌ Guest sign in error:", JSON.stringify(error, null, 2));
      Alert.alert(
        "Error",
        "No se pudo iniciar sesión como invitado. Verifica tu conexión a internet."
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Decorative top */}
      <View style={styles.decorTop}>
        <Text style={styles.pawTopLeft}>🐾</Text>
        <Text style={styles.pawTopRight}>🐾</Text>
      </View>

      {/* Logo area */}
      <View style={styles.logoArea}>
        <View style={[styles.logoBg, { backgroundColor: colors.primaryLight, overflow: "hidden" }]}>
          <Image 
            source={require("../assets/images/logo.png")} 
            style={{ width: 100, height: 100, borderRadius: 50, resizeMode: "cover" }} 
          />
        </View>
        <Text style={[styles.appName, { color: colors.text }]}>
          Cat Expense
        </Text>
        <Text style={[styles.appNameAccent, { color: colors.primary }]}>
          Manager
        </Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          Controla tus gastos con estilo felino ✨
        </Text>
      </View>

      {/* Features */}
      <View style={styles.features}>
        {[
          { emoji: "📊", text: "Resumen diario y mensual" },
          { emoji: "🏷️", text: "Categorías organizadas" },
          { emoji: "☁️", text: "Sincronizado en la nube" },
        ].map((f, i) => (
          <View
            key={i}
            style={[styles.featureRow, { backgroundColor: colors.surfaceAlt }]}
          >
            <Text style={styles.featureEmoji}>{f.emoji}</Text>
            <Text style={[styles.featureText, { color: colors.text }]}>
              {f.text}
            </Text>
          </View>
        ))}
      </View>

      {/* Sign In Button */}
      <View style={styles.buttonArea}>
        <TouchableOpacity
          onPress={handleSignIn}
          disabled={isSigningIn}
          activeOpacity={0.8}
          style={[
            styles.googleButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: colors.shadow,
              marginBottom: Spacing.md,
            },
          ]}
        >
          {isSigningIn ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : (
            <>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={[styles.googleText, { color: colors.text }]}>
                Continuar con Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGuestSignIn}
          disabled={isSigningIn}
          activeOpacity={0.8}
          style={[
            styles.guestButton,
            {
              backgroundColor: "transparent",
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={styles.guestIcon}>👤</Text>
          <Text style={[styles.guestText, { color: colors.textSecondary }]}>
            Continuar como Invitado
          </Text>
        </TouchableOpacity>

        <Text style={[styles.footerText, { color: colors.textTertiary }]}>
          Tus datos están seguros con nosotros 🔒
        </Text>
      </View>

      {/* Decorative bottom paws */}
      <View style={styles.decorBottom}>
        <Text style={styles.pawBottom}>🐾  🐾  🐾</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: "center",
  },
  decorTop: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    opacity: 0.12,
  },
  pawTopLeft: { fontSize: 40, transform: [{ rotate: "-25deg" }] },
  pawTopRight: { fontSize: 36, transform: [{ rotate: "30deg" }] },
  logoArea: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  logoBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  logoEmoji: {
    fontSize: 52,
  },
  appName: {
    fontSize: FontSize.hero,
    fontWeight: "800",
    letterSpacing: -1,
  },
  appNameAccent: {
    fontSize: FontSize.xxl,
    fontWeight: "800",
    marginTop: -4,
  },
  tagline: {
    fontSize: FontSize.sm,
    marginTop: Spacing.sm,
    fontWeight: "500",
  },
  features: {
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  featureEmoji: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  featureText: {
    fontSize: FontSize.md,
    fontWeight: "500",
  },
  buttonArea: {
    alignItems: "center",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    width: "100%",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  googleIcon: {
    fontSize: 22,
    fontWeight: "800",
    color: "#4285F4",
    marginRight: Spacing.md,
  },
  googleText: {
    fontSize: FontSize.md,
    fontWeight: "600",
  },
  guestButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    width: "100%",
  },
  guestIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  guestText: {
    fontSize: FontSize.md,
    fontWeight: "600",
  },
  footerText: {
    fontSize: FontSize.xs,
    marginTop: Spacing.lg,
  },
  decorBottom: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    opacity: 0.1,
  },
  pawBottom: {
    fontSize: 28,
  },
});
