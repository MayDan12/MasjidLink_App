// import { usePrayerProgress } from "@/hooks/usePrayerProgress";
// import { PrayerData } from "@/types/prayer";
// import { LinearGradient } from "expo-linear-gradient";
// import { Check } from "lucide-react-native";
// import React from "react";
// import { StyleSheet, Text, View } from "react-native";

// interface DateHeaderProps {
//   prayerData: PrayerData;
//   dateKey: string;
// }

// export const DateHeader: React.FC<DateHeaderProps> = ({
//   prayerData,
//   dateKey,
// }) => {
//   const { progress, completedCount, loading } = usePrayerProgress(dateKey);
//   return (
//     <LinearGradient
//       colors={["#2E7D32", "#065f46"]}
//       style={styles.progressCard}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//     >
//       <View style={styles.checkContainer}>
//         <Check size={24} color="#F5F5DC" />
//       </View>
//       <Text style={styles.progressNumber}>{completedCount}/5</Text>
//       <Text style={styles.progressText}>Prayed</Text>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 24,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: "800",
//     color: "#f1f5f9",
//     marginBottom: 4,
//     textAlign: "center",
//   },
//   location: {
//     fontSize: 16,
//     color: "#64748b",
//     textAlign: "center",
//     marginBottom: 16,
//   },
//   dateContainer: {
//     backgroundColor: "#1e293b",
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: "#334155",
//   },
//   dateRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   gregorianDate: {
//     fontSize: 16,
//     color: "#f1f5f9",
//     fontWeight: "600",
//     marginLeft: 8,
//   },
//   hijriDate: {
//     fontSize: 14,
//     color: "#94a3b8",
//     textAlign: "center",
//   },
//   progressCard: {
//     flex: 1,
//     padding: 20,
//     borderRadius: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   checkContainer: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "rgba(16, 185, 129, 0.3)",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 12,
//   },
//   progressNumber: {
//     color: "#F5F5DC",
//     fontSize: 24,
//     fontWeight: "700",
//   },
//   progressText: {
//     color: "#F5F5DC",
//     fontSize: 12,
//     fontFamily: "Inter_600SemiBold",
//     opacity: 0.8,
//   },
// });
import { PrayerData } from "@/types/prayer";
import { LinearGradient } from "expo-linear-gradient";
import { Check, Clock } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface DateHeaderProps {
  prayerData: PrayerData;

  completedCount: number; // Add this
  loading: boolean; // Add this
}

export const DateHeader: React.FC<DateHeaderProps> = ({
  prayerData,
  loading,
  completedCount,
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <LinearGradient
        colors={["#2E7D32", "#065f46"]}
        style={[styles.progressCard, styles.loadingCard]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ActivityIndicator size="small" color="#F5F5DC" />
        <Text style={styles.loadingText}>Loading prayers...</Text>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress Card */}
      <LinearGradient
        colors={
          completedCount === 5 ? ["#059669", "#047857"] : ["#2E7D32", "#065f46"]
        }
        style={styles.progressCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.checkContainer}>
          {completedCount === 5 ? (
            <Check size={24} color="#F5F5DC" />
          ) : (
            <Clock size={24} color="#F5F5DC" />
          )}
        </View>
        <Text style={styles.progressNumber}>{completedCount}/5 </Text>
        <Text style={styles.progressText}>
          {completedCount === 5 ? "Prayers Completed!" : "Prayed"}
        </Text>

        {/* Progress visualization */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(completedCount / 5) * 100}%` },
            ]}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    flex: 1,
  },
  dateContainer: {
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(51, 65, 85, 0.5)",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: 4,
    textAlign: "center",
  },
  hijriDate: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    fontStyle: "italic",
  },
  progressCard: {
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  loadingCard: {
    minHeight: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#F5F5DC",
    marginTop: 12,
    fontSize: 14,
    opacity: 0.8,
  },
  checkContainer: {
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: "rgba(16, 185, 129, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  progressNumber: {
    color: "#F5F5DC",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 4,
  },
  progressText: {
    color: "#F5F5DC",
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.9,
    marginBottom: 16,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#F5F5DC",
    borderRadius: 2,
  },
});
