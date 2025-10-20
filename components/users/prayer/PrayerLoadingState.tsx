import { useEffect } from "react";
import { Image } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrayerLoader({ loading }: { loading: boolean }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (loading) {
      scale.value = withRepeat(
        withTiming(1.2, {
          duration: 800,
          easing: Easing.inOut(Easing.ease),
        }),
        -1, // infinite
        true // reverse
      );
    }
  }, [loading, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F5F5DC", // slate-800
        }}
      >
        <Animated.View style={animatedStyle}>
          <Image
            source={require("@/assets/icons/prayer.png")}
            style={{ width: 100, height: 100 }}
            resizeMode="contain"
          />
        </Animated.View>
      </SafeAreaView>
    );
  }

  return null;
}
