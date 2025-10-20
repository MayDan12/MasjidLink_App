import ShimmerSkeleton from "@/components/ShimmerSkeleton";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { MapPin } from "lucide-react-native";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Constants
const { width } = Dimensions.get("window");

export default function HomeScreenLoader() {
  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Loader */}
        <View style={styles.header}>
          <View>
            <ShimmerSkeleton
              height={24}
              width={180}
              variant="text"
              style={{ marginBottom: 4 }}
            />
            <ShimmerSkeleton height={16} width={120} variant="text" />
          </View>
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#059669" />
            <ShimmerSkeleton
              height={14}
              width={80}
              variant="text"
              style={{ marginLeft: 6 }}
            />
          </View>
        </View>

        {/* Prayer Time Card Loader */}
        <View style={styles.prayerTimeCard}>
          <LinearGradient
            colors={["#059669", "#10b981", "#34d399"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.prayerTimeCardInner}
          >
            <View style={styles.prayerHeader}>
              <View>
                <ShimmerSkeleton height={14} width={100} variant="text" />
                <ShimmerSkeleton height={14} width={120} variant="text" />
              </View>
              <View style={styles.timeContainer}>
                <ShimmerSkeleton height={16} width={20} variant="rect" />
                <ShimmerSkeleton
                  height={12}
                  width={60}
                  variant="text"
                  style={{ marginTop: 4 }}
                />
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.prayerFooter}>
              <View>
                <ShimmerSkeleton
                  height={12}
                  width={100}
                  variant="text"
                  style={{ marginBottom: 4 }}
                />
                <ShimmerSkeleton height={16} width={100} variant="text" />
              </View>
              <View style={styles.countdownContainer}>
                <ShimmerSkeleton
                  height={10}
                  width={20}
                  variant="text"
                  style={{ marginBottom: 4 }}
                />
                <ShimmerSkeleton height={14} width={60} variant="text" />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions Loader */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ShimmerSkeleton height={20} width={150} variant="text" />
          </View>
          <View style={styles.quickActionsGrid}>
            {[...Array(8)].map((_, index) => (
              <View key={index} style={styles.quickAction}>
                <ShimmerSkeleton
                  height={56}
                  width={56}
                  variant="rect"
                  style={styles.quickActionIcon}
                />
                <ShimmerSkeleton
                  height={12}
                  width={60}
                  variant="text"
                  style={{ marginTop: 8 }}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Upcoming Events Loader */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ShimmerSkeleton height={20} width={150} variant="text" />
            <View style={styles.viewAllButton}>
              <ShimmerSkeleton
                height={14}
                width={60}
                variant="text"
                style={{ marginRight: 4 }}
              />
              <ShimmerSkeleton height={16} width={16} variant="rect" />
            </View>
          </View>

          <View style={styles.carousel}>
            <ShimmerSkeleton height={180} width={width - 32} variant="rect" />
          </View>
        </View>

        {/* Recent Activities Loader */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ShimmerSkeleton height={20} width={150} variant="text" />
          </View>
          <View style={styles.activitiesList}>
            {[...Array(3)].map((_, index) => (
              <View key={index} style={styles.activityItem}>
                <ShimmerSkeleton
                  height={36}
                  width={36}
                  variant="rect"
                  style={styles.activityIcon}
                />
                <View style={styles.activityContent}>
                  <ShimmerSkeleton
                    height={14}
                    width={150}
                    variant="text"
                    style={{ marginBottom: 2 }}
                  />
                  <ShimmerSkeleton height={12} width={120} variant="text" />
                </View>
                <ShimmerSkeleton height={12} width={60} variant="text" />
              </View>
            ))}
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  prayerTimeCard: {
    borderRadius: 20,
    shadowColor: "#04302123",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  prayerTimeCardInner: {
    borderRadius: 20,
    padding: 8,
  },
  prayerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeContainer: {
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginVertical: 5,
  },
  prayerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  countdownContainer: {
    alignItems: "flex-end",
  },
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickAction: {
    width: "23%",
    alignItems: "center",
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
  },
  carousel: {
    marginTop: 8,
  },
  activitiesList: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
});
