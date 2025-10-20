// services/auth.ts
import { auth, db } from "@/firebase/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";

interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
  role: "user" | "imam";
  masjidName?: string;
  masjidAddress?: string;
  termsAccepted: boolean;
}

async function testFirestore() {
  const snapshot = await getDocs(collection(db, "users"));
  console.log("Users count:", snapshot.size);
}
testFirestore();

export async function signUpUser({
  email,
  password,
  fullName,
  role,
  masjidName,
  masjidAddress,
  termsAccepted,
}: SignupRequest) {
  if (!email || !password || !fullName || !termsAccepted) {
    throw new Error("All required fields must be provided");
  }

  // Create user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  await updateProfile(user, { displayName: fullName });

  // Prepare user document
  const userDoc = {
    uid: user.uid,
    email,
    fullName,
    role,
    donorRank: "Muḥsin",
    followingMasjids: [],
    termsAccepted,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  let masjidId: string | undefined;

  if (role === "imam") {
    if (!masjidName || !masjidAddress) {
      throw new Error("Masjid name and address are required for imams");
    }

    masjidId = user.uid;

    const masjidDoc = {
      masjidId,
      name: masjidName,
      address: masjidAddress,
      imamId: user.uid,
      imamName: fullName,
      imamApproved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "masjids", masjidId), masjidDoc);
    console.log("Masjid created:", masjidDoc);

    (userDoc as any).masjidId = masjidId;
    (userDoc as any).imamApproved = false;
  }

  await setDoc(doc(db, "users", user.uid), userDoc);
  console.log("User created:", userDoc);

  return {
    success: true,
    uid: user.uid,
    email,
    fullName,
    role,
    ...(role === "imam" && { masjidId, imamApproved: false }),
  };
}
