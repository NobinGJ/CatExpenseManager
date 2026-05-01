import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from "@/hooks/useAuth";
import { Colors, Spacing, BorderRadius, FontSize } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];

  // Genera el redirect URI automáticamente
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "catexpensemanager",
  });

  // ⬇️ IMPORTANTE: Copia esta URI y agrégala en Google Cloud Console
  //   → Credentials → Tu OAuth Client → Authorized redirect URIs
  console.log("📋 Redirect URI (agregar en Google Cloud Console):", redirectUri);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "663856121853-qusn34lcqthknalabjslkdfcoiju96mu.apps.googleusercontent.com",
    redirectUri,
  });

  useEffect(() => {
    handleGoogleResponse();
  }, [response]);

  const handleGoogleResponse = async () => {
    if (response?.type === "success") {
      setIsSigningIn(true);
      try {
        const { id_token } = response.params;
        await signIn(id_token);
      } catch (error) {
        Alert.alert("Error", "No se pudo iniciar sesión. Inténtalo de nuevo.");
        console.error("Sign in error:", error);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  const handleSignIn = async () => {
    try {
      await promptAsync();
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir el inicio de sesión.");
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
        <View style={[styles.logoBg, { backgroundColor: colors.primaryLight }]}>
          <Text style={styles.logoEmoji}>🐱</Text>
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
          disabled={!request || isSigningIn}
          activeOpacity={0.8}
          style={[
            styles.googleButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: colors.shadow,
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
  footerText: {
    fontSize: FontSize.xs,
    marginTop: Spacing.md,
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
