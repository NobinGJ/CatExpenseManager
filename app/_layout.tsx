import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(tabs)";

    if (!user && inAuthGroup) {
      router.replace("/login");
    } else if (user && !inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, loading, segments]);

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="expense/add"
          options={{
            headerShown: true,
            title: "Nuevo Gasto",
            headerTintColor: colors.primary,
            headerStyle: { backgroundColor: colors.background },
            headerTitleStyle: { color: colors.text, fontWeight: "700" },
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="expense/[id]"
          options={{
            headerShown: true,
            title: "Editar Gasto",
            headerTintColor: colors.primary,
            headerStyle: { backgroundColor: colors.background },
            headerTitleStyle: { color: colors.text, fontWeight: "700" },
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
