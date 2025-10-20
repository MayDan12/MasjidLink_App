import { auth, db } from "@/firebase/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export interface Masjid {
  id: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  zip_code?: string;
  country: string;
  description?: string;
  established_year?: string;
  capacity?: string;
  denomination?: string;
  facility_types?: string[];
  imam_id: string;
  created_at: string;
  updated_at: string;
}

export interface MasjidFollower {
  id: string;
  masjid_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  followed_at: string;
}

export interface CreateMasjidInput {
  name: string;
  address: string;
  city: string;
  state?: string;
  zip_code?: string;
  country: string;
  description?: string;
  established_year?: string;
  capacity?: string;
  denomination?: string;
  facility_types?: string[];
}

export interface UpdateMasjidInput extends Partial<CreateMasjidInput> {}

export const masjidService = {
  // ✅ Get masjid by imam ID
  async getMasjidByImamId(imamId: string): Promise<Masjid | null> {
    const q = query(collection(db, "masjids"), where("imamId", "==", imamId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docData = snapshot.docs[0];
    return { id: docData.id, ...docData.data() } as Masjid;
  },

  // ✅ Get masjid by ID
  async getMasjidById(masjidId: string): Promise<Masjid | null> {
    const docRef = doc(db, "masjids", masjidId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as Masjid;
  },

  // ✅ Create masjid
  async createMasjid(input: CreateMasjidInput): Promise<Masjid> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const newMasjid = {
      ...input,
      imam_id: user.uid,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "masjids"), newMasjid);
    const createdDoc = await getDoc(docRef);
    return { id: createdDoc.id, ...(createdDoc.data() as Omit<Masjid, "id">) };
  },

  // ✅ Update masjid
  async updateMasjid(
    masjidId: string,
    updates: UpdateMasjidInput
  ): Promise<void> {
    const docRef = doc(db, "masjids", masjidId);
    await updateDoc(docRef, { ...updates, updated_at: serverTimestamp() });
  },

  // ✅ Delete masjid
  async deleteMasjid(masjidId: string): Promise<void> {
    const docRef = doc(db, "masjids", masjidId);
    await deleteDoc(docRef);
  },

  // ✅ Get followers
  async getMasjidFollowers(masjidId: string): Promise<MasjidFollower[]> {
    const q = query(
      collection(db, "masjid_followers"),
      where("masjid_id", "==", masjidId),
      orderBy("followed_at", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MasjidFollower[];
  },

  // ✅ Follow masjid
  async followMasjid(
    masjidId: string,
    userName: string,
    userAvatar?: string
  ): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    await addDoc(collection(db, "masjid_followers"), {
      masjid_id: masjidId,
      user_id: user.uid,
      user_name: userName,
      user_avatar: userAvatar || "",
      followed_at: serverTimestamp(),
    });
  },

  // ✅ Unfollow masjid
  async unfollowMasjid(masjidId: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(
      collection(db, "masjid_followers"),
      where("masjid_id", "==", masjidId),
      where("user_id", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, "masjid_followers", docSnap.id));
    }
  },

  // ✅ Get follower count
  async getFollowerCount(masjidId: string): Promise<number> {
    const q = query(
      collection(db, "masjid_followers"),
      where("masjid_id", "==", masjidId)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  },

  // ✅ Check if user is following
  async isUserFollowing(masjidId: string): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;

    const q = query(
      collection(db, "masjid_followers"),
      where("masjid_id", "==", masjidId),
      where("user_id", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  },
};
