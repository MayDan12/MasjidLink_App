import { AuthProvider } from "@/app/context/AuthContext";
import { Ephesis_400Regular } from "@expo-google-fonts/ephesis";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";

import { CrimsonText_400Regular } from "@expo-google-fonts/crimson-text/400Regular";
import { CrimsonText_400Regular_Italic } from "@expo-google-fonts/crimson-text/400Regular_Italic";
import { CrimsonText_600SemiBold } from "@expo-google-fonts/crimson-text/600SemiBold";
import { CrimsonText_600SemiBold_Italic } from "@expo-google-fonts/crimson-text/600SemiBold_Italic";
import { CrimsonText_700Bold } from "@expo-google-fonts/crimson-text/700Bold";
import { CrimsonText_700Bold_Italic } from "@expo-google-fonts/crimson-text/700Bold_Italic";
import { Slot } from "expo-router";
import "react-native-reanimated";
import "./globals.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Ephesis_400Regular,
    CrimsonText_400Regular,
    CrimsonText_400Regular_Italic,
    CrimsonText_600SemiBold,
    CrimsonText_600SemiBold_Italic,
    CrimsonText_700Bold,
    CrimsonText_700Bold_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AuthGate />
        <Toaster />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

function AuthGate() {
  return (
    <Slot
      screenOptions={{
        animation: "slide_from_right",
        gestureEnabled: true,
      }}
    />
  );
}
