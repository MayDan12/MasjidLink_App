import { PrayerName } from "@/hooks/usePrayerProgress";
import { BellIcon } from "lucide-react-native";
import React, { JSX } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

const COLORS = {
  emerald: "#2E7D32",
  sand: "#F5F5DC",
  midnight: "#0D1B2A",
  gold: "#D4AF37",
};

interface PrayerTimeCardProps {
  name: string;
  time: string;
  icon: JSX.Element;
  isCurrent: boolean;
  isPrayer: boolean;
  formatTime: (time: string) => string;

  progress: any; // Add this
  togglePrayer: (name: PrayerName) => void; // Add this
}

export const PrayerTimeCard: React.FC<PrayerTimeCardProps> = ({
  name,
  time,
  icon,
  isCurrent,
  isPrayer,
  formatTime,

  progress,
  togglePrayer,
}) => {
  return (
    <View style={[styles.card, isCurrent && styles.currentCard]}>
      <View style={styles.content}>
        <View className="mr-3">
          {isPrayer && (
            <Switch
              value={progress[name as keyof typeof progress]}
              onValueChange={() => togglePrayer(name as any)}
              thumbColor={
                progress[name as keyof typeof progress] ? "#10b981" : "#f4f3f4"
              }
              trackColor={{ false: "#767577", true: "#34d399" }}
            />
          )}
        </View>
        <View style={styles.leftSection}>
          <Text style={styles.icon}>{icon}</Text>
          <View style={styles.prayerInfo}>
            <Text
              style={[
                styles.prayerName,
                isCurrent && styles.currentPrayerName,
                !isPrayer && styles.nonPrayerName,
              ]}
            >
              {name}
            </Text>
            {!isPrayer && (
              <Text style={styles.subtitle}>Not a prayer time</Text>
            )}
          </View>
        </View>
        <View style={styles.timeContainer}>
          {isCurrent && (
            <View style={styles.nowBadge}>
              <Text style={styles.nowBadgeText}>Now</Text>
            </View>
          )}
          <Text style={[styles.time, isCurrent && styles.currentTime]}>
            {formatTime(time)}
          </Text>
          <TouchableOpacity
            style={styles.rightSection}
            onPress={() => {
              const [hours, minutes] = time.split(":").map(Number);
              let notificationTime = new Date();
              notificationTime.setHours(hours);
              notificationTime.setMinutes(minutes);
              notificationTime.setSeconds(0);
              // schedulePrayerNotification(name, notificationTime);
              console.log(name, notificationTime);
            }}
          >
            <BellIcon size={18} color={COLORS.gold} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Styles remain the same...
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 5,
    backgroundColor: "rgba(13, 27, 42, 0.85)",
  },
  currentCard: {
    borderColor: COLORS.emerald,
    backgroundColor: "rgba(46, 125, 50, 0.15)",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
    color: COLORS.gold,
  },
  prayerInfo: {
    flex: 1,
  },
  prayerName: {
    fontSize: 15,
    color: COLORS.sand,
    fontFamily: "Inter_600SemiBold",
  },
  currentPrayerName: {
    fontFamily: "Inter_700Bold",
    color: COLORS.emerald,
  },
  nonPrayerName: {
    color: "#9E9E9E",
    fontFamily: "Inter_500Medium",
  },
  subtitle: {
    fontSize: 12,
    color: "#B0B0B0",
    marginTop: 2,
    fontFamily: "Inter_400Regular",
  },
  time: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.sand,
  },
  currentTime: {
    color: COLORS.emerald,
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  rightSection: {
    marginLeft: 12,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nowBadge: {
    backgroundColor: COLORS.emerald,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  nowBadgeText: {
    color: COLORS.sand,
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
});

// Request notification permissions
// const requestNotificationPermissions = async () => {
//   const { status } = await Notifications.getPermissionsAsync();
//   if (status !== "granted") {
//     const { status: newStatus } = await Notifications.requestPermissionsAsync();
//     if (newStatus !== "granted") {
//       Alert.alert(
//         "Permission Denied",
//         "Please enable notifications in your device settings to receive prayer time alerts."
//       );
//       return false;
//     }
//   }
//   return true;
// };

// Configure Android notification channel
// const configureNotificationChannel = async () => {
//   if (Platform.OS === "android") {
//     await Notifications.setNotificationChannelAsync("prayer-reminders", {
//       name: "Prayer Reminders",
//       importance: Notifications.AndroidImportance.MAX,
//       sound: "adhan.wav", // Ensure adhan.wav is in your assets folder
//       vibrationPattern: [0, 250, 250, 250],
//     });
//   }
// };

// const schedulePrayerNotification = async (prayerName: string, time: Date) => {
//   // Check permissions
//   const hasPermission = await requestNotificationPermissions();
//   if (!hasPermission) return;

//   // Configure Android channel
//   await configureNotificationChannel();

//   // Handle past dates
//   const now = new Date();
//   if (time < now) {
//     time.setDate(time.getDate() + 1); // Schedule for next day
//   }

//   try {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "Prayer Reminder 🕌",
//         body: `It's time for ${prayerName} prayer.`,
//         sound: "adhan.wav", // Ensure the path is correct
//         data: { prayer: prayerName },
//         android: {
//           channelId: "prayer-reminders",
//         },
//       },
//       trigger: {
//         date: time,
//       },
//     });
//     Alert.alert(
//       "Success",
//       `Notification scheduled for ${prayerName} at ${time.toLocaleTimeString()}`
//     );
//   } catch (error) {
//     console.error("Failed to schedule notification:", error);
//     Alert.alert("Error", "Failed to schedule notification. Please try again.");
//   }
// };
