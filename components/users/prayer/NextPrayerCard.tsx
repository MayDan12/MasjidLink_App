import { LinearGradient } from "expo-linear-gradient";
import { Cloud, Moon, Sun, Sunset } from "lucide-react-native";
import React, { JSX, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface CurrentPrayer {
  name: string;
  time: string;
  minutes: number;
}

interface NextPrayerCardProps {
  nextPrayer: {
    name: string;
    time: string;
    minutes: number;
    isTomorrow?: boolean;
  } | null;

  // isCurrent: boolean;
  CurrentPrayer: CurrentPrayer | null;

  formatTime: (time: string) => string;
}

export const NextPrayerCard: React.FC<NextPrayerCardProps> = ({
  // isCurrent,
  CurrentPrayer,
  nextPrayer,
  formatTime,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    if (!nextPrayer) return;

    const updateTimeRemaining = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      let targetMinutes = nextPrayer.minutes;
      if (nextPrayer.isTomorrow || targetMinutes <= currentMinutes) {
        targetMinutes += 24 * 60; // Add 24 hours for tomorrow
      }

      const diffMinutes = targetMinutes - currentMinutes;
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;

      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m`);
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [nextPrayer]);

  if (!nextPrayer) return null;

  const formatCurrentTime = (time: string | undefined) => {
    if (!time) return "";

    // Split into hours and minutes
    const [hourStr, minuteStr] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    // Decide AM/PM
    const ampm = hour >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    if (hour === 0) {
      hour = 12; // Midnight
    } else if (hour > 12) {
      hour -= 12;
    }

    return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  const prayerIcons: Record<string, JSX.Element> = {
    Fajr: <Sun size={20} color="#f59e0b" />, // sunrise color
    Dhuhr: <Sun size={20} color="#eab308" />, // midday yellow
    Asr: <Cloud size={20} color="#f97316" />, // orange sky
    Maghrib: <Sunset size={20} color="#ef4444" />, // sunset red
    Isha: <Moon size={20} color="#8b5cf6" />, // night purple
  };

  return (
    <LinearGradient
      colors={["#1e293b", "#0D1B2A", "#0f172a"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.nowText}>Now</Text>

      <View style={styles.currentPrayerRow}>
        <Text style={styles.icon}>{prayerIcons[CurrentPrayer?.name]} </Text>
        <View>
          <Text style={styles.prayerName}>{CurrentPrayer?.name}</Text>
        </View>
      </View>

      <Text style={styles.prayerTime}>
        {formatCurrentTime(CurrentPrayer?.time)}
      </Text>
      {/* <Text style={styles.prayerTime}>{formatTime(nextPrayer.time)}</Text> */}
      <Text style={styles.nextPrayerText}>
        {nextPrayer.name}
        {nextPrayer.isTomorrow && (
          <Text style={styles.tomorrowText}> (Tomorrow)</Text>
        )}{" "}
        in {formatTime(nextPrayer.time)}
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    borderRadius: 22,
    borderWidth: 0.8,
    borderColor: "rgba(30, 41, 59, 0.5)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    color: "#93c5fd",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginLeft: 6,
  },
  nextPrayerText: {
    color: "#64748b",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  nowText: {
    color: "#64748b",
    fontSize: 13,
    marginBottom: 4,
    fontFamily: "Inter_500Medium",
  },
  currentPrayerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  currentPrayerName: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  content: {
    flex: 2,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.5)",
  },
  prayerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    fontSize: 20,
    marginRight: 16,
  },
  prayerName: {
    color: "#f1f5f9",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  tomorrowText: {
    color: "#93c5fd",
    fontSize: 14,
    fontWeight: "500",
  },
  prayerTime: {
    color: "#ffffff",
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    marginBottom: 5,
  },
  countdown: {
    alignItems: "flex-end",
  },
  countdownLabel: {
    color: "#93c5fd",
    fontSize: 12,
    marginBottom: 2,
  },
  countdownTime: {
    color: "#f1f5f9",
    fontSize: 17,
    fontWeight: "700",
  },
});
