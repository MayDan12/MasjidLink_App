import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setErrors({
        email: !email.trim() ? "Email is required" : undefined,
        password: !password ? "Password is required" : undefined,
      });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await signIn(email, password);

      Alert.alert("Success", "Welcome back!", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    } catch (err: any) {
      let errorMessage = "An error occurred. Please try again.";
      if (err.message?.includes("user-not-found")) {
        errorMessage = "No account found with this email.";
      } else if (err.message?.includes("wrong-password")) {
        errorMessage = "Incorrect password.";
      } else if (err.message?.includes("invalid-email")) {
        errorMessage = "Invalid email address.";
      }

      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#FFFFFF", "#F5F5DC"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <SafeAreaView style={styles.keyboardView}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          {/* Logo */}
          <Image
            source={require("@/assets/images/masjidlink.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Title */}
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to continue</Text>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#6B7280"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <View className="relative">
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#6B7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                className="absolute right-0 top-2 h-full px-3 py-2 text-gray-600 "
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={23} color="#2E7D32" />
                ) : (
                  <Eye size={23} color="#2E7D32" />
                )}
                <Text className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </Text>
              </TouchableOpacity>
            </View>

            {errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            {/* Forgot Password */}
            <TouchableOpacity onPress={() => router.push("/forgot-password")}>
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#2E7D32", "#66BB6A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.button, loading && { opacity: 0.6 }]}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {errors.general && (
              <Text style={[styles.error, { textAlign: "center" }]}>
                {errors.general}
              </Text>
            )}
          </View>

          {/* Bottom Link */}
          <Text style={styles.signupText}>
            Don’t have an account?{" "}
            <Text
              style={styles.signupLink}
              onPress={() => router.push("/signup")}
            >
              Sign Up
            </Text>
          </Text>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#0D1B2A",
    marginBottom: 24,
  },
  form: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    fontSize: 16,
    color: "#0D1B2A",
  },
  forgot: {
    textAlign: "right",
    color: "#2E7D32",
    fontFamily: "Inter_500Medium",
    marginBottom: 24,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  error: {
    color: "red",
    fontSize: 14,
    marginBottom: 8,
  },
  signupText: {
    marginTop: 20,
    fontSize: 14,
    color: "#0D1B2A",
    fontFamily: "Inter_400Regular",
  },
  signupLink: {
    color: "#2E7D32",
    fontFamily: "Inter_600SemiBold",
  },
});
