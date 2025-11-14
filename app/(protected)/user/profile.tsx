import { useAuth } from "@/app/context/AuthContext";
import { mobileProfileService } from "@/services/profileService";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { getIdToken } from "firebase/auth";
import { ArrowLeft, Camera, ChevronRight, Settings } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh - you can add actual data refetching here
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleBack = () => {
    navigation.goBack?.();
  };

  const handleSettings = () => {
    // Navigate to settings or show settings modal
    router.push("/user/account/settings");
  };

  const getMemberSinceDate = () => {
    if (user?.metadata?.creationTime) {
      return new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return "October 13, 2025"; // Fallback date
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom", "left", "right"]}>
      <StatusBar style="light" backgroundColor="#2E7D32" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.headerButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSettings}
          style={styles.headerButton}
          accessibilityLabel="Settings"
          accessibilityRole="button"
        >
          <Settings color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
            colors={["#fff"]}
          />
        }
      >
        <ProfileImageSection memberSince={getMemberSinceDate()} />

        <View style={styles.container}>
          {/* Score Streak Section */}
          <View className="mb-8">
            <View className="flex-row items-center gap-3 mb-3">
              <Image
                source={require("@/assets/icons/trophy.png")}
                style={{ width: 24, height: 24 }}
              />
              <Text
                style={{
                  fontFamily: "CrimsonText_700Bold",
                  fontSize: 22,
                  color: "#1F2937",
                }}
              >
                Score Streak
              </Text>
            </View>

            <Text
              style={{
                fontFamily: "CrimsonText_400Regular_Italic",
                fontSize: 16,
                color: "#6B7280",
                marginBottom: 16,
              }}
            >
              Keep your streak going!
            </Text>

            {/* Week Progress Card */}
            <View className="bg-[#fcfcf5] rounded-3xl p-5 shadow-lg border border-gray-100">
              {/* Days Header */}
              <View className="flex-row justify-between mb-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day, index) => {
                    const isToday = index === new Date().getDay() - 1;
                    return (
                      <View key={index} className="items-center">
                        <Text
                          style={{
                            fontFamily: isToday
                              ? "CrimsonText_700Bold"
                              : "CrimsonText_600SemiBold",
                            fontSize: 13,
                            color: isToday ? "#3B82F6" : "#6B7280",
                          }}
                        >
                          {day}
                        </Text>
                      </View>
                    );
                  }
                )}
              </View>

              {/* Progress Bars */}
              <View className="flex-row justify-between items-end mb-1">
                {[1, 2, 3, 4, 5, 6, 7].map((day, index) => {
                  const isCompleted = index <= 2;
                  const isToday = index === 3;
                  const height = isCompleted ? 28 : isToday ? 24 : 20;

                  return (
                    <View key={index} className="items-center flex-1">
                      <View
                        className={`rounded-t-lg ${
                          isCompleted
                            ? "bg-green-500"
                            : isToday
                              ? "bg-blue-400"
                              : "bg-gray-300"
                        }`}
                        style={{
                          width: 14,
                          height: height,
                          marginBottom: 6,
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: "CrimsonText_700Bold",
                          fontSize: 12,
                          color: isCompleted
                            ? "#059669"
                            : isToday
                              ? "#3B82F6"
                              : "#9CA3AF",
                        }}
                      >
                        {isCompleted ? "✓" : isToday ? "Today" : ""}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Streak Summary */}
              <View className="flex-row justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <View className="items-center flex-1">
                  <Text
                    style={{
                      fontFamily: "CrimsonText_400Regular",
                      fontSize: 13,
                      color: "#6B7280",
                      marginBottom: 2,
                    }}
                  >
                    Current
                  </Text>
                  <Text
                    style={{
                      fontFamily: "CrimsonText_700Bold",
                      fontSize: 18,
                      color: "#059669",
                    }}
                  >
                    3 days
                  </Text>
                </View>

                <View className="h-8 w-px bg-gray-300" />

                <View className="items-center flex-1">
                  <Text
                    style={{
                      fontFamily: "CrimsonText_400Regular",
                      fontSize: 13,
                      color: "#6B7280",
                      marginBottom: 2,
                    }}
                  >
                    Best
                  </Text>
                  <Text
                    style={{
                      fontFamily: "CrimsonText_700Bold",
                      fontSize: 18,
                      color: "#DC2626",
                    }}
                  >
                    7 days
                  </Text>
                </View>

                <View className="h-8 w-px bg-gray-300" />

                <View className="items-center flex-1">
                  <Text
                    style={{
                      fontFamily: "CrimsonText_400Regular",
                      fontSize: 13,
                      color: "#6B7280",
                      marginBottom: 2,
                    }}
                  >
                    Total
                  </Text>
                  <Text
                    style={{
                      fontFamily: "CrimsonText_700Bold",
                      fontSize: 18,
                      color: "#7C3AED",
                    }}
                  >
                    42 days
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Actions Section */}
          <View className="bg-[#fcfcf5] rounded-3xl p-1 shadow-lg border border-gray-100">
            {/* Invite Friends */}
            <View className="flex-row items-center justify-between p-4 active:bg-gray-50 rounded-2xl">
              <View className="flex-row items-center gap-4 flex-1">
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                  <Image
                    source={require("@/assets/icons/giftbox.png")}
                    style={{ width: 20, height: 20 }}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    style={{
                      fontFamily: "CrimsonText_600SemiBold",
                      fontSize: 17,
                      color: "#1F2937",
                      marginBottom: 2,
                    }}
                  >
                    Invite Friends
                  </Text>
                  <Text
                    style={{
                      fontFamily: "CrimsonText_400Regular_Italic",
                      fontSize: 14,
                      color: "#6B7280",
                    }}
                  >
                    Get Premium for free
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>

            <View className="h-px bg-gray-200 mx-4" />

            {/* Upgrade to Premium */}
            <View className="flex-row items-center justify-between p-4 active:bg-gray-50 rounded-2xl">
              <View className="flex-row items-center gap-4 flex-1">
                <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center">
                  <Image
                    source={require("@/assets/icons/premium.png")}
                    style={{ width: 22, height: 22 }}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    style={{
                      fontFamily: "CrimsonText_600SemiBold",
                      fontSize: 17,
                      color: "#1F2937",
                      marginBottom: 2,
                    }}
                  >
                    Upgrade to Premium
                  </Text>
                  <Text
                    style={{
                      fontFamily: "CrimsonText_400Regular_Italic",
                      fontSize: 14,
                      color: "#6B7280",
                    }}
                  >
                    Unlock all features
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>

            <View className="h-px bg-gray-200 mx-4" />

            {/* Leave a Review */}
            <View className="flex-row items-center justify-between p-4 active:bg-gray-50 rounded-2xl">
              <View className="flex-row items-center gap-4 flex-1">
                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                  <Image
                    source={require("@/assets/icons/review.png")}
                    style={{ width: 20, height: 20 }}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    style={{
                      fontFamily: "CrimsonText_600SemiBold",
                      fontSize: 17,
                      color: "#1F2937",
                    }}
                  >
                    Leave a Review
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ProfileImageSection = ({ memberSince }: { memberSince: string }) => {
  const { user } = useAuth();
  const [imageLoading, setImageLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleImageSelection = async (source: "library" | "camera") => {
    try {
      const permissionResult =
        source === "library"
          ? await ImagePicker.requestMediaLibraryPermissionsAsync()
          : await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission required",
          `Please allow access to your ${
            source === "library" ? "photos" : "camera"
          }`
        );
        return;
      }

      const result = await (
        source === "library"
          ? ImagePicker.launchImageLibraryAsync
          : ImagePicker.launchCameraAsync
      )({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        await uploadProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error(`Image selection error (${source}):`, error);
      Alert.alert(
        "Error",
        `Failed to ${source === "library" ? "pick image" : "take photo"}`
      );
    }
  };

  const uploadProfileImage = async (imageUri: string) => {
    if (!user) {
      Alert.alert("Error", "User not authenticated. Please log in.");
      return;
    }
    try {
      setUploading(true);
      const token = await getIdToken(user, true);
      const result = await mobileProfileService.uploadImage(imageUri, token);
      if (result.success) {
        Alert.alert("Success", "Profile image updated successfully");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload image";
      Alert.alert("Error", errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.profileImageContainer}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: user?.photoURL || "https://github.com/shadcn.png" }}
          style={styles.profileImage}
          resizeMode="cover"
          accessibilityLabel="User profile image"
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />
        {imageLoading && (
          <View style={styles.imageLoading}>
            <ActivityIndicator size="small" color="#2E7D32" />
          </View>
        )}
        <Pressable
          onPress={() =>
            Alert.alert("Change Profile Photo", "Choose an option", [
              {
                text: "Choose from Library",
                onPress: () => handleImageSelection("library"),
              },
              {
                text: "Take Photo",
                onPress: () => handleImageSelection("camera"),
              },
              { text: "Cancel", style: "cancel" },
            ])
          }
          style={styles.editImageButton}
          accessibilityLabel="Edit profile image"
          accessibilityHint="Change your profile picture"
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Camera color="#2E7D32" size={16} />
          )}
        </Pressable>
      </View>
      <Text style={styles.displayName}>{user?.displayName || "User Name"}</Text>
      <Text style={styles.displayEmail}>
        {user?.email || "user@example.com"}
      </Text>
      <Text style={styles.displayEmail}>Member Since: {memberSince}</Text>
      <Pressable
        className="bg-sand px-3 py-1 rounded-3xl"
        onPress={() => router.push("/user/account/profileupdate")}
      >
        <Text style={styles.actionButtonText}>Edit Profile</Text>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#2E7D32",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,

    backgroundColor: "#2E7D32",
    paddingTop: 44,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5DC",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 20,
  },
  profileImageContainer: {
    alignItems: "center",

    paddingHorizontal: 20,
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "#F0F0F0",
  },
  imageLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 60,
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#F5F5DC",
    borderRadius: 20,
    padding: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  editImageButtonDisabled: {
    opacity: 0.7,
  },
  displayName: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 24,
    color: "#ffffff",
    marginBottom: 4,
    textAlign: "center",
  },
  displayEmail: {
    fontFamily: "CrimsonText_600SemiBold",
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
    textAlign: "center",
  },
  memberSince: {
    fontFamily: "CrimsonText_400Regular",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  infoCardsContainer: {
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: "#333",
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: "#2E7D32",
    fontSize: 14,
    fontFamily: "CrimsonText_600SemiBold",
    fontWeight: "600",
  },
  secondaryActionButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#DC2626",
  },
  secondaryActionButtonText: {
    color: "#DC2626",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
});

export default Profile;
