import { useAuth } from "@/app/context/AuthContext";
import { mobileProfileService } from "@/services/profileService";
import { UpdateProfileData } from "@/types/profile";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { getIdToken } from "firebase/auth";
import { isValidPhoneNumber } from "libphonenumber-js";
import { debounce } from "lodash";
import { Camera } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProfileUpdateForm {
  name: string;
  phone: string;
  location: string;
  bio: string;
  occupation: string;
  languages: string;
}

const ProfileUpdate = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState<ProfileUpdateForm>({
    name: "",
    phone: "",
    location: "",
    bio: "",
    occupation: "",
    languages: "",
  });
  const [initialData, setInitialData] = useState<ProfileUpdateForm | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errors, setErrors] = useState<Partial<ProfileUpdateForm>>({});

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) {
      Alert.alert("Error", "User not authenticated. Please log in.");
      setIsFetching(false);
      return;
    }
    try {
      setIsFetching(true);
      const token = await getIdToken(user, true);
      const profileData = await mobileProfileService.getUsersProfile(token);
      const newData = {
        name: profileData.name || user.displayName || "",
        phone: profileData.phone || "",
        location: profileData.location || "",
        bio: profileData.bio || "",
        occupation: profileData.occupation || "",
        languages: profileData.languages || "",
      };
      setFormData(newData);
      setInitialData(newData);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      Alert.alert("Error", "Could not load profile data. Please try again.");
      setFormData({
        name: user.displayName || "",
        phone: "",
        location: "",
        bio: "",
        occupation: "",
        languages: "",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileUpdateForm> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length > 50) {
      newErrors.name = "Name cannot exceed 50 characters";
    }

    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    if (formData.bio.length > 500) {
      newErrors.bio = "Bio cannot exceed 500 characters";
    }

    if (formData.occupation.length > 100) {
      newErrors.occupation = "Occupation cannot exceed 100 characters";
    }

    if (formData.languages.length > 100) {
      newErrors.languages = "Languages cannot exceed 100 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = useCallback(
    debounce((field: keyof ProfileUpdateForm, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    }, 300),
    [errors]
  );

  const hasChanges = initialData
    ? Object.keys(formData).some(
        (key) =>
          formData[key as keyof ProfileUpdateForm] !==
          initialData[key as keyof ProfileUpdateForm]
      )
    : false;

  const handleUpdate = async () => {
    if (!validateForm() || !user) return;

    Alert.alert(
      "Confirm Update",
      "Are you sure you want to save changes to your profile?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Save",
          onPress: async () => {
            setIsLoading(true);
            try {
              const token = await getIdToken(user, true);
              const updateData: UpdateProfileData = {
                name: formData.name,
                phone: formData.phone || undefined,
                location: formData.location || undefined,
                bio: formData.bio || undefined,
                occupation: formData.occupation || undefined,
                languages: formData.languages || undefined,
              };

              await mobileProfileService.updateProfile(updateData, token);
              setInitialData(formData);
              Alert.alert("Success", "Profile updated successfully", [
                { text: "OK" },
              ]);
            } catch (error) {
              console.error("Profile update error:", error);
              Alert.alert(
                "Error",
                "Failed to update profile. Please try again.",
                [{ text: "OK" }]
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    if (initialData) {
      setFormData(initialData);
      setErrors({});
    }
  };

  if (isFetching) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <ProfileImageSection />
            <View style={styles.formSection}>
              <FormField
                label="Name *"
                value={formData.name}
                onChangeText={(value) => handleInputChange("name", value)}
                placeholder="Enter your full name"
                error={errors.name}
                autoCapitalize="words"
                accessibilityLabel="Name"
                accessibilityHint="Enter your full name"
              />
              <FormField
                label="Phone"
                value={formData.phone}
                onChangeText={(value) => handleInputChange("phone", value)}
                placeholder="Enter your phone number"
                error={errors.phone}
                keyboardType="phone-pad"
                accessibilityLabel="Phone"
                accessibilityHint="Enter your phone number"
              />
              <FormField
                label="Location"
                value={formData.location}
                onChangeText={(value) => handleInputChange("location", value)}
                placeholder="Enter your location"
                autoCapitalize="words"
                accessibilityLabel="Location"
                accessibilityHint="Enter your location"
              />
              <FormField
                label="Occupation"
                value={formData.occupation}
                onChangeText={(value) => handleInputChange("occupation", value)}
                placeholder="Enter your occupation"
                autoCapitalize="words"
                accessibilityLabel="Occupation"
                accessibilityHint="Enter your occupation"
              />
              <FormField
                label="Languages"
                value={formData.languages}
                onChangeText={(value) => handleInputChange("languages", value)}
                placeholder="Enter languages you speak"
                autoCapitalize="words"
                accessibilityLabel="Languages"
                accessibilityHint="Enter languages you speak"
              />
              <FormField
                label="Bio"
                value={formData.bio}
                onChangeText={(value) => handleInputChange("bio", value)}
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={4}
                style={styles.bioInput}
                accessibilityLabel="Bio"
                accessibilityHint="Enter a short description about yourself"
              />
              <Pressable
                style={[
                  styles.updateButton,
                  (!hasChanges || isLoading) && styles.updateButtonDisabled,
                ]}
                onPress={handleUpdate}
                disabled={!hasChanges || isLoading}
                accessibilityLabel="Update profile"
                accessibilityHint="Save changes to your profile"
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.updateButtonText}>Update Profile</Text>
                )}
              </Pressable>
              <Pressable
                style={[
                  styles.cancelButton,
                  (!hasChanges || isLoading) && styles.cancelButtonDisabled,
                ]}
                onPress={handleCancel}
                disabled={!hasChanges || isLoading}
                accessibilityLabel="Cancel changes"
                accessibilityHint="Discard changes and revert to original profile"
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const ProfileImageSection = () => {
  const { user } = useAuth();
  const [imageLoading, setImageLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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
            <Camera color="white" size={16} />
          )}
        </Pressable>
      </View>
      <Text style={styles.displayName}>{user?.displayName || "User Name"}</Text>
      <Text style={styles.displayEmail}>
        {user?.email || "user@example.com"}
      </Text>
    </View>
  );
};

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words";
  multiline?: boolean;
  numberOfLines?: number;
  style?: any;
  accessibilityLabel: string;
  accessibilityHint: string;
}

const FormField = React.memo<FormFieldProps>(
  ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    keyboardType = "default",
    autoCapitalize = "sentences",
    multiline = false,
    numberOfLines = 1,
    style,
    accessibilityLabel,
    accessibilityHint,
  }) => {
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            error && styles.inputError,
            style,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? "top" : "center"}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

FormField.displayName = "FormField";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },
  keyboardAvoidingView: {
    flex: 1,
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
  },
  formSection: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    fontFamily: "Inter_400Regular, Inter, sans-serif",
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 10,
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor: "#E8E8E8",
    borderWidth: 4,
    backgroundColor: "#F0F0F0",
  },
  imageLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 75,
  },
  editImageButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#2E7D32",
    borderRadius: 20,
    padding: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  displayName: {
    fontFamily: "Okta-Neue-Black, Inter, sans-serif",
    fontWeight: "700",
    fontSize: 20,
    color: "#1A1A1A",
  },
  displayEmail: {
    fontFamily: "Inter_500Medium, Inter, sans-serif",
    fontSize: 16,
    color: "#666",
  },
  fieldContainer: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 3,
    fontFamily: "Inter_600SemiBold, Inter, sans-serif",
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#FFF",
    fontSize: 16,
    fontFamily: "Inter_400Regular, Inter, sans-serif",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#DC2626",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    marginTop: 4,
    fontFamily: "Inter_400Regular, Inter, sans-serif",
  },
  updateButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  updateButtonDisabled: {
    backgroundColor: "#9CA3AF",
    opacity: 0.6,
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold, Inter, sans-serif",
  },
  cancelButton: {
    backgroundColor: "#B0BEC5",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonDisabled: {
    backgroundColor: "#9CA3AF",
    opacity: 0.6,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold, Inter, sans-serif",
  },
});

export default ProfileUpdate;

// import { useAuth } from "@/app/context/AuthContext";
// import { mobileProfileService } from "@/services/profileService";
// import { UpdateProfileData } from "@/types/profile";
// import { useFonts } from "expo-font";
// import * as ImagePicker from "expo-image-picker";
// import * as SplashScreen from "expo-splash-screen";
// import { StatusBar } from "expo-status-bar";
// import { getIdToken } from "firebase/auth";
// import { Camera } from "lucide-react-native";
// import { useCallback, useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// // Types for better type safety
// // interface UserProfile {
// //   name: string;
// //   email: string;
// //   phone?: string;
// //   location?: string;
// //   bio?: string;
// //   occupation?: string;
// //   languages?: string;
// // }

// SplashScreen.preventAutoHideAsync();

// interface ProfileUpdateForm {
//   name: string;
//   // email: string;
//   phone: string;
//   location: string;
//   bio: string;
//   occupation: string;
//   languages: string;
// }

// const ProfileUpdate = () => {
//   const { user } = useAuth();
//   const [loaded, error] = useFonts({
//     "Okta-Neue-Black": require("@/assets/fonts/Okta-Neue-Black-Italic.otf"),
//   });

//   useEffect(() => {
//     if (loaded || error) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded, error]);

//   // const { user, getIdToken } = useAuth();
//   const [formData, setFormData] = useState<ProfileUpdateForm>({
//     name: "",
//     // email: "",
//     phone: "",
//     location: "",
//     bio: "",
//     occupation: "",
//     languages: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [isFetching, setIsFetching] = useState(true);
//   const [errors, setErrors] = useState<Partial<ProfileUpdateForm>>({});

//   // Fetch user profile data on component mount
//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   const fetchUserProfile = async () => {
//     if (!user) return;
//     try {
//       setIsFetching(true);
//       const token = await getIdToken(user, true);
//       const profileData = await mobileProfileService.getUsersProfile(token);

//       setFormData({
//         name: profileData.name || user?.displayName || "",
//         // email: profileData.email || user?.email || "",
//         phone: profileData.phone || "",
//         location: profileData.location || "",
//         bio: profileData.bio || "",
//         occupation: profileData.occupation || "",
//         languages: profileData.languages || "",
//       });
//     } catch (error) {
//       console.error("Failed to fetch profile:", error);
//       // Fallback to auth user data
//       setFormData((prev) => ({
//         ...prev,
//         name: user?.displayName || "",
//         email: user?.email || "",
//       }));
//     } finally {
//       setIsFetching(false);
//     }
//   };

//   // Validate form
//   const validateForm = (): boolean => {
//     const newErrors: Partial<ProfileUpdateForm> = {};

//     if (!formData.name.trim()) {
//       newErrors.name = "Name is required";
//     }

//     if (
//       formData.phone &&
//       !/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ""))
//     ) {
//       newErrors.phone = "Phone number is invalid";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle input changes
//   const handleInputChange = useCallback(
//     (field: keyof ProfileUpdateForm, value: string) => {
//       setFormData((prev) => ({ ...prev, [field]: value }));
//       // Clear error when user starts typing
//       if (errors[field]) {
//         setErrors((prev) => ({ ...prev, [field]: undefined }));
//       }
//     },
//     [errors]
//   );

//   if (!loaded && !error) {
//     return null;
//   }

//   // Handle profile update
//   const handleUpdate = async () => {
//     if (!validateForm()) return;
//     if (!user) return;

//     setIsLoading(true);
//     try {
//       const token = await getIdToken(user, true);
//       const updateData: UpdateProfileData = {
//         name: formData.name,
//         phone: formData.phone || undefined,
//         location: formData.location || undefined,
//         bio: formData.bio || undefined,
//         occupation: formData.occupation || undefined,
//         languages: formData.languages || undefined,
//       };

//       await mobileProfileService.updateProfile(updateData, token);

//       Alert.alert("Success", "Profile updated successfully", [{ text: "OK" }]);
//     } catch (error) {
//       console.error("Profile update error:", error);
//       Alert.alert("Error", "Failed to update profile. Please try again.", [
//         { text: "OK" },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Check if form has changes from original user data
//   const hasChanges =
//     formData.name !== (user?.displayName || "") ||
//     // formData.email !== (user?.email || "") ||
//     formData.phone !== "" ||
//     formData.location !== "" ||
//     formData.bio !== "" ||
//     formData.occupation !== "" ||
//     formData.languages !== "";

//   if (isFetching) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#2E7D32" />
//           <Text style={styles.loadingText}>Loading profile...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar style="auto" />
//       <KeyboardAvoidingView
//         style={styles.keyboardAvoidingView}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//       >
//         <ScrollView
//           style={styles.scrollView}
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={styles.container}>
//             {/* Profile Image Section */}
//             <ProfileImageSection />

//             {/* Form Section */}
//             <View style={styles.formSection}>
//               <FormField
//                 label="Name *"
//                 value={formData.name}
//                 onChangeText={(value) => handleInputChange("name", value)}
//                 placeholder="Enter your full name"
//                 error={errors.name}
//                 autoCapitalize="words"
//               />

//               <FormField
//                 label="Phone"
//                 value={formData.phone}
//                 onChangeText={(value) => handleInputChange("phone", value)}
//                 placeholder="Enter your phone number"
//                 error={errors.phone}
//                 keyboardType="phone-pad"
//               />

//               <FormField
//                 label="Location"
//                 value={formData.location}
//                 onChangeText={(value) => handleInputChange("location", value)}
//                 placeholder="Enter your location"
//                 autoCapitalize="words"
//               />

//               <FormField
//                 label="Occupation"
//                 value={formData.occupation}
//                 onChangeText={(value) => handleInputChange("occupation", value)}
//                 placeholder="Enter your occupation"
//                 autoCapitalize="words"
//               />

//               <FormField
//                 label="Languages"
//                 value={formData.languages}
//                 onChangeText={(value) => handleInputChange("languages", value)}
//                 placeholder="Enter languages you speak"
//                 autoCapitalize="words"
//               />

//               <FormField
//                 label="Bio"
//                 value={formData.bio}
//                 onChangeText={(value) => handleInputChange("bio", value)}
//                 placeholder="Tell us about yourself"
//                 multiline
//                 numberOfLines={4}
//                 style={styles.bioInput}
//               />

//               <Pressable
//                 style={[
//                   styles.updateButton,
//                   (!hasChanges || isLoading) && styles.updateButtonDisabled,
//                 ]}
//                 onPress={handleUpdate}
//                 disabled={!hasChanges || isLoading}
//               >
//                 {isLoading ? (
//                   <ActivityIndicator color="#FFFFFF" size="small" />
//                 ) : (
//                   <Text style={styles.updateButtonText}>Update Profile</Text>
//                 )}
//               </Pressable>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// // Profile Image Component
// const ProfileImageSection = () => {
//   const { user } = useAuth();
//   const [imageLoading, setImageLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);

//   const userImage = user?.photoURL;

//   const handleEditImage = () => {
//     Alert.alert("Change Profile Photo", "Choose an option", [
//       {
//         text: "Choose from Library",
//         onPress: () => pickImageFromLibrary(),
//       },
//       {
//         text: "Take Photo",
//         onPress: () => takePhoto(),
//       },
//       { text: "Cancel", style: "cancel" },
//     ]);
//   };

//   const pickImageFromLibrary = async () => {
//     try {
//       const permissionResult =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();

//       if (!permissionResult.granted) {
//         Alert.alert(
//           "Permission required",
//           "Please allow access to your photos"
//         );
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ["images"],
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8,
//       });

//       if (!result.canceled && result.assets[0]) {
//         await uploadProfileImage(result.assets[0].uri);
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to pick image from library");
//     }
//   };

//   const takePhoto = async () => {
//     try {
//       const permissionResult =
//         await ImagePicker.requestCameraPermissionsAsync();

//       if (!permissionResult.granted) {
//         Alert.alert(
//           "Permission required",
//           "Please allow access to your camera"
//         );
//         return;
//       }

//       const result = await ImagePicker.launchCameraAsync({
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8,
//       });

//       if (!result.canceled && result.assets[0]) {
//         await uploadProfileImage(result.assets[0].uri);
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to take photo");
//     }
//   };

//   const uploadProfileImage = async (imageUri: string) => {
//     if (!user) return;
//     try {
//       setUploading(true);
//       const token = await getIdToken(user, true);

//       const result = await mobileProfileService.uploadImage(imageUri, token);

//       if (result.success) {
//         Alert.alert("Success", "Profile image updated successfully");
//         // You might want to refresh the user context here
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
//           source={{ uri: userImage || "https://github.com/shadcn.png" }}
//           style={styles.profileImage}
//           resizeMode="cover"
//           accessibilityLabel="User Profile Image"
//           onLoadStart={() => setImageLoading(true)}
//           onLoadEnd={() => setImageLoading(false)}
//         />

//         {imageLoading && (
//           <View style={styles.imageLoading}>
//             <ActivityIndicator size="small" color="#2E7D32" />
//           </View>
//         )}

//         <Pressable
//           onPress={handleEditImage}
//           style={styles.editImageButton}
//           accessibilityLabel="Edit profile image"
//           disabled={uploading}
//         >
//           {uploading ? (
//             <ActivityIndicator color="white" size="small" />
//           ) : (
//             <Camera color="white" size={16} />
//           )}
//         </Pressable>
//       </View>

//       <Text style={styles.displayName}>{user?.displayName || "User Name"}</Text>
//       <Text style={styles.displayEmail}>
//         {user?.email || "user@example.com"}
//       </Text>
//     </View>
//   );
// };

// // Reusable Form Field Component
// interface FormFieldProps {
//   label: string;
//   value: string;
//   onChangeText: (text: string) => void;
//   placeholder: string;
//   error?: string;
//   keyboardType?: "default" | "email-address" | "phone-pad";
//   autoCapitalize?: "none" | "sentences" | "words";
//   multiline?: boolean;
//   numberOfLines?: number;
//   style?: any;
// }

// const FormField: React.FC<FormFieldProps> = ({
//   label,
//   value,
//   onChangeText,
//   placeholder,
//   error,
//   keyboardType = "default",
//   autoCapitalize = "sentences",
//   multiline = false,
//   numberOfLines = 1,
//   style,
// }) => {
//   return (
//     <View style={styles.fieldContainer}>
//       <Text style={styles.label}>{label}</Text>
//       <TextInput
//         style={[
//           styles.input,
//           multiline && styles.multilineInput,
//           error && styles.inputError,
//           style,
//         ]}
//         value={value}
//         onChangeText={onChangeText}
//         placeholder={placeholder}
//         placeholderTextColor="#999"
//         keyboardType={keyboardType}
//         autoCapitalize={autoCapitalize}
//         multiline={multiline}
//         numberOfLines={numberOfLines}
//         textAlignVertical={multiline ? "top" : "center"}
//       />
//       {error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#F5F5DC",
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
//     fontFamily: "Inter_400Regular",
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
//     backgroundColor: "#2E7D32",
//     borderRadius: 20,
//     padding: 8,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   displayName: {
//     fontFamily: "Okta-Neue-Black",
//     fontWeight: "700",
//     fontSize: 20,
//     color: "#1A1A1A",
//   },
//   displayEmail: {
//     fontFamily: "Inter_500Medium",
//     fontSize: 16,
//     color: "#666",
//   },
//   fieldContainer: {
//     marginBottom: 10,
//   },
//   label: {
//     marginBottom: 3,
//     fontFamily: "Inter_600SemiBold",
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
//     fontFamily: "Inter_400Regular",
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
//     fontFamily: "Inter_400Regular",
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
//     fontFamily: "Inter_600SemiBold",
//   },
// });

// export default ProfileUpdate;

// import { useAuth } from "@/app/context/AuthContext";
// import { StatusBar } from "expo-status-bar";
// import { Camera } from "lucide-react-native";
// import { useCallback, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// // Types for better type safety
// interface UserProfile {
//   name: string;
//   email: string;
//   phone: string;
// }

// interface ProfileUpdateForm {
//   name: string;
//   email: string;
//   // phone: string;
// }

// const ProfileUpdate = () => {
//   const { user } = useAuth(); // Assuming update function exists in context
//   const [formData, setFormData] = useState<ProfileUpdateForm>({
//     name: user?.displayName || "",
//     email: user?.email || "",
//     // phone: user?.phone || "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState<Partial<ProfileUpdateForm>>({});

//   // Validate form
//   const validateForm = (): boolean => {
//     const newErrors: Partial<ProfileUpdateForm> = {};

//     if (!formData.name.trim()) {
//       newErrors.name = "Name is required";
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid";
//     }

//     // if (formData.phone && !/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
//     //   newErrors.phone = "Phone number is invalid";
//     // }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle input changes
//   const handleInputChange = useCallback(
//     (field: keyof ProfileUpdateForm, value: string) => {
//       setFormData((prev) => ({ ...prev, [field]: value }));
//       // Clear error when user starts typing
//       if (errors[field]) {
//         setErrors((prev) => ({ ...prev, [field]: undefined }));
//       }
//     },
//     [errors]
//   );

//   // Handle profile update
//   const handleUpdate = async () => {
//     if (!validateForm()) return;

//     setIsLoading(true);
//     try {
//       // Replace with actual API call
//       // await updateUserProfile?.(formData);

//       Alert.alert("Success", "Profile updated successfully", [{ text: "OK" }]);
//     } catch (error) {
//       Alert.alert("Error", "Failed to update profile. Please try again.", [
//         { text: "OK" },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Check if form has changes
//   const hasChanges =
//     formData.name !== (user?.displayName || "") ||
//     formData.email !== (user?.email || "");
//   // formData.phone !== (user?.phone || "");

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar style="auto" />
//       <KeyboardAvoidingView
//         style={styles.keyboardAvoidingView}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//       >
//         <ScrollView
//           style={styles.scrollView}
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={styles.container}>
//             {/* Profile Image Section */}
//             <ProfileImageSection />

//             {/* Form Section */}
//             <View style={styles.formSection}>
//               <FormField
//                 label="Name"
//                 value={formData.name}
//                 onChangeText={(value) => handleInputChange("name", value)}
//                 placeholder="Enter your name"
//                 error={errors.name}
//                 autoCapitalize="words"
//               />

//               <FormField
//                 label="Email"
//                 value={formData.email}
//                 onChangeText={(value) => handleInputChange("email", value)}
//                 placeholder="Enter your email"
//                 error={errors.email}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />

//               {/* <FormField
//                 label="Phone"
//                 value={formData.phone}
//                 onChangeText={(value) => handleInputChange('phone', value)}
//                 placeholder="Enter your phone number"
//                 error={errors.phone}
//                 keyboardType="phone-pad"
//               /> */}

//               <Pressable
//                 style={[
//                   styles.updateButton,
//                   (!hasChanges || isLoading) && styles.updateButtonDisabled,
//                 ]}
//                 onPress={handleUpdate}
//                 disabled={!hasChanges || isLoading}
//               >
//                 {isLoading ? (
//                   <ActivityIndicator color="#FFFFFF" size="small" />
//                 ) : (
//                   <Text style={styles.updateButtonText}>Update Profile</Text>
//                 )}
//               </Pressable>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// // Profile Image Component
// const ProfileImageSection = () => {
//   const { user } = useAuth();
//   const [imageLoading, setImageLoading] = useState(true);

//   const handleEditImage = () => {
//     // Implement image picker logic here
//     Alert.alert("Change Profile Photo", "Choose an option", [
//       { text: "Take Photo", onPress: () => console.log("Take photo") },
//       {
//         text: "Choose from Library",
//         onPress: () => console.log("Choose photo"),
//       },
//       { text: "Cancel", style: "cancel" },
//     ]);
//   };

//   return (
//     <View style={styles.profileImageContainer}>
//       <View style={styles.imageWrapper}>
//         <Image
//           source={{ uri: user?.photoURL || "https://github.com/shadcn.png" }}
//           style={styles.profileImage}
//           resizeMode="cover"
//           accessibilityLabel="User Profile Image"
//           onLoadStart={() => setImageLoading(true)}
//           onLoadEnd={() => setImageLoading(false)}
//         />

//         {imageLoading && (
//           <View style={styles.imageLoading}>
//             <ActivityIndicator size="small" color="#2E7D32" />
//           </View>
//         )}

//         <Pressable
//           onPress={handleEditImage}
//           style={styles.editImageButton}
//           accessibilityLabel="Edit profile image"
//         >
//           <Camera color="white" size={16} />
//         </Pressable>
//       </View>

//       <Text style={styles.displayName}>{user?.displayName || "User Name"}</Text>
//       <Text style={styles.displayEmail}>
//         {user?.email || "user@example.com"}
//       </Text>
//     </View>
//   );
// };

// // Reusable Form Field Component
// interface FormFieldProps {
//   label: string;
//   value: string;
//   onChangeText: (text: string) => void;
//   placeholder: string;
//   error?: string;
//   keyboardType?: "default" | "email-address" | "phone-pad";
//   autoCapitalize?: "none" | "sentences" | "words";
// }

// const FormField: React.FC<FormFieldProps> = ({
//   label,
//   value,
//   onChangeText,
//   placeholder,
//   error,
//   keyboardType = "default",
//   autoCapitalize = "sentences",
// }) => {
//   return (
//     <View style={styles.fieldContainer}>
//       <Text style={styles.label}>{label}</Text>
//       <TextInput
//         style={[styles.input, error && styles.inputError]}
//         value={value}
//         onChangeText={onChangeText}
//         placeholder={placeholder}
//         placeholderTextColor="#999"
//         keyboardType={keyboardType}
//         autoCapitalize={autoCapitalize}
//       />
//       {error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#F5F5DC",
//   },
//   keyboardAvoidingView: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   formSection: {
//     flex: 1,
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
//     backgroundColor: "#2E7D32",
//     borderRadius: 20,
//     padding: 8,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   displayName: {
//     fontFamily: "Inter_700Bold",
//     fontSize: 20,
//     color: "#1A1A1A",
//   },
//   displayEmail: {
//     fontFamily: "Inter_500Medium",
//     fontSize: 16,
//     color: "#666",
//   },
//   fieldContainer: {
//     marginBottom: 8,
//   },
//   label: {
//     marginBottom: 3,
//     fontFamily: "Inter_500Medium",
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
//     fontFamily: "Inter_400Regular",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   inputError: {
//     borderColor: "#DC2626",
//   },
//   errorText: {
//     color: "#DC2626",
//     fontSize: 14,
//     marginTop: 4,
//   },
//   updateButton: {
//     backgroundColor: "#2E7D32",
//     borderRadius: 8,
//     padding: 16,
//     alignItems: "center",
//     marginTop: 10,
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
//     fontWeight: "600",
//   },
// });

// export default ProfileUpdate;
