import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
export type PrayerProgress = Record<PrayerName, boolean>;

const EMPTY_PROGRESS: PrayerProgress = {
  Fajr: false,
  Dhuhr: false,
  Asr: false,
  Maghrib: false,
  Isha: false,
};

const storageKeyForDate = (dateKey: string) => `prayerProgress:${dateKey}`;

export function usePrayerProgress(dateKey: string) {
  const [progress, setProgress] = useState<PrayerProgress>(EMPTY_PROGRESS);
  const [loading, setLoading] = useState<boolean>(true);

  // Load progress for the given date
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const key = storageKeyForDate(dateKey);
        const json = await AsyncStorage.getItem(key);
        if (!isMounted) return;
        if (json) {
          const parsed = JSON.parse(json) as Partial<PrayerProgress>;
          setProgress({ ...EMPTY_PROGRESS, ...parsed });
        } else {
          setProgress(EMPTY_PROGRESS);
        }
      } catch (e) {
        // Fallback to empty progress on error
        setProgress(EMPTY_PROGRESS);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [dateKey]);

  const persist = useCallback(async (next: PrayerProgress) => {
    try {
      const key = storageKeyForDate(dateKey);
      await AsyncStorage.setItem(key, JSON.stringify(next));
    } catch {}
  }, [dateKey]);

  const setPrayer = useCallback((name: PrayerName, value: boolean) => {
    setProgress((prev) => {
      const next = { ...prev, [name]: value } as PrayerProgress;
      // Fire and forget
      persist(next);
      return next;
    });
  }, [persist]);

  const togglePrayer = useCallback((name: PrayerName) => {
    setProgress((prev) => {
      const next = { ...prev, [name]: !prev[name] } as PrayerProgress;
      persist(next);
      return next;
    });
  }, [persist]);

  const completedCount = useMemo(() => {
    return Object.values(progress).filter(Boolean).length;
  }, [progress]);

  const reset = useCallback(async () => {
    setProgress(EMPTY_PROGRESS);
    try {
      const key = storageKeyForDate(dateKey);
      await AsyncStorage.removeItem(key);
    } catch {}
  }, [dateKey]);

  return {
    progress,
    setPrayer,
    togglePrayer,
    completedCount,
    loading,
    reset,
  } as const;
}
