// import { useAuth } from "@/app/context/AuthContext";
// import { mobileProfileService } from "@/services/profileService";
// import * as ImagePicker from "expo-image-picker";
// import { StatusBar } from "expo-status-bar";
// import { getIdToken } from "firebase/auth";
// import { ArrowLeft, Camera, Settings } from "lucide-react-native";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// const Profile = () => {
//   const { user } = useAuth();

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar style="light" backgroundColor="#2E7D32" />
//       <View className="flex-row justify-between px-6 py-3 items-center">
//         <TouchableOpacity onPress={() => {}} accessibilityLabel="Back">
//           <Text style={{ color: "white", fontSize: 16 }}>
//             <ArrowLeft color={"#fff"} />
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => {}} accessibilityLabel="Save profile">
//           <Text style={{ color: "white", fontSize: 16 }}>
//             <Settings color={"#fff"} />
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <ProfileImageSection />
//         <View style={styles.container}>
//           {/* <View style={styles.formSection}>
//               <FormField
//                 label="Name *"
//                 value={formData.name}
//                 onChangeText={(value) => handleInputChange("name", value)}
//                 placeholder="Enter your full name"
//                 error={errors.name}
//                 autoCapitalize="words"
//                 accessibilityLabel="Name"
//                 accessibilityHint="Enter your full name"
//               />
//               <FormField
//                 label="Phone"
//                 value={formData.phone}
//                 onChangeText={(value) => handleInputChange("phone", value)}
//                 placeholder="Enter your phone number"
//                 error={errors.phone}
//                 keyboardType="phone-pad"
//                 accessibilityLabel="Phone"
//                 accessibilityHint="Enter your phone number"
//               />
//               <FormField
//                 label="Location"
//                 value={formData.location}
//                 onChangeText={(value) => handleInputChange("location", value)}
//                 placeholder="Enter your location"
//                 autoCapitalize="words"
//                 accessibilityLabel="Location"
//                 accessibilityHint="Enter your location"
//               />
//               <FormField
//                 label="Occupation"
//                 value={formData.occupation}
//                 onChangeText={(value) => handleInputChange("occupation", value)}
//                 placeholder="Enter your occupation"
//                 autoCapitalize="words"
//                 accessibilityLabel="Occupation"
//                 accessibilityHint="Enter your occupation"
//               />
//               <FormField
//                 label="Languages"
//                 value={formData.languages}
//                 onChangeText={(value) => handleInputChange("languages", value)}
//                 placeholder="Enter languages you speak"
//                 autoCapitalize="words"
//                 accessibilityLabel="Languages"
//                 accessibilityHint="Enter languages you speak"
//               />
//               <FormField
//                 label="Bio"
//                 value={formData.bio}
//                 onChangeText={(value) => handleInputChange("bio", value)}
//                 placeholder="Tell us about yourself"
//                 multiline
//                 numberOfLines={4}
//                 style={styles.bioInput}
//                 accessibilityLabel="Bio"
//                 accessibilityHint="Enter a short description about yourself"
//               />
//               <Pressable
//                 style={[
//                   styles.updateButton,
//                   (!hasChanges || isLoading) && styles.updateButtonDisabled,
//                 ]}
//                 onPress={handleUpdate}
//                 disabled={!hasChanges || isLoading}
//                 accessibilityLabel="Update profile"
//                 accessibilityHint="Save changes to your profile"
//               >
//                 {isLoading ? (
//                   <ActivityIndicator color="#FFFFFF" size="small" />
//                 ) : (
//                   <Text style={styles.updateButtonText}>Update Profile</Text>
//                 )}
//               </Pressable>
//               <Pressable
//                 style={[
//                   styles.cancelButton,
//                   (!hasChanges || isLoading) && styles.cancelButtonDisabled,
//                 ]}
//                 onPress={handleCancel}
//                 disabled={!hasChanges || isLoading}
//                 accessibilityLabel="Cancel changes"
//                 accessibilityHint="Discard changes and revert to original profile"
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </Pressable>
//             </View> */}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const ProfileImageSection = () => {
//   const { user } = useAuth();
//   const [imageLoading, setImageLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);

//   const handleImageSelection = async (source: "library" | "camera") => {
//     try {
//       const permissionResult =
//         source === "library"
//           ? await ImagePicker.requestMediaLibraryPermissionsAsync()
//           : await ImagePicker.requestCameraPermissionsAsync();

//       if (!permissionResult.granted) {
//         Alert.alert(
//           "Permission required",
//           `Please allow access to your ${
//             source === "library" ? "photos" : "camera"
//           }`
//         );
//         return;
//       }

//       const result = await (
//         source === "library"
//           ? ImagePicker.launchImageLibraryAsync
//           : ImagePicker.launchCameraAsync
//       )({
//         mediaTypes: ["images"],
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8,
//       });

//       if (!result.canceled && result.assets?.[0]) {
//         await uploadProfileImage(result.assets[0].uri);
//       }
//     } catch (error) {
//       console.error(`Image selection error (${source}):`, error);
//       Alert.alert(
//         "Error",
//         `Failed to ${source === "library" ? "pick image" : "take photo"}`
//       );
//     }
//   };

//   const uploadProfileImage = async (imageUri: string) => {
//     if (!user) {
//       Alert.alert("Error", "User not authenticated. Please log in.");
//       return;
//     }
//     try {
//       setUploading(true);
//       const token = await getIdToken(user, true);
//       const result = await mobileProfileService.uploadImage(imageUri, token);
//       if (result.success) {
//         Alert.alert("Success", "Profile image updated successfully");
//       }
//     } catch (error) {
//       console.error("Image upload error:", error);
//       const errorMessage =
//         error instanceof Error ? error.message : "Failed to upload image";
//       Alert.alert("Error", errorMessage);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <View style={styles.profileImageContainer}>
//       <View style={styles.imageWrapper}>
//         <Image
//           source={{ uri: user?.photoURL || "https://github.com/shadcn.png" }}
//           style={styles.profileImage}
//           resizeMode="cover"
//           accessibilityLabel="User profile image"
//           onLoadStart={() => setImageLoading(true)}
//           onLoadEnd={() => setImageLoading(false)}
//         />
//         {imageLoading && (
//           <View style={styles.imageLoading}>
//             <ActivityIndicator size="small" color="#2E7D32" />
//           </View>
//         )}
//         <Pressable
//           onPress={() =>
//             Alert.alert("Change Profile Photo", "Choose an option", [
//               {
//                 text: "Choose from Library",
//                 onPress: () => handleImageSelection("library"),
//               },
//               {
//                 text: "Take Photo",
//                 onPress: () => handleImageSelection("camera"),
//               },
//               { text: "Cancel", style: "cancel" },
//             ])
//           }
//           style={styles.editImageButton}
//           accessibilityLabel="Edit profile image"
//           accessibilityHint="Change your profile picture"
//           disabled={uploading}
//         >
//           {uploading ? (
//             <ActivityIndicator color="white" size="small" />
//           ) : (
//             <Camera color="#2E7D32" size={16} />
//           )}
//         </Pressable>
//       </View>
//       <Text style={styles.displayName}>{user?.displayName || "User Name"}</Text>
//       <Text style={styles.displayEmail}>
//         {user?.email || "user@example.com"}
//       </Text>
//       <Text style={styles.displayEmail}>Member Since: 13, Oct 2025</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#2E7D32",
//   },
//   keyboardAvoidingView: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//     height: "100%",
//     backgroundColor: "#F5F5DC",
//   },
//   formSection: {
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: "#666",
//     fontFamily: "Inter_400Regular, Inter, sans-serif",
//   },
//   profileImageContainer: {
//     alignItems: "center",
//     marginBottom: 10,
//     paddingVertical: 10,
//   },
//   imageWrapper: {
//     position: "relative",
//     marginBottom: 10,
//   },
//   profileImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     borderColor: "#E8E8E8",
//     borderWidth: 4,
//     backgroundColor: "#F0F0F0",
//   },
//   imageLoading: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F0F0F0",
//     borderRadius: 75,
//   },
//   editImageButton: {
//     position: "absolute",
//     bottom: 8,
//     right: 8,
//     backgroundColor: "#F5F5DC",
//     borderRadius: 20,
//     padding: 8,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   displayName: {
//     fontFamily: "CrimsonText_700Bold",

//     fontSize: 20,
//     color: "#ffffff",
//   },
//   displayEmail: {
//     fontFamily: "CrimsonText_600SemiBold",
//     fontSize: 16,
//     color: "#ffffff",
//   },
//   fieldContainer: {
//     marginBottom: 10,
//   },
//   label: {
//     marginBottom: 3,
//     fontFamily: "Inter_600SemiBold, Inter, sans-serif",
//     fontSize: 16,
//     color: "#333",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#DDD",
//     borderRadius: 8,
//     padding: 12,
//     backgroundColor: "#FFF",
//     fontSize: 16,
//     fontFamily: "Inter_400Regular, Inter, sans-serif",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   multilineInput: {
//     minHeight: 100,
//     textAlignVertical: "top",
//   },
//   bioInput: {
//     minHeight: 100,
//     textAlignVertical: "top",
//   },
//   inputError: {
//     borderColor: "#DC2626",
//   },
//   errorText: {
//     color: "#DC2626",
//     fontSize: 14,
//     marginTop: 4,
//     fontFamily: "Inter_400Regular, Inter, sans-serif",
//   },
//   updateButton: {
//     backgroundColor: "#2E7D32",
//     borderRadius: 8,
//     padding: 16,
//     alignItems: "center",
//     marginTop: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   updateButtonDisabled: {
//     backgroundColor: "#9CA3AF",
//     opacity: 0.6,
//   },
//   updateButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontFamily: "Inter_600SemiBold, Inter, sans-serif",
//   },
//   cancelButton: {
//     backgroundColor: "#B0BEC5",
//     borderRadius: 8,
//     padding: 16,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   cancelButtonDisabled: {
//     backgroundColor: "#9CA3AF",
//     opacity: 0.6,
//   },
//   cancelButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontFamily: "Inter_600SemiBold, Inter, sans-serif",
//   },
// });

// export default Profile;

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
    Alert.alert("Settings", "Settings functionality would go here");
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
    <SafeAreaView style={styles.safeArea}>
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
          {/* Score Streak */}
          {/* <View className="flex-row items-center justify-between mb-4">
            <View>
              <View>
                <View className="flex-row items-center gap-2">
                  <Text
                    style={{
                      fontFamily: "CrimsonText_700Bold",
                      fontSize: 20,
                      lineHeight: 14,
                    }}
                  >
                    Score Streak
                  </Text>
                  <Image
                    source={require("@/assets/icons/trophy.png")}
                    style={{ width: 22, height: 22 }}
                  />
                </View>
                <Text
                  style={{
                    fontFamily: "CrimsonText_400Regular_Italic",
                    fontSize: 15,
                  }}
                >
                  Keep your streak going!
                </Text>
              </View>
              <View></View>
            </View>
          </View> */}
          {/* Score Streak with Progress */}
          <View className="flex-row items-center justify-between mb-4">
            <View style={{ flex: 1 }}>
              <View className="flex-row items-center gap-2 mb-2">
                <Text
                  style={{
                    fontFamily: "CrimsonText_700Bold",
                    fontSize: 20,
                    lineHeight: 14,
                  }}
                >
                  Score Streak
                </Text>
                <Image
                  source={require("@/assets/icons/trophy.png")}
                  style={{ width: 22, height: 22 }}
                />
              </View>
              <Text
                style={{
                  fontFamily: "CrimsonText_400Regular_Italic",
                  fontSize: 15,
                  marginBottom: 12,
                }}
              >
                Keep your streak going!
              </Text>

              {/* Week Progress */}
              <View className="bg-[#fcfcf5] rounded-3xl p-4 shadow-sm mb-16">
                <View className="flex-row justify-between mb-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day, index) => (
                      <Text
                        key={index}
                        style={{
                          fontFamily: "CrimsonText_600SemiBold",
                          fontSize: 12,
                          color:
                            index === new Date().getDay() - 1
                              ? "#3B82F6"
                              : "#6B7280",
                        }}
                      >
                        {day}
                      </Text>
                    )
                  )}
                </View>

                {/* Progress Bars */}
                <View className="flex-row justify-between items-end">
                  {[1, 2, 3, 4, 5, 6, 7].map((day, index) => {
                    const isCompleted = index <= 2; // Example: days 1-3 completed
                    const isToday = index === 3; // Example: today is day 4
                    const height = isCompleted ? 24 : isToday ? 20 : 16;

                    return (
                      <View key={index} className="items-center">
                        <View
                          className={`rounded-t-lg ${
                            isCompleted
                              ? "bg-green-500"
                              : isToday
                                ? "bg-blue-400"
                                : "bg-gray-300"
                          }`}
                          style={{
                            width: 12,
                            height: height,
                            marginBottom: 4,
                          }}
                        />
                        <Text
                          style={{
                            fontFamily: "CrimsonText_700Bold",
                            fontSize: 10,
                            color: isCompleted
                              ? "#059669"
                              : isToday
                                ? "#3B82F6"
                                : "#9CA3AF",
                          }}
                        >
                          {isCompleted ? "✓" : isToday ? "•" : ""}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                {/* Streak Summary */}
                <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-gray-200">
                  <View className="items-center">
                    <Text
                      style={{
                        fontFamily: "CrimsonText_400Regular",
                        fontSize: 12,
                        color: "#6B7280",
                      }}
                    >
                      Current
                    </Text>
                    <Text
                      style={{
                        fontFamily: "CrimsonText_700Bold",
                        fontSize: 16,
                        color: "#059669",
                      }}
                    >
                      3 days
                    </Text>
                  </View>

                  <View className="items-center">
                    <Text
                      style={{
                        fontFamily: "CrimsonText_400Regular",
                        fontSize: 12,
                        color: "#6B7280",
                      }}
                    >
                      Best
                    </Text>
                    <Text
                      style={{
                        fontFamily: "CrimsonText_700Bold",
                        fontSize: 16,
                        color: "#DC2626",
                      }}
                    >
                      7 days
                    </Text>
                  </View>

                  <View className="items-center">
                    <Text
                      style={{
                        fontFamily: "CrimsonText_400Regular",
                        fontSize: 12,
                        color: "#6B7280",
                      }}
                    >
                      Total
                    </Text>
                    <Text
                      style={{
                        fontFamily: "CrimsonText_700Bold",
                        fontSize: 16,
                        color: "#7C3AED",
                      }}
                    >
                      42 days
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* invite friends $ Premium */}
          <View>
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-3">
                <Image
                  source={require("@/assets/icons/giftbox.png")}
                  // style={styles.profileImage}
                  style={{ width: 22, height: 22 }}
                />
                <View>
                  <Text
                    style={{
                      fontFamily: "CrimsonText_600SemiBold",
                      fontSize: 17,
                      lineHeight: 12,
                    }}
                  >
                    Invite Friends
                  </Text>
                  <Text
                    style={{
                      fontFamily: "CrimsonText_400Regular_Italic",
                      fontSize: 15,
                    }}
                  >
                    Get Premium for free
                  </Text>
                </View>
              </View>
              <ChevronRight />
            </View>

            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("@/assets/icons/premium.png")}
                  // style={styles.profileImage}
                  style={{ width: 27, height: 27 }}
                />
                <View>
                  <Text
                    style={{
                      fontFamily: "CrimsonText_600SemiBold",
                      fontSize: 17,
                      lineHeight: 12,
                    }}
                  >
                    Upgrade to Premium
                  </Text>
                  <Text
                    style={{
                      fontFamily: "CrimsonText_400Regular_Italic",
                      fontSize: 15,
                    }}
                  >
                    Unlock all features
                  </Text>
                </View>
              </View>

              <ChevronRight />
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Image
                  source={require("@/assets/icons/review.png")}
                  // style={styles.profileImage}
                  style={{ width: 24, height: 24 }}
                />
                <View>
                  <Text
                    style={{
                      fontFamily: "CrimsonText_600SemiBold",
                      fontSize: 17,
                    }}
                  >
                    Leave a Review
                  </Text>
                </View>
              </View>

              <ChevronRight />
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
    paddingVertical: 16,
    backgroundColor: "#2E7D32",
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
