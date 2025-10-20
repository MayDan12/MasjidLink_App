import { db } from "@/firebase/firebaseConfig"; // your firebase client config
import { doc, getDoc } from "firebase/firestore";

export async function checkUserRole(uid: string): Promise<string | null> {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData?.role || null;
    } else {
      console.log("User document not found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user document:", error);
    return null;
  }
}
