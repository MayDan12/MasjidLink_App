import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Intro() {
  return (
    <LinearGradient
      colors={["#FFFFFF", "#F5F5DC"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        {/* Top/center content */}
        <View style={styles.content} className="my-auto">
          <Image
            source={require("@/assets/images/masjidlink.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>MasjidLink</Text>
          <Text style={styles.subtitle}>
            Discover prayer times, events, and more. Please login or get started
            to continue.
          </Text>
        </View>

        {/* Bottom buttons */}
        <View style={styles.links}>
          <Link href="/onboarding" asChild>
            <TouchableOpacity>
              <LinearGradient
                colors={["#2E7D32", "#66BB6A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Link>

          <View className="mb-36">
            <Text style={styles.already}>
              Already have an account?{" "}
              <Link href="/login" asChild>
                <Text style={styles.signin}>Sign In</Text>
              </Link>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
  },
  content: {
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Inter_700Bold",
    fontSize: 50,
    lineHeight: 52,
    color: "#2E7D32", // Emerald Green
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    color: "#0D1B2A", // Midnight Blue for better readability
    fontFamily: "Ephesis_400Regular",
    fontSize: 26,
    lineHeight: 30,
  },
  links: {
    width: "100%",
    paddingHorizontal: 20,
    gap: 20,
  },
  buttonGradient: {
    borderRadius: 8,
    paddingVertical: 14,
  },
  buttonText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  already: {
    color: "#0D1B2A", // Midnight Blue for contrast
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    textAlign: "center",
  },
  signin: {
    color: "#2E7D32", // Green link color
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
});

// import { LinearGradient } from "expo-linear-gradient";
// import { Link } from "expo-router";
// import { Image, StyleSheet, Text, View } from "react-native";

// import { SafeAreaView } from "react-native-safe-area-context";

// export default function Intro() {
//   return (
//     <LinearGradient
//       colors={["#FFFFFF", "#F5F5DC"]}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={styles.background}
//     >
//       <SafeAreaView style={styles.container}>
//         {/* Top/center content */}

//         <View style={styles.content} className="my-auto">
//           <View>
//             {/* Logo */}\
//             <Image
//               source={require("@/assets/images/masjidlink.png")} // adjust the path to where your logo is
//               style={styles.logo}
//               resizeMode="contain"
//             />
//           </View>
//           <Text style={styles.title}>MasjidLink</Text>

//           <Text style={styles.subtitle}>
//             Discover prayer times, events, and more. Please login or get started
//             to continue.
//           </Text>
//         </View>

//         {/* Bottom buttons */}
//         <View style={styles.links} className="">
//           <Link href="/onboarding" asChild>
//             <Text style={styles.button}>Get Started</Text>
//           </Link>
//           <View className="mb-36">
//             <Text style={styles.already} className="text-center text-white">
//               Already have an account?{" "}
//               <Link
//                 style={styles.signin}
//                 href="/login"
//                 className="font-extrabold"
//               >
//                 Sign In
//               </Link>
//             </Text>
//           </View>
//         </View>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     marginBottom: 10,
//   },
//   container: {
//     flex: 1,
//     justifyContent: "space-between", // pushes top content & bottom buttons apart
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.4)",
//     paddingVertical: 40,
//   },
//   content: {
//     paddingHorizontal: 20,
//     alignItems: "center",
//     backgroundColor: "transparent",
//   },
//   title: {
//     textAlign: "center",
//     marginBottom: 20,
//     fontFamily: "Inter_700Bold",
//     fontSize: 50,
//     lineHeight: 52,
//     color: "#2E7D32",
//   },
//   subtitle: {
//     textAlign: "center",
//     marginBottom: 20,
//     color: "#2E7D32",
//     fontFamily: "Ephesis_400Regular",
//     fontSize: 30,
//     lineHeight: 30,
//   },
//   links: {
//     width: "100%",
//     paddingHorizontal: 20,
//     gap: 20,
//   },
//   button: {
//     textAlign: "center",
//     paddingVertical: 14,
//     borderRadius: 8,
//     backgroundColor: "white",
//     color: "black",
//     fontSize: 16,
//     fontFamily: "Inter_600SemiBold",
//   },
//   already: {
//     color: "white",
//     fontFamily: "Inter_400Regular",
//     fontSize: 16,
//   },
//   signin: {
//     color: "white",
//     fontFamily: "Inter_600SemiBold",
//     fontSize: 16,
//   },
// });

// import { LinearGradient } from "expo-linear-gradient";
// import { Link } from "expo-router";
// import { StyleSheet, Text, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function Intro() {
//   return (
//     <LinearGradient
//       style={styles.background}
//       colors={["#5A2A47", "#8C3C64", "#E97C62"]} // coral → violet
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       className="flex-1 items-center justify-center"
//     >
//       <SafeAreaView style={styles.container}>
//         {/* Top/center content */}
//         <View style={styles.content} className="my-auto">
//           <Text style={styles.title}>MasjidLink</Text>

//           <Text style={styles.subtitle}>
//             Discover prayer times, events, and more. Please login or get started
//             to continue.
//           </Text>
//         </View>

//         {/* Bottom buttons */}
//         <View style={styles.links} className="">
//           <Link href="/signup" asChild>
//             <Text style={styles.button}>Get Started</Text>
//           </Link>
//           <View className="mb-36">
//             <Text style={styles.already} className="text-center text-white">
//               Already have an account?{" "}
//               <Link
//                 style={styles.signin}
//                 href="/login"
//                 className="font-extrabold"
//               >
//                 Sign In
//               </Link>
//             </Text>
//           </View>
//         </View>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     justifyContent: "space-between", // pushes top content & bottom buttons apart
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.4)",
//     paddingVertical: 40,
//   },
//   content: {
//     paddingHorizontal: 20,
//     alignItems: "center",
//     backgroundColor: "transparent",
//   },
//   title: {
//     textAlign: "center",
//     marginBottom: 20,
//     fontFamily: "Inter_700Bold",
//     fontSize: 48,
//     lineHeight: 52,
//     color: "white",
//   },
//   subtitle: {
//     textAlign: "center",
//     marginBottom: 20,
//     color: "white",
//     fontFamily: "Inter_400Regular",
//     fontSize: 16,
//   },
//   links: {
//     paddingHorizontal: 20,
//     gap: 20,
//   },
//   button: {
//     width: 300,
//     textAlign: "center",
//     paddingVertical: 14,
//     borderRadius: 50,
//     backgroundColor: "white",
//     color: "black",
//     fontSize: 16,
//     fontFamily: "Inter_600SemiBold",
//   },
//   already: {
//     color: "white",
//     fontFamily: "Inter_400Regular",
//     fontSize: 16,
//   },
//   signin: {
//     color: "white",
//     fontFamily: "Inter_600SemiBold",
//     fontSize: 16,
//   },
// });
