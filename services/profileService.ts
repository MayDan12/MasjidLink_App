import {
  ApiResponse,
  ImageUploadResponse,
  ProfileUpdateResponse,
  UpdateProfileData,
  UserProfile,
} from "@/types/profile";
import { Platform } from "react-native";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://masjidlink.live/api";

interface ImageUploadFormData {
  uri: string;
  type: string;
  name: string;
}

// Mobile-specific headers to identify the request source
const getMobileHeaders = () => ({
  "x-mobile-app": "true",
  "x-platform": Platform.OS,
  "user-agent": "ReactNativeMobileApp",
});

export const mobileProfileService = {
  // Upload image
  uploadImage: async (
    imageUri: string,
    token: string
  ): Promise<ImageUploadResponse> => {
    try {
      const formData = new FormData();

      const filename = imageUri.split("/").pop() || "profile.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      const imageData: ImageUploadFormData = {
        uri: Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri,
        type,
        name: filename,
      };

      formData.append("image", imageData as any);
      formData.append("token", token);

      const response = await fetch(`${API_BASE_URL}/profile/upload-image`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          ...getMobileHeaders(),
        },
      });

      const result: ApiResponse<ImageUploadResponse> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      return result as ImageUploadResponse;
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    }
  },

  // Update profile
  updateProfile: async (
    profileData: UpdateProfileData,
    token: string
  ): Promise<ProfileUpdateResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getMobileHeaders(),
        },
        body: JSON.stringify({
          ...profileData,
          token,
        }),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Update failed");
      }

      return result as ProfileUpdateResponse;
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  },

  // Get user profile
  getUsersProfile: async (token: string): Promise<UserProfile> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/profile/get?token=${encodeURIComponent(token)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...getMobileHeaders(),
          },
        }
      );

      const result: ApiResponse<UserProfile> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Fetch failed");
      }

      if (!result.data) {
        throw new Error("No profile data found");
      }

      return result.data;
    } catch (error) {
      console.error("Profile fetch error:", error);
      throw error;
    }
  },
};
