import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  occupation: string;
  languages: string;
}

interface ProfileState extends ProfileData {
  lastFetched: number | null;
  setProfile: (profile: Partial<ProfileData>) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: "",
      email: "",
      phone: "",
      location: "",
      bio: "",
      occupation: "",
      languages: "",
      lastFetched: null,
      setProfile: (profile) =>
        set((state) => ({
          ...state,
          ...profile,
          lastFetched: Date.now(),
        })),
      clearProfile: () =>
        set({
          name: "",
          email: "",
          phone: "",
          location: "",
          bio: "",
          occupation: "",
          languages: "",
          lastFetched: null,
        }),
    }),
    {
      name: "profile-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
