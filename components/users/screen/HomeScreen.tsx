import MosqueIcon from "@/components/icons/MosqueIcon";
import PrayerTimeIcon from "@/components/icons/PrayerTime";
import QiblaIcon from "@/components/icons/QiblaIcon";
import ShimmerSkeleton from "@/components/ShimmerSkeleton";
import {
  getLocationFromStorage,
  saveLocationToStorage,
} from "@/hooks/localstorage";
import { getAllMasjids } from "@/services/getMasjids";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Bell,
  CalendarClock,
  ChevronRight,
  Clock,
  Compass,
  HandCoins,
  Heart,
  MapPin,
  Music,
  Star,
  UserCog,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type LocInfo = {
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
};

type PrayerTime = {
  name: string;
  time: string;
  emoji: string;
  minutes: number;
};

type PrayerTimings = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

// ============================================================================
// CONSTANTS
// ============================================================================

const { width } = Dimensions.get("window");

const QUICK_ACTIONS = [
  {
    id: 1,
    icon: <HandCoins size={28} color="#D4AF37" />,
    title: "Donation",
    route: "/user/donation",
    bgColor: "rgba(212, 175, 55, 0.1)",
  },
  {
    id: 2,
    icon: <Music size={24} color="#059669" />,
    title: "Azan",
    route: "/user/azan",
    bgColor: "rgba(5, 150, 105, 0.1)",
  },
  {
    id: 3,
    icon: <MosqueIcon size={24} color="#7C3AED" />,
    title: "Masjids",
    route: "/masjid",
    bgColor: "rgba(124, 58, 237, 0.1)",
  },
  {
    id: 4,
    icon: <CalendarClock size={24} color="#DC2626" />,
    title: "Events",
    route: "/events",
    bgColor: "rgba(220, 38, 38, 0.1)",
  },
  {
    id: 5,
    icon: <PrayerTimeIcon size={24} color="#2563EB" />,
    title: "Prayer Time",
    route: "/prayertime",
    bgColor: "rgba(37, 99, 235, 0.1)",
  },
  {
    id: 6,
    icon: <UserCog size={24} color="#7C2D12" />,
    title: "Profile",
    route: "/user/profile",
    bgColor: "rgba(124, 45, 18, 0.1)",
  },
  {
    id: 7,
    icon: <QiblaIcon size={24} color="#059669" />,
    title: "Qibla",
    route: "/user/qibla",
    bgColor: "rgba(5, 150, 105, 0.1)",
  },
  {
    id: 8,
    icon: <Compass size={24} color="#7C3AED" />,
    title: "More",
    route: "/",
    bgColor: "rgba(124, 58, 237, 0.1)",
  },
] as const;

const MASJID_DATA = [
  {
    id: 1,
    name: "Al-Noor Central Masjid",
    location: "Victoria Island, Lagos",
    distance: "0.8 km",
    congregation: "500+",
    nextPrayer: "Maghrib",
    nextPrayerTime: "6:45 PM",
    image: require("@/assets/images/masjid1.jpg"),
    isOpen: true,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Masjid Al-Furqan",
    location: "Ikeja, Lagos",
    distance: "2.1 km",
    congregation: "300+",
    nextPrayer: "Maghrib",
    nextPrayerTime: "6:45 PM",
    image: require("@/assets/images/tryit.jpg"),
    isOpen: true,
    rating: 4.5,
  },
  {
    id: 3,
    name: "Lagos Central Mosque",
    location: "Lagos Island",
    distance: "3.5 km",
    congregation: "1000+",
    nextPrayer: "Maghrib",
    nextPrayerTime: "6:45 PM",
    image: require("@/assets/images/tryit2.jpg"),
    isOpen: true,
    rating: 4.9,
  },
] as const;

const RECENT_ACTIVITIES = [
  {
    id: 1,
    title: "Prayer time reminder set",
    description: "Fajr prayer at 5:30 AM",
    time: "2 hours ago",
    icon: <Bell size={16} color="#10b981" />,
    type: "prayer",
  },
  {
    id: 2,
    title: "Donated to Al-Noor Masjid",
    description: "$25.00 contribution",
    time: "1 day ago",
    icon: <Heart size={16} color="#ef4444" />,
    type: "donation",
  },
  {
    id: 3,
    title: "Joined Friday Prayer",
    description: "Central Masjid Lagos",
    time: "3 days ago",
    icon: <MosqueIcon size={16} color="#7c3aed" />,
    type: "prayer",
  },
] as const;

const PRAYER_CONFIG = [
  { name: "Fajr", emoji: "🌥️" },
  { name: "Dhuhr", emoji: "☀️" },
  { name: "Asr", emoji: "🌤️" },
  { name: "Maghrib", emoji: "🌅" },
  { name: "Isha", emoji: "🌙" },
] as const;

const MINUTES_PER_DAY = 24 * 60;
const UPDATE_INTERVAL_MS = 60000; // 1 minute

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatDate = (date: Date): string => {
  const day = date.toLocaleDateString("en-US", { day: "numeric" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const timeToMinutes = (timeString: string): number => {
  // Remove any extra content after the time (like " (WITA)")
  const cleanTime = timeString.split(" ")[0];
  const [hours, minutes] = cleanTime.split(":").map(Number);
  return hours * 60 + minutes;
};

const calculatePrayerTimes = (timings: PrayerTimings): PrayerTime[] => {
  return PRAYER_CONFIG.map((prayer) => ({
    name: prayer.name,
    time: timings[prayer.name as keyof PrayerTimings],
    emoji: prayer.emoji,
    minutes: timeToMinutes(timings[prayer.name as keyof PrayerTimings]),
  }));
};

const findCurrentAndNextPrayer = (
  prayerTimes: PrayerTime[],
  currentMinutes: number
) => {
  // Log for debugging
  // console.log("Current time in minutes:", currentMinutes);
  // console.log(
  //   "Current time:",
  //   Math.floor(currentMinutes / 60) + ":" + (currentMinutes % 60)
  // );
  // console.log(
  //   "Prayer times:",
  //   prayerTimes.map((p) => `${p.name}: ${p.time} (${p.minutes} mins)`)
  // );

  let currentIndex = prayerTimes.length - 1; // Default to Isha
  let nextIndex = 0; // Default to Fajr

  for (let i = 0; i < prayerTimes.length; i++) {
    if (currentMinutes < prayerTimes[i].minutes) {
      nextIndex = i;
      currentIndex = i > 0 ? i - 1 : prayerTimes.length - 1;
      break;
    }
  }

  const current = prayerTimes[currentIndex];
  const next = prayerTimes[nextIndex];

  // Calculate time to next prayer
  let minutesToNext = next.minutes - currentMinutes;
  if (minutesToNext <= 0) {
    minutesToNext += MINUTES_PER_DAY;
  }

  const hours = Math.floor(minutesToNext / 60);
  const minutes = minutesToNext % 60;

  const result = {
    current: `${current.emoji} ${current.name}`,
    next: `${next.emoji} ${next.name}`,
    timeToNext: `${hours}h ${minutes}m`,
  };

  // console.log("Prayer status:", result);

  return result;
};

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

const useLocationInfo = () => {
  const [info, setInfo] = useState<LocInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Check for saved location first
        const saved = await getLocationFromStorage();
        if (saved) {
          setInfo(saved);
          setLoading(false);
        }

        // Request location permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLoading(false);
          return;
        }

        // Get current position
        const position = await Location.getCurrentPositionAsync();
        const { latitude, longitude } = position.coords;

        // Reverse geocode
        const geocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (geocode.length > 0) {
          const addr = geocode[0];
          const city = addr.city ?? addr.subregion ?? addr.region;
          const country = addr.country ?? "Unknown";

          if (city && country) {
            await saveLocationToStorage(city, country);
            setInfo({ city, country, latitude, longitude });
          }
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return { info, loading };
};

const usePrayerTimes = (location: LocInfo | null) => {
  const [prayerTimings, setPrayerTimings] = useState<PrayerTimings | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!location?.city || !location?.country) return;

    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${location.city}&country=${location.country}&method=2`
        );
        const data = await response.json();

        setPrayerTimings(data.data.timings);
      } catch (error) {
        console.error("Error fetching prayer times:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [location?.city, location?.country]);

  return { prayerTimings, loading };
};

const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const updateTime = () => setCurrentTime(formatTime(new Date()));
    const interval = setInterval(updateTime, UPDATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return currentTime;
};

const usePrayerStatus = (prayerTimings: PrayerTimings | null) => {
  const [prayerStatus, setPrayerStatus] = useState({
    current: "🌙 Isha",
    next: "🌥️ Fajr",
    timeToNext: "0h 0m",
  });

  useEffect(() => {
    if (!prayerTimings) return;

    const updatePrayerStatus = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const prayerTimes = calculatePrayerTimes(prayerTimings);
      const status = findCurrentAndNextPrayer(prayerTimes, currentMinutes);
      setPrayerStatus(status);
    };

    updatePrayerStatus();
    const interval = setInterval(updatePrayerStatus, UPDATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [prayerTimings]);

  return prayerStatus;
};

const useMasjids = () => {
  const [masjids, setMasjids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMasjids = async () => {
      try {
        const result = await getAllMasjids();
        if (result.success) {
          setMasjids(result.data);
        } else {
        }
      } catch (error) {
        console.error("Error fetching masjids:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMasjids();
  }, []);

  return { masjids, loading };
};

// ============================================================================
// COMPONENTS
// ============================================================================

const QuickAction = ({ item }: { item: (typeof QUICK_ACTIONS)[number] }) => {
  const router = useRouter();

  const handlePress = useCallback(() => {
    router.push(item.route);
  }, [item.route, router]);

  return (
    <TouchableOpacity style={styles.quickAction} onPress={handlePress}>
      <View style={[styles.quickActionIcon, { backgroundColor: item.bgColor }]}>
        {item.icon}
      </View>
      <Text style={styles.quickActionText}>{item.title}</Text>
    </TouchableOpacity>
  );
};

const PrayerTimeCard = ({
  loading,
  currentPrayer,
  nextPrayer,
  timeToNext,
  currentTime,
}: {
  loading: boolean;
  currentPrayer: string;
  nextPrayer: string;
  timeToNext: string;
  currentTime: string;
}) => {
  if (loading) {
    return (
      <View style={styles.prayerTimeCard}>
        <ShimmerSkeleton
          height={40}
          variant="rect"
          style={{ marginBottom: 12 }}
        />
        <ShimmerSkeleton height={20} width="80%" variant="text" />
        <ShimmerSkeleton
          height={16}
          width="60%"
          variant="text"
          style={{ marginTop: 8 }}
        />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#059669", "#10b981", "#34d399"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.prayerTimeCard}
    >
      <View style={styles.prayerHeader}>
        <View>
          <Text style={styles.currentPrayerLabel}>Current Prayer</Text>
          <Text style={styles.currentPrayerText}>{currentPrayer}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Clock size={20} color="#F5F5DC" />
          <Text style={styles.currentTimeText}>{currentTime}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.prayerFooter}>
        <View>
          <Text style={styles.nextPrayerLabel}>Next Prayer</Text>
          <Text style={styles.nextPrayerText}>{nextPrayer}</Text>
        </View>
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownLabel}>in</Text>
          <Text style={styles.countdownText}>{timeToNext}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const MasjidCard = ({ item }: { item: (typeof MASJID_DATA)[number] }) => (
  <TouchableOpacity style={styles.masjidCard}>
    <ImageBackground
      source={item.image}
      style={styles.masjidImage}
      imageStyle={styles.masjidImageStyle}
    >
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.masjidGradient}
      >
        <View style={styles.masjidHeader}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: item.isOpen ? "#10b981" : "#ef4444" },
            ]}
          >
            <Text style={styles.statusText}>
              {item.isOpen ? "Open" : "Closed"}
            </Text>
          </View>
          <View style={styles.ratingBadge}>
            <Star size={12} color="#FBBF24" fill="#FBBF24" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>

        <View style={styles.masjidInfo}>
          <Text style={styles.masjidName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.locationRow}>
            <MapPin size={12} color="#F5F5DC" />
            <Text style={styles.masjidLocation} numberOfLines={1}>
              {item.location}
            </Text>
          </View>

          <View style={styles.masjidFooter}>
            <View style={styles.masjidDetails}>
              <Text style={styles.congregationText}>{item.congregation}</Text>
              <Text style={styles.distanceText}>{item.distance}</Text>
            </View>
            <View style={styles.nextPrayerBadge}>
              <Text style={styles.nextPrayerLabels}>
                Next: {item.nextPrayerTime}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  </TouchableOpacity>
);

const ActivityItem = ({
  item,
}: {
  item: (typeof RECENT_ACTIVITIES)[number];
}) => (
  <View style={styles.activityItem}>
    <View style={styles.activityIcon}>{item.icon}</View>
    <View style={styles.activityContent}>
      <Text style={styles.activityTitle}>{item.title}</Text>
      <Text style={styles.activityDescription}>{item.description}</Text>
    </View>
    <Text style={styles.activityTime}>{item.time}</Text>
  </View>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function HomeScreen() {
  const router = useRouter();
  // const ref = useRef<ICarouselInstance>(null);
  // const progress = useSharedValue<number>(0);

  // Custom hooks
  const { info, loading: locationLoading } = useLocationInfo();
  const { prayerTimings, loading: prayerLoading } = usePrayerTimes(info);
  const prayerStatus = usePrayerStatus(prayerTimings);
  const currentTime = useCurrentTime();
  const { masjids, loading: masjidsLoading } = useMasjids();

  // Memoized values
  const formattedDate = useMemo(() => formatDate(new Date()), []);
  const isLoading = locationLoading || prayerLoading;

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>As-salamu alaykum</Text>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
          <View style={styles.locationContainer}>
            <MapPin size={18} color="#059669" />
            {info?.city && info?.country ? (
              <View>
                <Text style={styles.locationText}>{info.city}</Text>
                <Text style={styles.locationText}>{info.country}</Text>
              </View>
            ) : (
              <Text>Loading...</Text>
            )}
          </View>
        </View>

        {/* Prayer Time Card */}
        <PrayerTimeCard
          loading={isLoading}
          currentPrayer={prayerStatus.current}
          nextPrayer={prayerStatus.next}
          timeToNext={prayerStatus.timeToNext}
          currentTime={currentTime}
        />

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            {QUICK_ACTIONS.map((item) => (
              <QuickAction key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* Nearby Masjids */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Masjids</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => router.push("/masjid")}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color="#059669" />
            </TouchableOpacity>
          </View>

          <Carousel
            width={width - 32}
            height={180}
            data={[...masjids]}
            loop
            autoPlay={true}
            autoPlayInterval={4000}
            mode="parallax"
            style={styles.carousel}
            renderItem={({ item }) => <MasjidCard item={item} />}
          />
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
          </View>

          <View style={styles.activitiesList}>
            {RECENT_ACTIVITIES.map((activity) => (
              <ActivityItem key={activity.id} item={activity} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// STYLES
// ============================================================================

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
    marginBottom: 16,
  },
  greeting: {
    color: "#0D1B2A",
    fontSize: 20,
    fontFamily: "CrimsonText_700Bold",
    marginBottom: 2,
  },
  dateText: {
    color: "#64748b",
    fontSize: 14,
    fontFamily: "CrimsonText_600SemiBold",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationText: {
    color: "#059669",
    fontSize: 13,
    fontFamily: "CrimsonText_600SemiBold",
    marginLeft: 5,
  },
  prayerTimeCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#04302123",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  prayerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  currentPrayerLabel: {
    color: "rgba(245, 245, 220, 0.8)",
    fontSize: 14,
    fontFamily: "CrimsonText_600SemiBold",
    marginBottom: 4,
  },
  currentPrayerText: {
    color: "#F5F5DC",
    fontSize: 24,
    fontFamily: "CrimsonText_700Bold",
  },
  timeContainer: {
    alignItems: "center",
  },
  currentTimeText: {
    color: "#F5F5DC",
    fontSize: 16,
    fontFamily: "CrimsonText_600SemiBold",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginVertical: 12,
  },
  prayerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nextPrayerLabel: {
    color: "rgba(245, 245, 220, 0.8)",
    fontSize: 14,
    fontFamily: "CrimsonText_600SemiBold",
    marginBottom: 4,
  },
  nextPrayerText: {
    color: "#F5F5DC",
    fontSize: 20,
    fontFamily: "CrimsonText_700Bold",
  },
  countdownContainer: {
    alignItems: "flex-end",
  },
  countdownLabel: {
    color: "rgba(245, 245, 220, 0.8)",
    fontSize: 12,
    fontFamily: "CrimsonText_400Regular",
    marginBottom: 4,
  },
  countdownText: {
    color: "#F5F5DC",
    fontSize: 18,
    fontFamily: "CrimsonText_700Bold",
  },
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  sectionTitle: {
    color: "#0D1B2A",
    fontSize: 20,
    fontFamily: "CrimsonText_700Bold",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    color: "#059669",
    fontSize: 14,
    fontFamily: "CrimsonText_600SemiBold",
    marginRight: 4,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickAction: {
    width: "23%",
    alignItems: "center",
    marginBottom: 16,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionText: {
    color: "#0D1B2A",
    fontSize: 12,
    fontFamily: "CrimsonText_600SemiBold",
    textAlign: "center",
  },
  carousel: {
    marginTop: 8,
  },
  masjidCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    marginHorizontal: 4,
  },
  masjidImage: {
    height: 180,
    justifyContent: "space-between",
  },
  masjidImageStyle: {
    borderRadius: 16,
  },
  masjidGradient: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
  },
  masjidHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "CrimsonText_600SemiBold",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "CrimsonText_600SemiBold",
    marginLeft: 4,
  },
  masjidInfo: {
    marginTop: "auto",
  },
  masjidName: {
    color: "#F5F5DC",
    fontSize: 18,
    fontFamily: "CrimsonText_700Bold",
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  masjidLocation: {
    color: "#F5F5DC",
    fontSize: 14,
    fontFamily: "CrimsonText_400Regular",
    marginLeft: 6,
    flex: 1,
  },
  masjidFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  masjidDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  congregationText: {
    color: "#F5F5DC",
    fontSize: 12,
    fontFamily: "CrimsonText_400Regular",
    marginRight: 12,
  },
  distanceText: {
    color: "#10b981",
    fontSize: 12,
    fontFamily: "CrimsonText_600SemiBold",
  },
  nextPrayerBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  nextPrayerLabels: {
    color: "#F5F5DC",
    fontSize: 12,
    fontFamily: "CrimsonText_600SemiBold",
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
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    color: "#0D1B2A",
    fontSize: 14,
    fontFamily: "CrimsonText_600SemiBold",
    marginBottom: 2,
  },
  activityDescription: {
    color: "#64748b",
    fontSize: 12,
    fontFamily: "CrimsonText_400Regular",
  },
  activityTime: {
    color: "#94a3b8",
    fontSize: 12,
    fontFamily: "CrimsonText_600SemiBold",
  },
});
