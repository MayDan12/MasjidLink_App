import { sanitizeData } from "@/constants/sanitize";
import { auth, db } from "@/firebase/firebaseConfig";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";

// ✅ Get all masjids
export const getAllMasjids = async () => {
  try {
    const snapshot = await getDocs(collection(db, "masjids"));
    const masjids = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...sanitizeData(docSnap.data()),
    }));

    return { success: true, data: masjids };
  } catch (error: any) {
    return {
      error: true,
      message: error.message || "Failed to fetch masjids.",
    };
  }
};

// ✅ Get masjid by ID
export const getMasjidById = async (masjidId: string) => {
  try {
    const masjidRef = doc(db, "masjids", masjidId);
    const masjidDoc = await getDoc(masjidRef);

    if (!masjidDoc.exists()) {
      return { error: true, message: "Masjid not found." };
    }

    return { success: true, data: sanitizeData(masjidDoc.data()) };
  } catch (error: any) {
    return { error: true, message: error.message || "Failed to fetch masjid." };
  }
};

// ✅ Join masjid
export const joinMasjid = async (masjidId: string) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { error: true, message: "You must be logged in." };
    }

    const { uid, displayName, email, photoURL } = user;

    const userRef = doc(db, "users", uid);
    const masjidRef = doc(db, "masjids", masjidId);
    const followerRef = doc(db, "masjids", masjidId, "followers", uid);

    // check if already following
    const followerDoc = await getDoc(followerRef);
    if (followerDoc.exists()) {
      return { success: true, message: "You have already joined this masjid." };
    }

    // increment followers count
    await updateDoc(masjidRef, {
      followersCount: increment(1),
    });

    // add follower document
    await setDoc(followerRef, {
      userId: uid,
      joinedAt: new Date().toISOString(),
      displayName: displayName || "",
      email: email || "",
      photoURL: photoURL || "",
    });

    // add masjidId to user profile
    await updateDoc(userRef, {
      followers: arrayUnion(masjidId),
    });

    return { success: true, message: "Successfully joined masjid." };
  } catch (error: any) {
    console.error("Join masjid error:", error);
    return { error: true, message: error.message || "Failed to join masjid." };
  }
};
