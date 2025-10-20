import { StatusBar } from "expo-status-bar";
import { JSX } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DateHeader } from "@/components/users/prayer/DateHeader";
import { NextPrayerCard } from "@/components/users/prayer/NextPrayerCard";
import { PrayerErrorState } from "@/components/users/prayer/PrayerErrorState";
import PrayerLoader from "@/components/users/prayer/PrayerLoadingState";
import { PrayerTimeCard } from "@/components/users/prayer/PrayerTimeCard";
import { usePrayerProgress } from "@/hooks/usePrayerProgress";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChevronLeft,
  ChevronRight,
  Cloud,
  MapPin,
  Moon,
  Sun,
  Sunset,
} from "lucide-react-native";

const prayerNames: Record<string, string> = {
  Fajr: "Fajr",
  Sunrise: "Sunrise",
  Dhuhr: "Dhuhr",
  Asr: "Asr",
  Sunset: "Sunset",
  Maghrib: "Maghrib",
  Isha: "Isha",
};

const prayerIcons: Record<string, JSX.Element> = {
  Fajr: <Sun size={20} color="#f59e0b" />, // sunrise color
  Dhuhr: <Sun size={20} color="#eab308" />, // midday yellow
  Asr: <Cloud size={20} color="#f97316" />, // orange sky
  Maghrib: <Sunset size={20} color="#ef4444" />, // sunset red
  Isha: <Moon size={20} color="#8b5cf6" />, // night purple
};

export default function PrayerTimesScreen() {
  const today = new Date().toISOString().split("T")[0]; // "2024-01-15"
  const todays = new Date();
  const day = todays.toLocaleDateString("en-US", { day: "numeric" });
  const month = todays.toLocaleDateString("en-US", { month: "long" });
  const year = todays.getFullYear();
  const formattedDate = `${day} ${month}, ${year}`;
  const { progress, togglePrayer, completedCount } = usePrayerProgress(today);
  const {
    prayerData,
    loading,
    error,
    refreshing,
    onRefresh,
    getCurrentPrayer,
    getNextPrayer,
    formatTime,
    retry,
  } = usePrayerTimes();

  if (loading) {
    return <PrayerLoader loading={loading} />;
  }

  if (error) {
    return <PrayerErrorState error={error} onRetry={retry} />;
  }

  if (!prayerData) {
    return null;
  }

  const currentPrayer = getCurrentPrayer();
  const nextPrayer = getNextPrayer();

  const orderedPrayers = [
    "Fajr",
    "Sunrise",
    "Dhuhr",
    "Asr",
    "Sunset",
    "Maghrib",
    "Isha",
  ];

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <StatusBar style="auto" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
            colors={["#3b82f6"]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity>
              <ChevronLeft size={24} color="#10b981" />
            </TouchableOpacity>

            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{formattedDate}</Text>
              <Text style={styles.hijriDate}>26 Safar 1447</Text>
            </View>

            <TouchableOpacity>
              <ChevronRight size={24} color="#10b981" />
            </TouchableOpacity>
          </View>

          <View style={styles.locationRow}>
            <View style={styles.locationContainer}>
              <MapPin size={16} color="#10b981" />
              <Text style={styles.locationText}>Lagos</Text>
            </View>
            <Text style={styles.organizationText}>
              Muslim World League (MWL)
            </Text>
          </View>
        </View>
        <View style={styles.cardContainer}>
          <NextPrayerCard
            CurrentPrayer={currentPrayer}
            // isCurrent={currentPrayer === nextPrayer.name}
            nextPrayer={nextPrayer}
            formatTime={formatTime}
          />
          <DateHeader
            prayerData={prayerData}
            completedCount={completedCount}
            loading={loading}
          />
        </View>

        <View style={styles.prayerTimesContainer}>
          <Text style={styles.sectionTitle}>Prayer Times</Text>

          <View style={styles.prayersList}>
            {orderedPrayers.map((prayerKey) => {
              const time =
                prayerData.timings[
                  prayerKey as keyof typeof prayerData.timings
                ];
              const isPrayer = [
                "Fajr",
                "Dhuhr",
                "Asr",
                "Maghrib",
                "Isha",
              ].includes(prayerKey);

              return (
                <PrayerTimeCard
                  key={prayerKey}
                  name={prayerNames[prayerKey]}
                  time={time}
                  icon={prayerIcons[prayerKey]}
                  isCurrent={prayerKey === currentPrayer?.name}
                  isPrayer={isPrayer}
                  formatTime={formatTime}
                  progress={progress} // Pass down the state
                  togglePrayer={togglePrayer} // Pass down the function
                />
              );
            })}
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Your Progress</Text>

          <LinearGradient
            colors={["#7c3aed", "#10b981"]}
            style={styles.adBanner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.adContent}>
              <View style={styles.adLeft}>
                <Text style={styles.adTitle}>DON&apos;T LIKE ADS?</Text>
                <Text style={styles.adSubtitle}>
                  Try Premium and you&apos;ll never go back
                </Text>
              </View>
              <TouchableOpacity style={styles.premiumButton}>
                <Text style={styles.premiumButtonText}>GET PREMIUM</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Pull down to refresh • Times calculated using ISNA method
          </Text>
          <Text style={styles.footerSubtext}>
            Timezone: {prayerData.meta.timezone}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },
  header: {
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateContainer: {
    alignItems: "center",
  },
  dateText: {
    color: "#0D1B2A",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  hijriDate: {
    color: "#64748b",
    fontSize: 14,
    marginTop: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  locationText: {
    color: "#10b981",
    fontSize: 14,
    marginLeft: 6,
    fontWeight: "500",
  },
  organizationText: {
    color: "#64748b",
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  prayerTimesContainer: {
    marginBottom: 24,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#0D1B2A",
    marginBottom: 5,
    textAlign: "center",
  },
  prayersList: {
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  footerText: {
    color: "#64748b",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 4,
  },
  footerSubtext: {
    color: "#475569",
    fontSize: 11,
    textAlign: "center",
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  progressTitle: {
    color: "#0D1B2A",
    fontSize: 18,

    marginBottom: 20,
    fontFamily: "Inter_600SemiBold",
  },
  adBanner: {
    borderRadius: 16,
    padding: 20,
  },
  adContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  adLeft: {
    flex: 1,
  },
  adTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  adSubtitle: {
    color: "#ffffff",
    fontSize: 12,
    opacity: 0.9,
  },
  premiumButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  premiumButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
});
