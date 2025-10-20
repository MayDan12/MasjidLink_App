// import { LinearGradient } from "expo-linear-gradient";
// import React, { useEffect, useRef } from "react";
// import { Animated, Dimensions, StyleSheet, View } from "react-native";

// export interface ShimmerSkeletonProps {
//   width?: number | string;
//   height?: number | string;
//   borderRadius?: number;
//   style?: object;
// }

// const SCREEN_WIDTH = Dimensions.get("window").width;

// const ShimmerSkeleton: React.FC<ShimmerSkeletonProps> = ({
//   width = "100%",
//   height = 20,
//   borderRadius = 4,
//   style = {},
// }) => {
//   const shimmerValue = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.timing(shimmerValue, {
//         toValue: 1,
//         duration: 1500,
//         useNativeDriver: true,
//       })
//     ).start();
//   }, []);

//   const translateX = shimmerValue.interpolate({
//     inputRange: [0, 1],
//     outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
//   });
//   return (
//     <View style={styles.container}>
//       <View style={styles.avatar} />

//       <View style={styles.textContainer}>
//         <View style={styles.textLineFull} />
//         <View style={styles.textLineHalf} />
//       </View>
//       <Animated.View
//         style={[StyleSheet.absoluteFillObject, { transform: [{ translateX }] }]}
//       >
//         <LinearGradient
//           colors={["transparent", "rgba(255, 255, 255, 0.7)", "transparent"]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={styles.shimmer}
//         />
//       </Animated.View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 60,
//     marginHorizontal: 20,
//     borderRadius: 10,
//     overflow: "hidden",
//     backgroundColor: "#ccc",
//     height: 140,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "#eee",
//   },
//   textContainer: {
//     flex: 1,
//     marginLeft: 16,
//     justifyContent: "center",
//   },
//   textLineFull: {
//     height: 14,
//     backgroundColor: "#eee",
//     borderRadius: 7,
//     marginBottom: 10,
//     width: "80%",
//   },
//   textLineHalf: {
//     height: 14,
//     backgroundColor: "#eee",
//     borderRadius: 7,
//     width: "60%",
//   },
//   shimmer: {
//     flex: 1,
//     width: 80,
//     height: "100%",
//     backgroundColor: "transparent",
//   },
// });

// export default ShimmerSkeleton;

import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  DimensionValue,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

export interface ShimmerSkeletonProps {
  variant?: "circle" | "rect" | "text"; // Type of skeleton
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  lines?: number; // for "text"
  style?: StyleProp<ViewStyle>;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

const ShimmerSkeleton: React.FC<ShimmerSkeletonProps> = ({
  variant = "rect",
  width = "100%",
  height = 20,
  borderRadius = 4,
  lines = 2,
  style = {},
}) => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  // Render based on variant
  const renderSkeleton = () => {
    switch (variant) {
      case "circle":
        return (
          <View
            style={[
              {
                width: width || height,
                height,
                borderRadius: typeof width === "number" ? width / 2 : 50,
                backgroundColor: "#eee",
              },
              style,
            ]}
          />
        );

      case "text":
        return (
          <View style={[{ flexDirection: "column", width: "100%" }, style]}>
            {Array.from({ length: lines }).map((_, i) => (
              <View
                key={i}
                style={{
                  height,
                  backgroundColor: "#eee",
                  borderRadius,
                  marginBottom: 8,
                  width: i === lines - 1 ? "60%" : "80%",
                }}
              />
            ))}
          </View>
        );

      case "rect":
      default:
        return (
          <View
            style={[
              {
                width,
                height,
                borderRadius,
                backgroundColor: "#eee",
              },
              style,
            ]}
          />
        );
    }
  };

  return (
    <View style={{ overflow: "hidden" }}>
      {renderSkeleton()}
      <Animated.View
        style={[StyleSheet.absoluteFillObject, { transform: [{ translateX }] }]}
      >
        <LinearGradient
          colors={["transparent", "rgba(255, 255, 255, 0.7)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shimmer}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  shimmer: {
    flex: 1,
    width: 80,
    height: "100%",
    backgroundColor: "transparent",
  },
});

export default ShimmerSkeleton;
