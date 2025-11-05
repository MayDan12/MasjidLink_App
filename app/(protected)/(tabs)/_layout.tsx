import { useAuth } from "@/app/context/AuthContext";
import { HapticTab } from "@/components/haptic-tab";
import MosqueIcon from "@/components/icons/MosqueIcon";
import PrayerTimeIcon from "@/components/icons/PrayerTime";
import Loader from "@/components/Loader";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, Tabs, useRouter } from "expo-router";
import {
  CalendarDaysIcon,
  Home,
  LineSquiggle,
  LogOut,
} from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export default function TabLayout() {
  const { logOut, user, loading } = useAuth();
  const router = useRouter();

  const name = user?.displayName;

  //   const name = user?.displayName || "Guest";

  if (loading) {
    return <Loader loading={true} />;
  }
  if (!user) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2E7D32", // Emerald Green
        tabBarInactiveTintColor: "#9CA3AF", // Muted gray
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: "#F5F5DC", // Light beige background
          borderTopWidth: 0,
          elevation: 8,
        },
        headerTitle: () => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "transparent",
            }}
          >
            <Pressable onPress={() => router.push("/user/profile")}>
              <Image
                source={
                  user?.photoURL
                    ? { uri: user.photoURL }
                    : require("@/assets/images/mosque.jpg")
                }
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  marginRight: 8,
                }}
              />
            </Pressable>
            <View>
              <Text
                style={{ fontFamily: "Inter_600SemiBold", lineHeight: 14 }}
                className="text-white text-xl"
              >
                Assalamualaikum!
              </Text>
              <Text
                style={{ fontFamily: "Inter_400Regular" }}
                className="text-white"
              >
                {name}
              </Text>
            </View>
          </View>
        ),
        headerRight: () => (
          <Pressable
            onPress={logOut}
            style={{ marginRight: 24 }}
            android_ripple={{ color: "gray", borderless: true }}
          >
            <LogOut
              size={22}
              color={"#fff"}
              onPress={() => {
                logOut();
                router.push("/intro");
              }}
            />
          </Pressable>
        ),
        headerBackground: () => (
          <LinearGradient
            colors={["#2E7D32", "#66BB6A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        ),
        tabBarLabelStyle: {
          fontFamily: "CrimsonText_700Bold",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="prayertime"
        options={{
          title: "Prayer Time",
          tabBarIcon: ({ color }) => <PrayerTimeIcon size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ color }) => (
            <CalendarDaysIcon size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="masjid"
        options={{
          title: "Masjid",
          tabBarIcon: ({ color }) => <MosqueIcon size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tasbih"
        options={{
          title: "Tasbih",
          headerStyle: {},
          tabBarIcon: ({ color }) => <LineSquiggle size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

// import React from 'react';

// import { HapticTab } from '@/components/haptic-tab';
// import { IconSymbol } from '@/components/ui/icon-symbol';
// import { Colors } from '@/constants/theme';
// import { useColorScheme } from '@/hooks/use-color-scheme';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: false,
//         tabBarButton: HapticTab,
//       }}>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="explore"
//         options={{
//           title: 'Explore',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
//         }}
//       />
//     </Tabs>
//   );
// }
