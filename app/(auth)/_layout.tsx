import Loader from "@/components/Loader";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function AuthLayout() {
  // const { user, loading } = useAuth();
  const { user, loading, roleLoading } = useAuth();

  if (loading && roleLoading) {
    return <Loader loading={true} />;
  }

  //   if (loading) {
  //     return (
  //       <View
  //         style={{
  //           flex: 1,
  //           alignItems: "center",
  //           justifyContent: "center",
  //           backgroundColor: "#fff",
  //         }}
  //       >
  //         <ActivityIndicator size="large" color="#2E7D32" />
  //       </View>
  //     );
  //   }

  if (user) {
    return <Redirect href={"/(protected)/(tabs)"} />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="intro"
        options={{ title: "Welcome", headerShown: false }}
      />
      <Stack.Screen
        name="onboarding"
        options={{ title: "Onboarding", headerShown: false }}
      />
      <Stack.Screen
        name="login"
        options={{ title: "Login", headerShown: false }}
      />
      <Stack.Screen
        name="signup"
        options={{ title: "Sign Up", headerShown: false }}
      />
    </Stack>
  );
}
