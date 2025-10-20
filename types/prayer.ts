export interface PrayerTimings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Sunrise: string;
  Sunset: string;
}

export interface PrayerData {
  timings: PrayerTimings;
  date: {
    readable: string;
    hijri: {
      date: string;
      month: { en: string };
      year: string;
    };
  };
  meta: {
    timezone: string;
  };
}

export interface PrayerInfo {
  name: string;
  time: string;
  minutes: number;
  isPrayer: boolean;
  icon: string;
}
