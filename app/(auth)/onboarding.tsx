import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const onboardingData = [
  {
    title: "Prayer Alert",
    description:
      "Choose your adhan, which prayers to be notified of and how often",
    image: require("@/assets/images/prayerboard1.png"),
  },
  {
    title: "Welcome to Masjid App",
    description: "Find nearby masjids, prayer times, and events.",
    image: require("@/assets/images/onboard2.png"),
  },
  {
    title: "Stay Connected",
    description: "Get notifications for prayer times and community updates.",
    image: require("@/assets/images/onboard3.png"),
  },
  {
    title: "Join the Community",
    description: "Participate in events and connect with others.",
    image: require("@/assets/images/onboard4.png"),
  },
];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const fadeAnim = useState(new Animated.Value(0))[0]; // Animation for content fade-in

  // Fade animation for step transitions
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const handleNext = () => {
    if (step < onboardingData.length - 1) {
      fadeAnim.setValue(0); // Reset animation
      setStep(step + 1);
    } else {
      router.replace("/(auth)/signup");
    }
  };

  const handleBack = () => {
    if (step > 0) {
      fadeAnim.setValue(0); // Reset animation
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    router.replace("/(auth)/signup");
  };

  // Dynamic image size based on screen width
  const imageSize = Math.min(width * 0.7, 300);

  return (
    <LinearGradient
      colors={["#FFFFFF", "#F5F5DC"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        {/* <Animated.View
          style={{ opacity: fadeAnim, flex: 1, alignItems: "center" }}
        > */}
        <Image
          source={onboardingData[step].image}
          style={[styles.image, { width: imageSize, height: imageSize }]}
          accessibilityLabel={onboardingData[step].title}
        />

        <Text
          style={styles.title}
          accessibilityRole="header"
          accessibilityLabel={onboardingData[step].title}
        >
          {onboardingData[step].title}
        </Text>
        <Text
          style={styles.description}
          accessibilityRole="text"
          accessibilityLabel={onboardingData[step].description}
        >
          {onboardingData[step].description}
        </Text>

        <View style={styles.dots}>
          {onboardingData.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                step === idx ? styles.activeDot : styles.inactiveDot,
              ]}
              accessibilityLabel={
                step === idx ? "Current step" : "Inactive step"
              }
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {step > 0 && (
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Go to previous step"
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleNext}
            style={styles.nextButton}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={
              step === onboardingData.length - 1 ? "Get Started" : "Next"
            }
          >
            <LinearGradient
              colors={["#2E7D32", "#66BB6A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {step === onboardingData.length - 1 ? "Get Started" : "Next"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {step < onboardingData.length - 1 && (
          <TouchableOpacity
            onPress={handleSkip}
            style={styles.skipButton}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}
        {/* </Animated.View> */}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  image: {
    marginBottom: 32,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    textAlign: "center",
    fontFamily: "Inter_600SemiBold",
    color: "#2E7D32", // Emerald Green
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    fontFamily: "Inter_500Regular",
    color: "#0D1B2A", // Midnight Blue
  },
  dots: {
    flexDirection: "row",
    marginBottom: 32,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  inactiveDot: {
    backgroundColor: "#898D86", // Beige
  },
  activeDot: {
    backgroundColor: "#2E7D32", // Green
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#2E7D32",
  },
  backButtonText: {
    color: "#2E7D32",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  nextButton: {
    transform: [{ scale: 1 }],
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: "#2E7D32",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  skipButton: {
    marginTop: 16,
  },
  skipButtonText: {
    color: "#0D1B2A",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
});

export default Onboarding;
