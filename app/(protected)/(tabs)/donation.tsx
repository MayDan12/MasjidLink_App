import TasbihScreen from "@/components/home/Tasbih";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "#1e293b" }}>
      <View>
        <Text>Profile</Text>
        <TasbihScreen />
      </View>
    </SafeAreaView>
  );
}
