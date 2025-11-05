import { AuthProvider } from "@/app/context/AuthContext";
import { Ephesis_400Regular } from "@expo-google-fonts/ephesis";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";

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
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
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

// import { Redirect, Slot } from "expo-router";
// import "react-native-reanimated";
// import "./globals.css";

// import { AuthProvider, useAuth } from "@/app/context/AuthContext"; // Adjust path if needed
// import { Ephesis_400Regular } from "@expo-google-fonts/ephesis";
// // import { Ephesis_400Regula } from "@expo-google-fonts/okta";

// import {
//   Inter_400Regular,
//   Inter_500Medium,
//   Inter_600SemiBold,
//   Inter_700Bold,
//   useFonts,
// } from "@expo-google-fonts/inter";

// // Define how notifications should behave
// // Notifications.setNotificationHandler({
// //   handleNotification: async () => ({
// //     shouldShowBanner: true, // iOS: show banner
// //     shouldShowList: true, // iOS: show in notification center
// //     shouldPlaySound: true,
// //     shouldSetBadge: false,
// //   }),
// // });

// // async function requestNotificationPermissions() {
// //   const { status } = await Notifications.requestPermissionsAsync();
// //   if (status !== "granted") {
// //     alert("Permission for notifications not granted!");
// //   }
// // }

// export default function RootLayout() {
//   const [loaded] = useFonts({
//     Inter_400Regular,
//     Inter_500Medium,
//     Inter_600SemiBold,
//     Inter_700Bold,
//     Ephesis_400Regular,
//   });
//   // useEffect(() => {
//   //   requestNotificationPermissions();
//   // }, []);

//   if (!loaded) {
//     return null;
//   }

//   return (
//     // <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//     <AuthProvider>
//       <AuthenticatedLayout />
//     </AuthProvider>
//     // </ThemeProvider>
//   );
// }

// function AuthenticatedLayout() {
//   const { user } = useAuth();
//   if (!user) {
//     return <Redirect href={"/(auth)/intro"} />;
//   }
//   return (
//     <Slot
//       screenOptions={{
//         animation: "slide_from_right",
//         gestureEnabled: true,
//       }}
//     />
//   );
// }
