// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { LinearGradient } from "expo-linear-gradient";
// import { StatusBar } from "expo-status-bar";
// import { useEffect, useState } from "react";
// import {
//   Alert,
//   Animated,
//   Platform,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   Vibration,
//   View,
// } from "react-native";

// interface TasbihData {
//   count: number;
//   target: number;
//   completedCycles: number;
// }

// const TARGETS = [33, 99, 333];

// export default function TasbihScreen() {
//   const [data, setData] = useState<TasbihData>({
//     count: 0,
//     target: 33,
//     completedCycles: 0,
//   });
//   const [scaleAnim] = useState(new Animated.Value(1));
//   const [progressAnim] = useState(new Animated.Value(0));

//   // Load saved data
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const saved = await AsyncStorage.getItem("tasbihData");
//         if (saved) {
//           const parsed = JSON.parse(saved);
//           setData(parsed);
//           // Animate progress on load
//           Animated.timing(progressAnim, {
//             toValue: parsed.count / parsed.target,
//             duration: 1000,
//             useNativeDriver: false,
//           }).start();
//         }
//       } catch (error) {
//         console.error("Failed to load data:", error);
//       }
//     };
//     loadData();
//   }, []);

//   // Save data
//   useEffect(() => {
//     const saveData = async () => {
//       try {
//         await AsyncStorage.setItem("tasbihData", JSON.stringify(data));
//       } catch (error) {
//         console.error("Failed to save data:", error);
//       }
//     };
//     saveData();
//   }, [data]);

//   const increment = () => {
//     // Button press animation
//     Animated.sequence([
//       Animated.timing(scaleAnim, {
//         toValue: 0.95,
//         duration: 100,
//         useNativeDriver: true,
//       }),
//       Animated.timing(scaleAnim, {
//         toValue: 1,
//         duration: 100,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     setData((prev) => {
//       const newCount = prev.count + 1;
//       let newCompletedCycles = prev.completedCycles;

//       // Check if target reached
//       if (newCount === prev.target) {
//         newCompletedCycles += 1;
//         // Haptic feedback on completion
//         if (Platform.OS !== "web") {
//           Vibration.vibrate([0, 200, 100, 200]);
//         }

//         // Reset count after target completion
//         setTimeout(() => {
//           setData((current) => ({ ...current, count: 0 }));
//           // Reset progress animation
//           progressAnim.setValue(0);
//         }, 1500);

//         // Complete progress animation
//         Animated.timing(progressAnim, {
//           toValue: 1,
//           duration: 300,
//           useNativeDriver: false,
//         }).start();

//         return {
//           ...prev,
//           count: newCount,
//           completedCycles: newCompletedCycles,
//         };
//       } else {
//         // Normal increment with progress animation
//         Animated.timing(progressAnim, {
//           toValue: newCount / prev.target,
//           duration: 200,
//           useNativeDriver: false,
//         }).start();

//         // Light haptic feedback
//         if (Platform.OS !== "web") {
//           Vibration.vibrate(50);
//         }
//       }

//       return { ...prev, count: newCount };
//     });
//   };

//   const reset = () => {
//     Alert.alert(
//       "Reset Counter",
//       "Are you sure you want to reset the counter?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Reset",
//           style: "destructive",
//           onPress: () => {
//             setData((prev) => ({ ...prev, count: 0 }));
//             progressAnim.setValue(0);
//           },
//         },
//       ]
//     );
//   };

//   const changeTarget = (newTarget: number) => {
//     setData((prev) => ({
//       ...prev,
//       target: newTarget,
//       count: 0, // Reset count when changing target
//     }));
//     progressAnim.setValue(0);
//   };

//   const progress = data.count / data.target;
//   const circumference = 2 * Math.PI * 120; // radius = 120

//   return (
//     <LinearGradient colors={["#FFFFFF", "#F5F5DC"]} style={styles.container}>
//       <StatusBar style="light" />

//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.title}>تسبيح</Text>
//         <Text style={styles.subtitle}>Tasbih Counter</Text>
//       </View>

//       {/* Stats */}
//       <View style={styles.statsContainer}>
//         <View style={styles.stat}>
//           <Text style={styles.statNumber}>{data.completedCycles}</Text>
//           <Text style={styles.statLabel}>Completed</Text>
//         </View>
//         <View style={styles.stat}>
//           <Text style={styles.statNumber}>{data.target}</Text>
//           <Text style={styles.statLabel}>Target</Text>
//         </View>
//       </View>

//       {/* Progress Circle */}
//       <View style={styles.progressContainer}>
//         <Animated.View
//           style={[
//             styles.progressRing,
//             {
//               transform: [
//                 {
//                   rotate: progressAnim.interpolate({
//                     inputRange: [0, 1],
//                     outputRange: ["0deg", "360deg"],
//                   }),
//                 },
//               ],
//             },
//           ]}
//         />

//         {/* Counter Button */}
//         <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
//           <TouchableOpacity
//             style={[
//               styles.counterButton,
//               {
//                 backgroundColor:
//                   data.count === data.target ? "#F59E0B" : "#10B981",
//               },
//             ]}
//             onPress={increment}
//             activeOpacity={0.8}
//           >
//             <Text style={styles.counter}>{data.count}</Text>
//             <Text style={styles.counterSubtext}>
//               {data.count === data.target ? "Complete!" : "Tap to count"}
//             </Text>
//           </TouchableOpacity>
//         </Animated.View>
//       </View>

//       {/* Target Selector */}
//       <View style={styles.targetContainer}>
//         <Text style={styles.targetLabel}>Select Target:</Text>
//         <View style={styles.targetButtons}>
//           {TARGETS.map((target) => (
//             <TouchableOpacity
//               key={target}
//               style={[
//                 styles.targetButton,
//                 data.target === target && styles.targetButtonActive,
//               ]}
//               onPress={() => changeTarget(target)}
//             >
//               <Text
//                 style={[
//                   styles.targetText,
//                   data.target === target && styles.targetTextActive,
//                 ]}
//               >
//                 {target}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* Actions */}
//       <View style={styles.actions}>
//         <TouchableOpacity style={styles.resetButton} onPress={reset}>
//           <Text style={styles.resetText}>Reset Counter</Text>
//         </TouchableOpacity>
//       </View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingTop: 60,
//   },
//   header: {
//     alignItems: "center",
//     marginBottom: 30,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: "bold",
//     color: "#D4AF37",
//     textAlign: "center",
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#0D1B2A",
//     marginTop: 5,
//     fontFamily: "Inter_500Medium",
//   },
//   statsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginBottom: 40,
//     paddingHorizontal: 20,
//   },
//   stat: {
//     alignItems: "center",
//     backgroundColor: "rgba(255, 255, 255, 0.1)",
//     paddingVertical: 15,
//     paddingHorizontal: 25,
//     borderRadius: 15,
//     minWidth: 80,
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#F59E0B",
//   },
//   statLabel: {
//     fontSize: 12,
//     color: "#0D1B2A",
//     marginTop: 2,
//   },
//   progressContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 40,
//     position: "relative",
//   },
//   progressRing: {
//     position: "absolute",
//     width: 280,
//     height: 280,
//     borderRadius: 140,
//     borderWidth: 8,
//     borderColor: "#F59E0B",
//     borderTopColor: "transparent",
//     borderRightColor: "transparent",
//     borderBottomColor: "transparent",
//   },
//   counterButton: {
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 10,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 5,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//   },
//   counter: {
//     fontSize: 48,
//     fontWeight: "bold",
//     color: "#FFFFFF",
//   },
//   counterSubtext: {
//     fontSize: 12,
//     color: "#FFFFFF",
//     opacity: 0.8,
//     marginTop: 5,
//   },
//   targetContainer: {
//     alignItems: "center",
//     marginBottom: 30,
//   },
//   targetLabel: {
//     fontSize: 16,
//     color: "#0D1B2A",
//     marginBottom: 15,
//   },
//   targetButtons: {
//     flexDirection: "row",
//     gap: 15,
//   },
//   targetButton: {
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     backgroundColor: "rgba(255, 255, 255, 0.1)",
//     borderWidth: 1,
//     borderColor: "rgba(255, 255, 255, 0.2)",
//   },
//   targetButtonActive: {
//     backgroundColor: "#F59E0B",
//     borderColor: "#F59E0B",
//   },
//   targetText: {
//     color: "#0D1B2A",
//     fontWeight: "600",
//   },
//   targetTextActive: {
//     color: "#FFFFFF",
//   },
//   actions: {
//     alignItems: "center",
//     marginBottom: 30,
//   },
//   resetButton: {
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 25,
//     backgroundColor: "rgba(220, 38, 38, 0.8)",
//   },
//   resetText: {
//     color: "#FFFFFF",
//     fontWeight: "600",
//   },
// });

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

interface TasbihData {
  count: number;
  target: number;
  completedCycles: number;
}

const TARGETS = [33, 99, 333];
const MOTIVATIONAL_QUOTES = [
  "SubhanAllah fills the scales of good deeds.",
  "Alhamdulillah brings blessings to your heart.",
  "Allahu Akbar elevates your soul.",
];

export default function TasbihScreen() {
  const [data, setData] = useState<TasbihData>({
    count: 0,
    target: 33,
    completedCycles: 0,
  });
  const [scaleAnim] = useState(new Animated.Value(1));
  const [progressAnim] = useState(new Animated.Value(0));
  const [currentQuote, setCurrentQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  // Update motivational quote periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const randomQuote =
        MOTIVATIONAL_QUOTES[
          Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
        ];
      setCurrentQuote(randomQuote);
    }, 10000); // Change quote every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Load saved data
  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem("tasbihData");
        if (saved) {
          const parsed = JSON.parse(saved);
          setData(parsed);
          Animated.timing(progressAnim, {
            toValue: parsed.count / parsed.target,
            duration: 1000,
            useNativeDriver: false,
          }).start();
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    loadData();
  }, [progressAnim]);

  // Save data
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem("tasbihData", JSON.stringify(data));
      } catch (error) {
        console.error("Failed to save data:", error);
      }
    };
    saveData();
  }, [data]);

  const increment = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();

    setData((prev) => {
      const newCount = prev.count + 1;
      let newCompletedCycles = prev.completedCycles;

      if (newCount === prev.target) {
        newCompletedCycles += 1;
        if (Platform.OS !== "web") {
          Vibration.vibrate([0, 300, 150, 300]);
        }

        setTimeout(() => {
          setData((current) => ({ ...current, count: 0 }));
          progressAnim.setValue(0);
        }, 1500);

        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }).start();

        return {
          ...prev,
          count: newCount,
          completedCycles: newCompletedCycles,
        };
      } else {
        Animated.timing(progressAnim, {
          toValue: newCount / prev.target,
          duration: 300,
          useNativeDriver: false,
        }).start();

        if (Platform.OS !== "web") {
          Vibration.vibrate(60);
        }
      }

      return { ...prev, count: newCount };
    });
  };

  const reset = () => {
    Alert.alert(
      "Reset Counter",
      "Are you sure you want to reset the counter?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            setData((prev) => ({ ...prev, count: 0 }));
            progressAnim.setValue(0);
          },
        },
      ]
    );
  };

  const changeTarget = (newTarget: number) => {
    setData((prev) => ({
      ...prev,
      target: newTarget,
      count: 0,
    }));
    progressAnim.setValue(0);
  };

  const progress = data.count / data.target;
  const circumference = 2 * Math.PI * 120;

  return (
    <LinearGradient
      colors={["#FFFFFF", "#F5F5DC"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    >
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>تسبيح</Text>
        <Text style={styles.subtitle}>Digital Tasbih Counter</Text>
        <Text style={styles.motivationalQuote}>{currentQuote}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{data.completedCycles}</Text>
          <Text style={styles.statLabel}>Completed Cycles</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{data.target}</Text>
          <Text style={styles.statLabel}>Target Count</Text>
        </View>
      </View>

      {/* Progress Circle */}
      <View style={styles.progressContainer}>
        <LinearGradient
          colors={["#f59e0b", "#eab308"]}
          style={styles.progressRing}
        >
          <Animated.View
            style={[
              styles.progressRingInner,
              {
                transform: [
                  {
                    rotate: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          />
        </LinearGradient>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[
              styles.counterButton,
              {
                backgroundColor:
                  data.count === data.target ? "#f59e0b" : "#10b981",
              },
            ]}
            onPress={increment}
            activeOpacity={0.7}
          >
            <Text style={styles.counter}>{data.count}</Text>
            <Text style={styles.counterSubtext}>
              {data.count === data.target ? "MashAllah!" : "Tap to count"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Target Selector */}
      <View style={styles.targetContainer}>
        <Text style={styles.targetLabel}>Choose Your Target:</Text>
        <View style={styles.targetButtons}>
          {TARGETS.map((target) => (
            <TouchableOpacity
              key={target}
              style={[
                styles.targetButton,
                data.target === target && styles.targetButtonActive,
              ]}
              onPress={() => changeTarget(target)}
            >
              <Text
                style={[
                  styles.targetText,
                  data.target === target && styles.targetTextActive,
                ]}
              >
                {target}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.resetButton} onPress={reset}>
          <Text style={styles.resetText}>Reset Tasbih</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.1, // Subtle Islamic pattern overlay
  },
  header: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontFamily: "Inter_800ExtraBold",
    color: "#D4AF37",
    textAlign: "center",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "Inter_500Medium",
    color: "#0D1B2A",
    marginTop: 8,
    opacity: 0.9,
  },
  motivationalQuote: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#0D1B2A",
    marginTop: 12,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  stat: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 20,
    minWidth: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  statNumber: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: "#f59e0b",
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#0D1B2A",
    marginTop: 4,
  },
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    position: "relative",
  },
  progressRing: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  progressRingInner: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 10,
    borderColor: "transparent",
    borderTopColor: "#f5f5dc",
    borderRightColor: "#f5f5dc",
  },
  counterButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  counter: {
    fontSize: 56,
    fontFamily: "Inter_800ExtraBold",
    color: "#f5f5dc",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  counterSubtext: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#f5f5dc",
    opacity: 0.9,
    marginTop: 8,
  },
  targetContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  targetLabel: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#0D1B2A",
    marginBottom: 16,
  },
  targetButtons: {
    flexDirection: "row",
    gap: 12,
  },
  targetButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  targetButtonActive: {
    backgroundColor: "#f59e0b",
    borderColor: "#f59e0b",
  },
  targetText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#0D1B2A",
  },
  targetTextActive: {
    color: "#1e3a8a",
  },
  actions: {
    alignItems: "center",
    marginBottom: 40,
  },
  resetButton: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
    backgroundColor: "rgba(220, 38, 38, 0.9)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  resetText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#f5f5dc",
  },
});
