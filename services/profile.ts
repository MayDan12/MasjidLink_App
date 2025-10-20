// services/profile.ts
import { auth, db } from "@/firebase/firebaseConfig";
import { updateProfile as updateAuthProfile } from "firebase/auth";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";

// Upload image to Cloudinary
export const uploadImage = async (imageUri: string) => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "profile.jpg",
    } as any);

    formData.append(
      "upload_preset",
      process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await uploadResponse.json();

    if (result.error) throw new Error(result.error.message);

    return {
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    return {
      error: true,
      message: (error as Error).message || "Failed to upload image",
    };
  }
};

export const updateProfile = async (data: {
  name: string;
  phone?: string;
  location?: string;
  bio?: string;
  profilePicture?: string;
  skills?: string;
  occupation?: string;
  languages?: string;
}) => {
  const user = auth.currentUser;
  if (!user) return { error: true, message: "Not authenticated" };

  try {
    const userRef = doc(db, "users", user.uid);

    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    // Update Firebase Auth profile
    if (data.name || data.profilePicture) {
      await updateAuthProfile(user, {
        displayName: data.name,
        photoURL: data.profilePicture,
      });
    }

    return { success: true, message: "Profile updated successfully" };
  } catch (err) {
    console.error("Profile update failed:", err);
    return { error: true, message: "Failed to update profile." };
  }
};

export const getUsersProfile = async () => {
  const user = auth.currentUser;
  if (!user) return { error: true, message: "Not authenticated" };

  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      return { error: true, message: "User profile not found" };
    }

    return { success: true, data: snap.data() };
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return { error: true, message: "Failed to fetch user profile." };
  }
};
