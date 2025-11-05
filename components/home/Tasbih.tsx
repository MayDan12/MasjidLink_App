import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
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
  const [currentQuote, setCurrentQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem("tasbihData");
        if (saved) {
          setData(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    loadData();
  }, []);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(
        MOTIVATIONAL_QUOTES[
          Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
        ]
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const increment = () => {
    setData((prev) => {
      const newCount = prev.count + 1;
      if (newCount === prev.target) {
        if (Platform.OS !== "web") {
          Vibration.vibrate([0, 300, 150, 300]);
        }
        Alert.alert("MashAllah!", "Completed your target!");
        setTimeout(() => {
          setData((curr) => ({
            ...curr,
            count: 0,
            completedCycles: curr.completedCycles + 1,
          }));
        }, 1500);
      } else {
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
          onPress: () => setData((prev) => ({ ...prev, count: 0 })),
        },
      ]
    );
  };

  const changeTarget = (newTarget: number) => {
    setData((prev) => ({ ...prev, target: newTarget, count: 0 }));
  };

  return (
    <LinearGradient
      colors={["#FFFFFF", "#F5F5DC"]}
      style={StyleSheet.absoluteFill}
    >
      <StatusBar style="dark" />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>تسبيح</Text>
          <Text style={styles.subtitle}>Digital Tasbih Counter</Text>
          <Text style={styles.quote}>{currentQuote}</Text>
        </View>

        {/* Counter */}
        <View style={styles.counterContainer}>
          <Text style={styles.counter}>{data.count}</Text>
          <Text style={styles.targetText}>Target: {data.target}</Text>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <Text style={styles.stat}>Cycles: {data.completedCycles}</Text>
        </View>

        {/* Target Buttons */}
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
                  styles.targetButtonText,
                  data.target === target && styles.targetButtonTextActive,
                ]}
              >
                {target}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.incrementButton} onPress={increment}>
            <Text style={styles.incrementText}>Increment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={reset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    color: "#D4AF37",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    color: "#0D1B2A",
    marginTop: 5,
  },
  quote: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#0D1B2A",
    textAlign: "center",
    marginTop: 10,
  },
  counterContainer: {
    alignItems: "center",
  },
  counter: {
    fontSize: 48,
    fontFamily: "Inter_800ExtraBold",
    color: "#0D1B2A",
    marginBottom: 10,
  },
  targetText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    color: "#0D1B2A",
  },
  stats: {
    alignItems: "center",
  },
  stat: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#0D1B2A",
  },
  targetButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  targetButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#E0E7FF",
  },
  targetButtonActive: {
    backgroundColor: "#D4AF37",
  },
  targetButtonText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#0D1B2A",
  },
  targetButtonTextActive: {
    color: "#FFFFFF",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  incrementButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#10b981",
    borderRadius: 8,
  },
  incrementText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#F5F5DC",
  },
  resetButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#DC2626",
    borderRadius: 8,
  },
  resetText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#F5F5DC",
  },
});

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
// const MOTIVATIONAL_QUOTES = [
//   "SubhanAllah fills the scales of good deeds.",
//   "Alhamdulillah brings blessings to your heart.",
//   "Allahu Akbar elevates your soul.",
// ];

// export default function TasbihScreen() {
//   const [data, setData] = useState<TasbihData>({
//     count: 0,
//     target: 33,
//     completedCycles: 0,
//   });
//   const [scaleAnim] = useState(new Animated.Value(1));
//   const [progressAnim] = useState(new Animated.Value(0));
//   const [currentQuote, setCurrentQuote] = useState(MOTIVATIONAL_QUOTES[0]);

//   // Update motivational quote periodically
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const randomQuote =
//         MOTIVATIONAL_QUOTES[
//           Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
//         ];
//       setCurrentQuote(randomQuote);
//     }, 10000); // Change quote every 10 seconds
//     return () => clearInterval(interval);
//   }, []);

//   // Load saved data
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const saved = await AsyncStorage.getItem("tasbihData");
//         if (saved) {
//           const parsed = JSON.parse(saved);
//           setData(parsed);
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
//   }, [progressAnim]);

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
//     Animated.sequence([
//       Animated.timing(scaleAnim, {
//         toValue: 0.9,
//         duration: 120,
//         useNativeDriver: true,
//       }),
//       Animated.timing(scaleAnim, {
//         toValue: 1,
//         duration: 120,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     setData((prev) => {
//       const newCount = prev.count + 1;
//       let newCompletedCycles = prev.completedCycles;

//       if (newCount === prev.target) {
//         newCompletedCycles += 1;
//         if (Platform.OS !== "web") {
//           Vibration.vibrate([0, 300, 150, 300]);
//         }

//         setTimeout(() => {
//           setData((current) => ({ ...current, count: 0 }));
//           progressAnim.setValue(0);
//         }, 1500);

//         Animated.timing(progressAnim, {
//           toValue: 1,
//           duration: 400,
//           useNativeDriver: false,
//         }).start();

//         return {
//           ...prev,
//           count: newCount,
//           completedCycles: newCompletedCycles,
//         };
//       } else {
//         Animated.timing(progressAnim, {
//           toValue: newCount / prev.target,
//           duration: 300,
//           useNativeDriver: false,
//         }).start();

//         if (Platform.OS !== "web") {
//           Vibration.vibrate(60);
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
//       count: 0,
//     }));
//     progressAnim.setValue(0);
//   };

//   const progress = data.count / data.target;
//   const circumference = 2 * Math.PI * 120;

//   return (
//     <LinearGradient
//       colors={["#FFFFFF", "#F5F5DC"]}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={StyleSheet.absoluteFill}
//     >
//       <StatusBar style="light" />

//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.title}>تسبيح</Text>
//         <Text style={styles.subtitle}>Digital Tasbih Counter</Text>
//         <Text style={styles.motivationalQuote}>{currentQuote}</Text>
//       </View>

//       {/* Stats */}
//       <View style={styles.statsContainer}>
//         <View style={styles.stat}>
//           <Text style={styles.statNumber}>{data.completedCycles}</Text>
//           <Text style={styles.statLabel}>Completed Cycles</Text>
//         </View>
//         <View style={styles.stat}>
//           <Text style={styles.statNumber}>{data.target}</Text>
//           <Text style={styles.statLabel}>Target Count</Text>
//         </View>
//       </View>

//       {/* Progress Circle */}
//       <View style={styles.progressContainer}>
//         <LinearGradient
//           colors={["#f59e0b", "#eab308"]}
//           style={styles.progressRing}
//         >
//           <Animated.View
//             style={[
//               styles.progressRingInner,
//               {
//                 transform: [
//                   {
//                     rotate: progressAnim.interpolate({
//                       inputRange: [0, 1],
//                       outputRange: ["0deg", "360deg"],
//                     }),
//                   },
//                 ],
//               },
//             ]}
//           />
//         </LinearGradient>

//         <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
//           <TouchableOpacity
//             style={[
//               styles.counterButton,
//               {
//                 backgroundColor:
//                   data.count === data.target ? "#f59e0b" : "#10b981",
//               },
//             ]}
//             onPress={increment}
//             activeOpacity={0.7}
//           >
//             <Text style={styles.counter}>{data.count}</Text>
//             <Text style={styles.counterSubtext}>
//               {data.count === data.target ? "MashAllah!" : "Tap to count"}
//             </Text>
//           </TouchableOpacity>
//         </Animated.View>
//       </View>

//       {/* Target Selector */}
//       <View style={styles.targetContainer}>
//         <Text style={styles.targetLabel}>Choose Your Target:</Text>
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
//           <Text style={styles.resetText}>Reset Tasbih</Text>
//         </TouchableOpacity>
//       </View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   backgroundImage: {
//     opacity: 0.1, // Subtle Islamic pattern overlay
//   },
//   header: {
//     alignItems: "center",
//     marginTop: 10,
//     marginBottom: 30,
//   },
//   title: {
//     fontSize: 36,
//     fontFamily: "Inter_800ExtraBold",
//     color: "#D4AF37",
//     textAlign: "center",
//     letterSpacing: 1,
//     textShadowColor: "rgba(0, 0, 0, 0.2)",
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 4,
//   },
//   subtitle: {
//     fontSize: 18,
//     fontFamily: "Inter_500Medium",
//     color: "#0D1B2A",
//     marginTop: 8,
//     opacity: 0.9,
//   },
//   motivationalQuote: {
//     fontSize: 14,
//     fontFamily: "Inter_400Regular",
//     color: "#0D1B2A",
//     marginTop: 12,
//     textAlign: "center",
//     paddingHorizontal: 20,
//     lineHeight: 20,
//   },
//   statsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginBottom: 40,
//     paddingHorizontal: 20,
//   },
//   stat: {
//     alignItems: "center",
//     backgroundColor: "rgba(255, 255, 255, 0.15)",
//     paddingVertical: 18,
//     paddingHorizontal: 30,
//     borderRadius: 20,
//     minWidth: 100,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   statNumber: {
//     fontSize: 28,
//     fontFamily: "Inter_700Bold",
//     color: "#f59e0b",
//   },
//   statLabel: {
//     fontSize: 14,
//     fontFamily: "Inter_500Medium",
//     color: "#0D1B2A",
//     marginTop: 4,
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
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   progressRingInner: {
//     width: 280,
//     height: 280,
//     borderRadius: 140,
//     borderWidth: 10,
//     borderColor: "transparent",
//     borderTopColor: "#f5f5dc",
//     borderRightColor: "#f5f5dc",
//   },
//   counterButton: {
//     width: 220,
//     height: 220,
//     borderRadius: 110,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 12,
//     elevation: 12,
//     borderWidth: 2,
//     borderColor: "rgba(255, 255, 255, 0.2)",
//   },
//   counter: {
//     fontSize: 56,
//     fontFamily: "Inter_800ExtraBold",
//     color: "#f5f5dc",
//     textShadowColor: "rgba(0, 0, 0, 0.2)",
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 4,
//   },
//   counterSubtext: {
//     fontSize: 14,
//     fontFamily: "Inter_500Medium",
//     color: "#f5f5dc",
//     opacity: 0.9,
//     marginTop: 8,
//   },
//   targetContainer: {
//     alignItems: "center",
//     marginBottom: 30,
//   },
//   targetLabel: {
//     fontSize: 18,
//     fontFamily: "Inter_600SemiBold",
//     color: "#0D1B2A",
//     marginBottom: 16,
//   },
//   targetButtons: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   targetButton: {
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     borderRadius: 30,
//     backgroundColor: "rgba(255, 255, 255, 0.15)",
//     borderWidth: 1,
//     borderColor: "rgba(255, 255, 255, 0.3)",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   targetButtonActive: {
//     backgroundColor: "#f59e0b",
//     borderColor: "#f59e0b",
//   },
//   targetText: {
//     fontSize: 16,
//     fontFamily: "Inter_600SemiBold",
//     color: "#0D1B2A",
//   },
//   targetTextActive: {
//     color: "#1e3a8a",
//   },
//   actions: {
//     alignItems: "center",
//     marginBottom: 40,
//   },
//   resetButton: {
//     paddingVertical: 14,
//     paddingHorizontal: 36,
//     borderRadius: 30,
//     backgroundColor: "rgba(220, 38, 38, 0.9)",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 6,
//   },
//   resetText: {
//     fontSize: 16,
//     fontFamily: "Inter_600SemiBold",
//     color: "#f5f5dc",
//   },
// });
