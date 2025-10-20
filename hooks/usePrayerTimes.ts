import { PrayerData } from "@/types/prayer";
import { useCallback, useEffect, useState } from "react";

export const usePrayerTimes = () => {
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPrayerTimes = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(
        "https://api.aladhan.com/v1/timingsByCity?city=Lagos&country=Nigeria&method=2"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch prayer times");
      }

      const data = await response.json();
      setPrayerData(data.data);
    } catch (err) {
      console.error("Prayer times fetch error:", err);
      setError(
        "Unable to load prayer times. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  const getCurrentPrayer = useCallback(() => {
    if (!prayerData) return null;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayerTimes = Object.entries(prayerData.timings)
      .filter(([key]) =>
        ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].includes(key)
      )
      .map(([name, time]) => {
        const [hours, minutes] = time.split(":").map(Number);
        return { name, time, minutes: hours * 60 + minutes };
      })
      .sort((a, b) => a.minutes - b.minutes);

    for (let i = 0; i < prayerTimes.length; i++) {
      if (currentTime < prayerTimes[i].minutes) {
        return i === 0
          ? prayerTimes[prayerTimes.length - 1] // last prayer yesterday
          : prayerTimes[i - 1]; // the one before the upcoming
      }
    }

    return prayerTimes[prayerTimes.length - 1]; // last prayer of the day
  }, [prayerData]);

  const getNextPrayer = useCallback(() => {
    if (!prayerData) return null;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayerTimes = Object.entries(prayerData.timings)
      .filter(([key]) =>
        ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].includes(key)
      )
      .map(([name, time]) => {
        const [hours, minutes] = time.split(":").map(Number);
        return { name, time, minutes: hours * 60 + minutes };
      })
      .sort((a, b) => a.minutes - b.minutes);

    for (const prayer of prayerTimes) {
      if (currentTime < prayer.minutes) {
        return prayer;
      }
    }

    // If all prayers have passed, next prayer is Fajr tomorrow
    return { ...prayerTimes[0], isTomorrow: true };
  }, [prayerData]);

  const formatTime = useCallback((time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }, []);

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  return {
    prayerData,
    loading,
    error,
    refreshing,
    onRefresh,
    getCurrentPrayer,
    getNextPrayer,
    formatTime,
    retry: fetchPrayerTimes,
  };
};
