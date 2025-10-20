// import { sanitizeData } from "@/constants/sanitize";
// import { db } from "@/firebase/firebaseConfig";
// import { collection, getDocs } from "firebase/firestore";

// export const getEvents = async () => {
//   try {
//     const snapshot = await getDocs(collection(db, "events"));
//     const events = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...sanitizeData(doc.data()),
//     }));

//     return { success: true, data: events };
//   } catch (error: any) {
//     return { error: true, message: error.message || "Failed to fetch events" };
//   }
// };
import { sanitizeData } from "@/constants/sanitize";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

// Realtime listener
export const subscribeToEvents = (callback: (events: any[]) => void) => {
  try {
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, orderBy("createdAt", "desc"));

    // Listen for realtime updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...sanitizeData(doc.data()),
      }));
      callback(events);
    });

    // Return unsubscribe function so you can stop listening
    return unsubscribe;
  } catch (error: any) {
    console.error("Error subscribing to events:", error.message);
    return () => {}; // empty cleanup if error
  }
};

export const subscribeToImamEvents = (
  imamId: string,
  callback: (events: any[]) => void
) => {
  try {
    const eventsRef = collection(db, "events");
    const q = query(
      eventsRef,
      where("createdBy", "==", imamId),
      orderBy("createdAt", "desc")
    );

    // Listen for realtime updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...sanitizeData(doc.data()),
      }));
      callback(events);
    });

    // Return unsubscribe function so you can stop listening
    return unsubscribe;
  } catch (error: any) {
    console.error(
      `Error subscribing to events for imam ${imamId}:`,
      error.message
    );
    return () => {}; // empty cleanup if error
  }
};
