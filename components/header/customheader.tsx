// components/CustomHeader.tsx
import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import {
  Image,
  Pressable,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

interface CustomHeaderProps {
  user: any;
  name: string | null | undefined;
  logOut: () => void;
}

export function CustomHeader({ user, name, logOut }: CustomHeaderProps) {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        backgroundColor: "transparent",
        flex: 1,
        width: "100%",
      }}
    >
      {/* Left - Profile */}
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

      {/* Middle - Title + Search */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "600", fontSize: 16 }}>{name}</Text>
        <TextInput
          placeholder="Search..."
          placeholderTextColor="#888"
          style={{
            marginTop: 4,
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 8,
            backgroundColor: colorScheme === "dark" ? "#334155" : "#f1f5f9",
          }}
          onChangeText={(text) => console.log(text)}
        />
      </View>

      {/* Right - Logout */}
      <Pressable
        onPress={logOut}
        style={{ marginLeft: 12 }}
        android_ripple={{ color: "gray", borderless: true }}
      >
        <LogOut size={22} />
      </Pressable>
    </View>
  );
}
