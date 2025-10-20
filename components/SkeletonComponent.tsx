import React from "react";
import { Animated, StyleSheet, View } from "react-native";

interface SkeletonProps {
  width: number | string;
  height: number | string;
  borderRadius?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius = 4,
  style,
}) => {
  const shimmerAnimation = new Animated.Value(0);

  React.useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate();
  });

  const translateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <View style={[styles.skeleton, { width, height, borderRadius }, style]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#E1E9EE",
    overflow: "hidden",
    position: "relative",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    transform: [{ skewX: "-20deg" }],
  },
});
