import { PrayerData } from "@/types/prayer";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { getLocationFromStorage } from "./localstorage";

interface UsePrayerTimesReturn {
  prayerData: PrayerData | null;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  info: { city: string; country: string } | null;
  onRefresh: () => void;
  getCurrentPrayer: () => PrayerTime | null;
  getNextPrayer: () => (PrayerTime & { isTomorrow?: boolean }) | null;
  formatTime: (time: string) => string;
  retry: () => void;
}

interface PrayerTime {
  name: string;
  time: string;
  minutes: number;
}

// Simple in-memory cache for React Native
const prayerDataCache = new Map<
  string,
  { data: PrayerData; timestamp: number }
>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const usePrayerTimes = (): UsePrayerTimesReturn => {
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [info, setInfo] = useState<{ city: string; country: string } | null>(
    null
  );

  const abortControllerRef = useRef<AbortController | null>(null);
  const prayerTimes = useRef<PrayerTime[]>([]);

  // Initialize location - fixed for React Native
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const saved = await getLocationFromStorage();
        if (saved?.city && saved?.country) {
          setInfo({ city: saved.city, country: saved.country });
        } else {
          setLoading(false);
          setError("Please set your location in settings");
        }
      } catch (err) {
        console.error("Location initialization error:", err);
        setError("Failed to load location data");
        setLoading(false);
      }
    };

    initializeLocation();
  }, []);

  const updatePrayerTimes = useCallback((data: PrayerData) => {
    try {
      const prayers = Object.entries(data.timings)
        .filter(([key]) =>
          ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].includes(key)
        )
        .map(([name, time]) => {
          // Handle potential API time format issues
          const cleanTime = String(time).split(" ")[0]; // Remove any timezone suffixes
          const [hours, minutes] = cleanTime.split(":").map(Number);

          if (isNaN(hours) || isNaN(minutes)) {
            console.warn(`Invalid time format for ${name}: ${time}`);
            return { name, time, minutes: 0 };
          }

          return {
            name,
            time: cleanTime,
            minutes: hours * 60 + minutes,
          };
        })
        .sort((a, b) => a.minutes - b.minutes);

      prayerTimes.current = prayers;
    } catch (err) {
      console.error("Error updating prayer times:", err);
    }
  }, []);

  const fetchPrayerTimes = useCallback(
    async (isRefresh = false) => {
      // Clear previous request if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController for React Native
      abortControllerRef.current = new AbortController();

      if (!info?.city || !info?.country) {
        if (!isRefresh) {
          setLoading(false);
        }
        return;
      }

      try {
        if (!isRefresh) {
          setLoading(true);
        }
        setError(null);

        const cacheKey = `${info.city.toLowerCase()}-${info.country.toLowerCase()}`;
        const cached = prayerDataCache.get(cacheKey);

        // Return cached data if it's still valid
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setPrayerData(cached.data);
          updatePrayerTimes(cached.data);
          if (!isRefresh) setLoading(false);
          setRefreshing(false);
          return;
        }

        // React Native compatible fetch with timeout
        const controller = abortControllerRef.current;
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 10000); // 10 second timeout

        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(info.city)}&country=${encodeURIComponent(info.country)}&method=2`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        // Aladhan API specific error handling
        if (data.code !== 200) {
          throw new Error(
            data.data || "Invalid response from prayer times API"
          );
        }

        if (!data.data || !data.data.timings) {
          throw new Error("Invalid prayer times data received");
        }

        setPrayerData(data.data);
        updatePrayerTimes(data.data);

        // Cache the successful response
        prayerDataCache.set(cacheKey, {
          data: data.data,
          timestamp: Date.now(),
        });
      } catch (err: any) {
        // Ignore abort errors
        if (err.name === "AbortError") {
          console.log("Request aborted");
          return;
        }

        console.error("Prayer times fetch error:", err);

        let errorMessage =
          "Unable to load prayer times. Please try again later.";

        if (
          err.message.includes("Network request failed") ||
          err.message.includes("AbortError")
        ) {
          errorMessage =
            "Network error. Please check your internet connection.";
        } else if (err.message.includes("Server error")) {
          errorMessage =
            "Service temporarily unavailable. Please try again later.";
        } else if (err.message.includes("Invalid prayer times data")) {
          errorMessage =
            "Invalid data received. Please check your location settings.";
        }

        setError(errorMessage);

        // Show alert for major errors in development
        if (__DEV__ && !err.message.includes("AbortError")) {
          Alert.alert("Prayer Times Error", errorMessage);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [info?.city, info?.country, updatePrayerTimes]
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPrayerTimes(true);
  }, [fetchPrayerTimes]);

  const getCurrentPrayer = useCallback((): PrayerTime | null => {
    if (prayerTimes.current.length === 0) return null;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (let i = 0; i < prayerTimes.current.length; i++) {
      if (currentTime < prayerTimes.current[i].minutes) {
        return i === 0
          ? prayerTimes.current[prayerTimes.current.length - 1]
          : prayerTimes.current[i - 1];
      }
    }

    return prayerTimes.current[prayerTimes.current.length - 1];
  }, []);

  const getNextPrayer = useCallback(():
    | (PrayerTime & { isTomorrow?: boolean })
    | null => {
    if (prayerTimes.current.length === 0) return null;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (const prayer of prayerTimes.current) {
      if (currentTime < prayer.minutes) {
        return prayer;
      }
    }

    return { ...prayerTimes.current[0], isTomorrow: true };
  }, []);

  const formatTime = useCallback((time: string): string => {
    try {
      if (!time) return "Invalid time";

      const cleanTime = String(time).split(" ")[0]; // Remove any timezone info
      const [hours, minutes] = cleanTime.split(":");
      const hour = parseInt(hours, 10);
      const minute = parseInt(minutes, 10);

      if (isNaN(hour) || isNaN(minute)) {
        return time;
      }

      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
    } catch {
      return time;
    }
  }, []);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Fetch prayer times when location changes
  useEffect(() => {
    if (info?.city && info?.country) {
      fetchPrayerTimes();
    }
  }, [info?.city, info?.country]);

  const retry = useCallback(() => {
    setError(null);
    fetchPrayerTimes(true);
  }, [fetchPrayerTimes]);

  return {
    prayerData,
    loading,
    error,
    refreshing,
    info,
    onRefresh,
    getCurrentPrayer,
    getNextPrayer,
    formatTime,
    retry,
  };
};
