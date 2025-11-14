import { useAuth } from "@/app/context/AuthContext";
import Loader from "@/components/Loader";
import { Redirect, Stack } from "expo-router";
import { Text } from "react-native";

const HeaderTitle = ({ title }: { title: string }) => {
  return (
    <Text
      style={{
        fontFamily: "Inter_600SemiBold",
        fontSize: 20, // e.g., 20
        color: "#fff",
      }}
      accessibilityLabel="Profile Header"
    >
      {title}
    </Text>
  );
};

export default function ProtectedLayout() {
  const { user, error, roleLoading } = useAuth();

  // // Show loader while auth or role is loading
  if (roleLoading) {
    return <Loader loading={roleLoading} />;
  }

  // Handle error state
  if (error) {
    return (
      // You can customize this error UI as needed
      <Stack.Screen
        name="error"
        options={{ headerShown: false }}
        initialParams={{ message: error }}
      />
    );
  }

  // Redirect unauthenticated users
  if (!user) {
    return <Redirect href="/(auth)/intro" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="user/profile"
        options={{
          headerBackTitle: "Back", 
          headerTitle: () => <HeaderTitle title="Settings" />,
          headerStyle: {
            backgroundColor: "#2E7D32",
          },
          animation: "slide_from_bottom", // Slide in from the bottom
          animationDuration: 300, // Duration in milliseconds
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerShown: false,
          
        }}
      />
      <Stack.Screen
        name="user/azan"
        options={{
          headerBackTitle: "Back", 
          headerTitle: () => <HeaderTitle title="Azan Voices" />,
          headerStyle: {
            backgroundColor: "#2E7D32",
          },
          animation: "slide_from_right", // Slide in from the right
          animationDuration: 300, // Duration in milliseconds
          headerTintColor: "#fff",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="user/masjiddetails"
        options={{
          headerBackTitle: "Back", 
          headerTitle: () => <HeaderTitle title="Masjid Details" />,
          headerStyle: {
            backgroundColor: "#2E7D32",
          },
          animation: "slide_from_right", // Slide in from the right
          animationDuration: 300, // Duration in milliseconds
          headerTintColor: "#fff",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="user/tasbih"
        options={{
          headerBackTitle: "Back", 
          headerTitle: () => <HeaderTitle title="Tasbih" />,
          headerStyle: {
            backgroundColor: "#2E7D32",
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          animation: "slide_from_left", // Slide in from the right
          animationDuration: 300, // Duration in milliseconds
        }}
      />
      <Stack.Screen
        name="user/qibla"
        options={{
          headerBackTitle: "Back", 
          headerTitle: () => <HeaderTitle title="Qibla" />,
          headerStyle: {
            backgroundColor: "#2E7D32",
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          animation: "slide_from_left", // Slide in from the right
          animationDuration: 300, // Duration in milliseconds
        }}
      />
      <Stack.Screen
        name="user/account/profileupdate"
        options={{
          headerBackTitle: "Back", 
          headerTitle: () => <HeaderTitle title="Profile" />,
          headerShown: false,
          headerStyle: {
            backgroundColor: "#2E7D32",
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          animation: "slide_from_bottom", // Slide in from the bottom
          animationDuration: 300, // Duration in milliseconds
        }}
      />
      <Stack.Screen
        name="user/account/settings"
        options={{
          headerBackTitle: "Back", 
          headerTitle: () => <HeaderTitle title="Settings" />,
          headerShown: true,
          headerStyle: {
            backgroundColor: "#2E7D32",
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          animation: "slide_from_bottom", // Slide in from the bottom
          animationDuration: 300, // Duration in milliseconds
        }}
      />
      <Stack.Screen
        name="user/premium"
        options={{
          headerBackTitle: "Back", 
          headerTitle: () => <HeaderTitle title="Premium" />,
          headerShown: true,
          headerStyle: {
            backgroundColor: "#2E7D32",
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          animation: "slide_from_bottom", // Slide in from the bottom
          animationDuration: 300, // Duration in milliseconds
        }}
      />
      <Stack.Screen
        name="user/donation"
        options={{
          headerBackTitle: "Back", 
          headerTitle: () => <HeaderTitle title="Donations" />,
          headerShown: true,
          headerStyle: {
            backgroundColor: "#2E7D32",
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          animation: "slide_from_bottom", // Slide in from the bottom
          animationDuration: 300, // Duration in milliseconds
        }}
      />
      <Stack.Screen
        name="user/imam/donation"
        options={{
          headerBackTitle: "Back", 
          headerTitle: () => <HeaderTitle title="Donations" />,
          headerShown: false,
          headerStyle: {
            backgroundColor: "#2E7D32",
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          animation: "slide_from_bottom", // Slide in from the bottom
          animationDuration: 300, // Duration in milliseconds
        }}
      />
    </Stack>
  );
}
