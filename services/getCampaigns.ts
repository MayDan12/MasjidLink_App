import { sanitizeData } from "@/constants/sanitize";
import { db } from "@/firebase/firebaseConfig";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

// Types
export interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  amountRaised: number;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "upcoming" | "archived";
  category: "general" | "construction" | "education" | "charity" | "emergency";
  imamId: string;
  createdBy: string;
  createdAt: any;
  updatedAt: any;
}

export interface CreateDonationData {
  title: string;
  description: string;
  goal_amount: number;
  startDate: string;
  endDate: string;
  category: DonationCampaign["category"];
}

/** -----------------------------
 *  Realtime Listeners
 * ----------------------------- */

// Realtime listener for all donation campaigns
export const subscribeToDonations = (
  callback: (donations: DonationCampaign[]) => void
) => {
  try {
    const donationsRef = collection(db, "campaigns");
    const q = query(donationsRef, orderBy("createdAt", "desc"));

    // Listen for realtime updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const donations = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...sanitizeData(doc.data()),
      })) as DonationCampaign[];
      callback(donations);
    });

    // Return unsubscribe function so you can stop listening
    return unsubscribe;
  } catch (error: any) {
    console.error("Error subscribing to donations:", error.message);
    return () => {}; // empty cleanup if error
  }
};

// Realtime listener for imam's donation campaigns
export const subscribeToImamDonations = (
  imamId: string,
  callback: (donations: DonationCampaign[]) => void
) => {
  try {
    const donationsRef = collection(db, "campaigns");
    const q = query(
      donationsRef,
      where("imamId", "==", imamId),
      orderBy("createdAt", "desc")
    );

    // Listen for realtime updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const donations = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...sanitizeData(doc.data()),
      })) as DonationCampaign[];
      callback(donations);
    });

    // Return unsubscribe function so you can stop listening
    return unsubscribe;
  } catch (error: any) {
    console.error(
      `Error subscribing to donations for imam ${imamId}:`,
      error.message
    );
    return () => {}; // empty cleanup if error
  }
};

// Realtime listener for active donation campaigns only
export const subscribeToActiveDonations = (
  callback: (donations: DonationCampaign[]) => void
) => {
  try {
    const donationsRef = collection(db, "campaigns");
    const q = query(
      donationsRef,
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const donations = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...sanitizeData(doc.data()),
      })) as DonationCampaign[];
      callback(donations);
    });

    return unsubscribe;
  } catch (error: any) {
    console.error("Error subscribing to active donations:", error.message);
    return () => {};
  }
};

/** -----------------------------
 *  CRUD Operations
 * ----------------------------- */

/**
 * Create a new donation campaign
 */
export const createDonationCampaign = async (
  data: CreateDonationData,
  imamId: string,
  masjidName: string
): Promise<{ success: boolean; id?: string; message?: string }> => {
  try {
    const timestamp = Timestamp.now();

    const donationData = {
      ...data,
      imamId,
      masjidName,
      createdBy: imamId,
      amountRaised: 0,
      status: "active" as const,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const docRef = await addDoc(collection(db, "campaigns"), donationData);

    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error creating donation campaign:", error.message);
    return {
      success: false,
      message: error.message || "Failed to create donation campaign",
    };
  }
};

/**
 * Delete a donation campaign
 */
export const deleteDonationCampaign = async (
  campaignId: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    if (!campaignId) {
      throw new Error("Campaign ID is required");
    }

    await deleteDoc(doc(db, "campaigns", campaignId));

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting donation campaign:", error.message);
    return {
      success: false,
      message: error.message || "Failed to delete donation campaign",
    };
  }
};

/**
 * Update a donation campaign
 */
export const updateDonationCampaign = async (
  campaignId: string,
  updates: Partial<CreateDonationData>
): Promise<{ success: boolean; message?: string }> => {
  try {
    if (!campaignId) {
      throw new Error("Campaign ID is required");
    }

    await updateDoc(doc(db, "campaigns", campaignId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error updating donation campaign:", error.message);
    return {
      success: false,
      message: error.message || "Failed to update donation campaign",
    };
  }
};

/**
 * Update donation campaign status
 */
export const updateDonationStatus = async (
  campaignId: string,
  status: DonationCampaign["status"]
): Promise<{ success: boolean; message?: string }> => {
  try {
    if (!campaignId) {
      throw new Error("Campaign ID is required");
    }

    await updateDoc(doc(db, "campaigns", campaignId), {
      status,
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error updating donation status:", error.message);
    return {
      success: false,
      message: error.message || "Failed to update donation status",
    };
  }
};

/**
 * Update donation amount raised
 */
export const updateAmountRaised = async (
  campaignId: string,
  newAmount: number
): Promise<{ success: boolean; message?: string }> => {
  try {
    if (!campaignId) {
      throw new Error("Campaign ID is required");
    }

    await updateDoc(doc(db, "campaigns", campaignId), {
      amountRaised: newAmount,
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error updating amount raised:", error.message);
    return {
      success: false,
      message: error.message || "Failed to update amount raised",
    };
  }
};

/** -----------------------------
 *  One-time Fetch Operations
 * ----------------------------- */

/**
 * Get all donation campaigns (one-time fetch)
 */
export const getDonationCampaigns = async (): Promise<{
  success: boolean;
  donations?: DonationCampaign[];
  message?: string;
}> => {
  try {
    const donationsRef = collection(db, "campaigns");
    const q = query(donationsRef, orderBy("createdAt", "desc"));

    const snapshot = await getDocs(q);
    const donations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...sanitizeData(doc.data()),
    })) as DonationCampaign[];

    return { success: true, donations };
  } catch (error: any) {
    console.error("Error fetching donations:", error.message);
    return {
      success: false,
      message: error.message || "Failed to fetch donations",
    };
  }
};

/**
 * Get imam's donation campaigns (one-time fetch)
 */
export const getImamDonationCampaigns = async (
  imamId: string
): Promise<{
  success: boolean;
  donations?: DonationCampaign[];
  message?: string;
}> => {
  try {
    const donationsRef = collection(db, "campaigns");
    const q = query(
      donationsRef,
      where("imamId", "==", imamId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    const donations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...sanitizeData(doc.data()),
    })) as DonationCampaign[];

    return { success: true, donations };
  } catch (error: any) {
    console.error("Error fetching imam donations:", error.message);
    return {
      success: false,
      message: error.message || "Failed to fetch imam donations",
    };
  }
};
