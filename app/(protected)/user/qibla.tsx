import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { Magnetometer } from "expo-sensors";
import { MapPin, RotateCw } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function QiblaCompass() {
  const [heading, setHeading] = useState<number>(0);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compassCalibrated, setCompassCalibrated] = useState(true);

  const lastHeadingRef = useRef<number>(0);
  const headingHistoryRef = useRef<number[]>([]);

  const KAABA_COORDS = { latitude: 21.4225, longitude: 39.8262 };

  const findQiblaDirection = async () => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission denied");
        Alert.alert(
          "Permission Denied",
          "Location permission is required to find the Qibla."
        );
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const userLat = location.coords.latitude;
      const userLon = location.coords.longitude;

      // Calculate Qibla direction (same formula as Next.js)
      const lat1 = (userLat * Math.PI) / 180;
      const lon1 = (userLon * Math.PI) / 180;
      const lat2 = (KAABA_COORDS.latitude * Math.PI) / 180;
      const lon2 = (KAABA_COORDS.longitude * Math.PI) / 180;

      const dLon = lon2 - lon1;
      const y = Math.sin(dLon) * Math.cos(lat2);
      const x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

      const bearing = (Math.atan2(y, x) * 180) / Math.PI;
      const qibla = (bearing + 360) % 360;

      setQiblaDirection(qibla);
    } catch (err) {
      console.error(err);
      setError("Unable to get location");
      Alert.alert("Error", "Unable to determine Qibla direction.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    findQiblaDirection();

    let magnetometerSubscription: any;
    let lastUpdate = Date.now();

    const setupCompass = async () => {
      try {
        // Check if magnetometer is available
        const available = await Magnetometer.isAvailableAsync();

        if (!available) {
          Alert.alert(
            "Compass Unavailable",
            "Your device does not support compass functionality."
          );
          setCompassCalibrated(false);
          return;
        }

        // iOS-specific: Request motion & orientation permissions
        if (Platform.OS === "ios") {
          // On iOS, we might need additional permissions
          // The magnetometer should work automatically if available
        }

        // Set update interval based on platform
        // iOS handles higher frequency better
        const updateInterval = Platform.OS === "ios" ? 50 : 100;
        Magnetometer.setUpdateInterval(updateInterval);

        magnetometerSubscription = Magnetometer.addListener((data) => {
          const now = Date.now();
          // Throttle updates for performance
          if (now - lastUpdate < (Platform.OS === "ios" ? 30 : 50)) return;
          lastUpdate = now;

          const { x, y, z } = data;

          // Calculate heading from magnetic field
          // Formula works for both iOS and Android
          let angle = Math.atan2(y, x) * (180 / Math.PI);

          // Normalize to 0-360 range
          let normalizedHeading = (angle + 360) % 360;

          // Check for calibration issues (wild jumps or stuck values)
          if (headingHistoryRef.current.length > 0) {
            const lastValue =
              headingHistoryRef.current[headingHistoryRef.current.length - 1];
            const diff = Math.abs(normalizedHeading - lastValue);

            // If the compass seems stuck, it may need calibration
            if (headingHistoryRef.current.length > 20) {
              const variance =
                Math.max(...headingHistoryRef.current) -
                Math.min(...headingHistoryRef.current);
              if (variance < 5) {
                setCompassCalibrated(false);
              } else {
                setCompassCalibrated(true);
              }
            }
          }

          // Keep history for calibration detection
          headingHistoryRef.current.push(normalizedHeading);
          if (headingHistoryRef.current.length > 30) {
            headingHistoryRef.current.shift();
          }

          // Apply smoothing to reduce jitter
          // iOS typically needs less smoothing than Android
          const smoothingFactor = Platform.OS === "ios" ? 0.5 : 0.3;

          setHeading((prevHeading) => {
            // Calculate shortest angular distance
            let diff = normalizedHeading - prevHeading;
            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;

            // Apply smoothing
            const smoothedHeading =
              (prevHeading + diff * smoothingFactor + 360) % 360;
            lastHeadingRef.current = smoothedHeading;
            return smoothedHeading;
          });
        });

        console.log(`Compass setup complete for ${Platform.OS}`);
      } catch (error) {
        console.error("Error setting up compass:", error);
        Alert.alert("Error", "Failed to initialize compass.");
      }
    };

    setupCompass();

    return () => {
      if (magnetometerSubscription) {
        magnetometerSubscription.remove();
      }
    };
  }, []);

  // Calculate marker rotation (same as Next.js)
  const markerRotation =
    qiblaDirection !== null ? (qiblaDirection - heading + 360) % 360 : 0;

  return (
    <LinearGradient colors={["#FDFCFB", "#E2D1C3"]} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🕋 Qibla Compass</Text>

        {/* Compass Circle */}
        <View style={styles.compassContainer}>
          {/* Outer decorative ring */}
          <View style={styles.outerRing} />

          {/* Compass border with cardinal directions - rotates with device */}
          <View
            style={[
              styles.compassBorder,
              {
                transform: [{ rotate: `${-heading}deg` }],
              },
            ]}
          >
            {/* Center circle background */}
            <View style={styles.centerCircle} />

            {/* Cardinal Direction Markers */}
            <View style={[styles.cardinalMarker, styles.northMarker]}>
              <View style={styles.northTriangle} />
              <Text style={styles.cardinalTextN}>N</Text>
            </View>

            <View style={[styles.cardinalMarker, styles.eastMarker]}>
              <Text style={styles.cardinalText}>E</Text>
            </View>

            <View style={[styles.cardinalMarker, styles.southMarker]}>
              <Text style={styles.cardinalText}>S</Text>
            </View>

            <View style={[styles.cardinalMarker, styles.westMarker]}>
              <Text style={styles.cardinalText}>W</Text>
            </View>

            {/* Tick marks */}
            {[...Array(12)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.tickMark,
                  {
                    transform: [
                      { rotate: `${i * 30}deg` },
                      { translateY: -88 },
                    ],
                  },
                  i % 3 === 0 && styles.majorTick,
                ]}
              />
            ))}
          </View>

          {/* Loading Spinner */}
          {loading && (
            <View style={styles.spinnerContainer}>
              <ActivityIndicator size="large" color="#D4AF37" />
            </View>
          )}

          {/* Kaaba Image Marker with glow effect */}
          {qiblaDirection !== null && !loading && (
            <>
              <View
                style={[
                  styles.markerGlow,
                  {
                    transform: [
                      { rotate: `${markerRotation}deg` },
                      { translateY: -96 },
                    ],
                  },
                ]}
              />
              <View
                style={[
                  styles.markerContainer,
                  {
                    transform: [
                      { rotate: `${markerRotation}deg` },
                      { translateY: -96 },
                    ],
                  },
                ]}
              >
                <Image
                  source={require("@/assets/qibla.png")}
                  style={styles.markerImage}
                  resizeMode="contain"
                />
              </View>
            </>
          )}

          {/* Error Display */}
          {error && !loading && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        {/* Direction Display */}
        {qiblaDirection !== null && (
          <View style={styles.directionInfo}>
            <Text style={styles.directionDegrees}>
              {qiblaDirection.toFixed(1)}°
            </Text>
            <Text style={styles.directionLabel}>from True North</Text>
            <Text style={styles.headingDebug}>
              Heading: {heading.toFixed(1)}° •{" "}
              {Platform.OS === "ios" ? "iOS" : "Android"}
            </Text>
            {!compassCalibrated && (
              <Text style={styles.calibrationWarning}>
                ⚠️ Move phone in figure-8 to calibrate
              </Text>
            )}
          </View>
        )}

        {/* Error Message */}
        {error && <Text style={styles.errorMessage}>{error}</Text>}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={findQiblaDirection}
            disabled={loading}
          >
            <RotateCw size={16} color="#2E7D32" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={findQiblaDirection}
            disabled={loading}
          >
            <MapPin size={16} color="#2E7D32" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Current Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: "#2E7D32",
    marginBottom: 30,
    letterSpacing: 0.5,
  },
  compassContainer: {
    width: 240,
    height: 240,
    marginBottom: 24,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  outerRing: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: "#D4AF37",
    opacity: 0.3,
  },
  compassBorder: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 6,
    borderColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(253, 252, 251, 0.95)",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  centerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(46, 125, 50, 0.1)",
    position: "absolute",
  },
  cardinalMarker: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  northMarker: {
    top: 10,
  },
  eastMarker: {
    right: 10,
  },
  southMarker: {
    bottom: 10,
  },
  westMarker: {
    left: 10,
  },
  northTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#DC2626",
    marginBottom: 2,
  },
  cardinalTextN: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#DC2626",
  },
  cardinalText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#2E7D32",
  },
  tickMark: {
    position: "absolute",
    width: 2,
    height: 8,
    backgroundColor: "#2E7D32",
    opacity: 0.4,
  },
  majorTick: {
    height: 12,
    width: 3,
    opacity: 0.6,
  },
  spinnerContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  markerGlow: {
    position: "absolute",
    width: 40,
    height: 40,
    top: "50%",
    left: "50%",
    marginLeft: -20,
    marginTop: -20,
    borderRadius: 20,
    backgroundColor: "#D4AF37",
    opacity: 0.3,
  },
  markerContainer: {
    position: "absolute",
    width: 36,
    height: 36,
    top: "50%",
    left: "50%",
    marginLeft: -18,
    marginTop: -18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerImage: {
    width: 36,
    height: 36,
  },
  errorContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    color: "#8B7355",
    fontSize: 12,
    textAlign: "center",
  },
  directionInfo: {
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "rgba(46, 125, 50, 0.08)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(46, 125, 50, 0.2)",
  },
  directionDegrees: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    color: "#2E7D32",
    letterSpacing: 1,
  },
  directionLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#8B7355",
    marginTop: 2,
    letterSpacing: 0.5,
  },
  headingDebug: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "#8B7355",
    marginTop: 4,
    opacity: 0.7,
  },
  calibrationWarning: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: "#F59E0B",
    marginTop: 6,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 14,
    color: "#DC2626",
    marginBottom: 16,
    fontFamily: "Inter_500Medium",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#2E7D32",
    backgroundColor: "#FDFCFB",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#2E7D32",
    letterSpacing: 0.3,
  },
});

// import { LinearGradient } from "expo-linear-gradient";
// import * as Location from "expo-location";
// import { Magnetometer } from "expo-sensors";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";

// export default function QiblaCompass() {
//   const [heading, setHeading] = useState<number>(0);
//   const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);

//   const KAABA_COORDS = { latitude: 21.4225, longitude: 39.8262 };

//   useEffect(() => {
//     const setup = async () => {
//       try {
//         const { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== "granted") {
//           Alert.alert(
//             "Permission Denied",
//             "Location permission is required to find the Qibla."
//           );
//           return;
//         }

//         const location = await Location.getCurrentPositionAsync({});
//         const userLat = location.coords.latitude;
//         const userLon = location.coords.longitude;

//         // Calculate Qibla direction
//         const lat1 = (userLat * Math.PI) / 180;
//         const lon1 = (userLon * Math.PI) / 180;
//         const lat2 = (KAABA_COORDS.latitude * Math.PI) / 180;
//         const lon2 = (KAABA_COORDS.longitude * Math.PI) / 180;

//         const dLon = lon2 - lon1;
//         const y = Math.sin(dLon) * Math.cos(lat2);
//         const x =
//           Math.cos(lat1) * Math.sin(lat2) -
//           Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

//         const bearing = (Math.atan2(y, x) * 180) / Math.PI;
//         const qibla = (bearing + 360) % 360;

//         setQiblaDirection(qibla);
//       } catch (error) {
//         console.error(error);
//         Alert.alert("Error", "Unable to determine Qibla direction.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     setup();

//     const subscription = Magnetometer.addListener((data) => {
//       const angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
//       const heading = angle >= 0 ? angle : angle + 360;
//       setHeading(heading);
//     });

//     Magnetometer.setUpdateInterval(100);

//     return () => {
//       subscription.remove();
//     };
//   }, []);

//   if (loading || qiblaDirection === null) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#D4AF37" />
//         <Text style={{ marginTop: 10, color: "#0D1B2A" }}>
//           Finding Qibla...
//         </Text>
//       </View>
//     );
//   }

//   const angle = (qiblaDirection - heading + 360) % 360;

//   return (
//     <LinearGradient colors={["#FDFCFB", "#E2D1C3"]} style={styles.container}>
//       <Text style={styles.title}>🕋 Qibla Direction</Text>
//       <View style={styles.compassContainer}>
//         <Image
//           source={require("@/assets/images/qibla.png")}
//           style={[
//             styles.compassImage,
//             { transform: [{ rotate: `${-heading}deg` }] },
//           ]}
//         />
//         <Image
//           source={require("@/assets/images/qibla.png")}
//           style={[
//             styles.arrowImage,
//             { transform: [{ rotate: `${angle}deg` }] },
//           ]}
//         />
//       </View>
//       <Text style={styles.directionText}>
//         {`Qibla is at ${Math.round(angle)}° from North`}
//       </Text>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 24,
//     fontFamily: "Inter_700Bold",
//     color: "#B8860B",
//     marginBottom: 30,
//   },
//   compassContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   compassImage: {
//     width: 250,
//     height: 250,
//     opacity: 0.9,
//   },
//   arrowImage: {
//     position: "absolute",
//     width: 80,
//     height: 80,
//   },
//   directionText: {
//     marginTop: 25,
//     fontSize: 16,
//     fontFamily: "Inter_500Medium",
//     color: "#0D1B2A",
//   },
// });
