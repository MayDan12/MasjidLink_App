import MosqueIcon from "@/components/icons/MosqueIcon";
import PrayerTimeIcon from "@/components/icons/PrayerTime";
import QiblaIcon from "@/components/icons/QiblaIcon";
import ShimmerSkeleton from "@/components/ShimmerSkeleton";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  CalendarClock,
  ChevronRight,
  Clock,
  Compass,
  Heart,
  MapPin,
  Star,
  Stars,
  UserCog,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  type ICarouselInstance,
} from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

// Constants
const { width } = Dimensions.get("window");
const QUICK_ACTIONS = [
  {
    id: 1,
    icon: <Stars size={24} color="#D4AF37" />,
    title: "Go Premium",
    route: "/user/premium",
    bgColor: "rgba(212, 175, 55, 0.1)",
  },
  {
    id: 2,
    icon: <MosqueIcon size={24} color="#7C3AED" />,
    title: "Masjid Profile",
    route: "/masjid",
    bgColor: "rgba(124, 58, 237, 0.1)",
  },
  {
    id: 3,
    icon: <CalendarClock size={24} color="#DC2626" />,
    title: "Create Event",
    route: "/events",
    bgColor: "rgba(220, 38, 38, 0.1)",
  },
  {
    id: 4,
    icon: <UserCog size={24} color="#7C2D12" />,
    title: "My Profile",
    route: "/user/profile",

    bgColor: "rgba(124, 45, 18, 0.1)",
  },
  {
    id: 5,
    icon: <PrayerTimeIcon size={24} color="#2563EB" />,
    title: "Prayer Times",
    route: "/prayertime",
    bgColor: "rgba(37, 99, 235, 0.1)",
  },
  {
    id: 6,
    icon: <Heart size={24} color="#ef4444" />,
    title: "Donations",
    route: "/user/donation",
    bgColor: "rgba(239, 68, 68, 0.1)",
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
];

const eventData = [
  {
    id: 1,
    name: "Jumu'ah Prayer",
    masjid: "Al-Noor Central Masjid",
    date: "October 11, 2025",
    time: "1:00 PM",
    attendees: "Expected 500+",
    image: require("@/assets/images/masjid1.jpg"),
    status: "Upcoming",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Quran Study Session",
    masjid: "Masjid Al-Furqan",
    date: "October 12, 2025",
    time: "7:00 PM",
    attendees: "Expected 100+",
    image: require("@/assets/images/masjid1.jpg"),
    status: "Upcoming",
    rating: 4.7,
  },
  {
    id: 3,
    name: "Community Iftar",
    masjid: "Lagos Central Mosque",
    date: "October 15, 2025",
    time: "6:30 PM",
    attendees: "Expected 300+",
    image: require("@/assets/images/masjid1.jpg"),
    status: "Upcoming",
    rating: 4.9,
  },
];

const recentActivities = [
  {
    id: 1,
    title: "Created new event",
    description: "Jumu'ah Prayer at Al-Noor",
    time: "1 hour ago",
    icon: <CalendarClock size={16} color="#DC2626" />,
    type: "event",
  },
  {
    id: 2,
    title: "Updated masjid information",
    description: "Added new facilities to Al-Noor",
    time: "Yesterday",
    icon: <MosqueIcon size={16} color="#7c3aed" />,
    type: "masjid",
  },
  {
    id: 3,
    title: "Received donation",
    description: "$100 from community member",
    time: "2 days ago",
    icon: <Heart size={16} color="#ef4444" />,
    type: "donation",
  },
];

export default function ImamHomeScreen() {
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [prayerData, setPrayerData] = useState<any>(null);
  const [currentPrayer, setCurrentPrayer] = useState<string>("");
  const [nextPrayer, setNextPrayer] = useState<string>("");
  const [timeToNext, setTimeToNext] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>("");
  const router = useRouter();

  const today = new Date();
  const day = today.toLocaleDateString("en-US", { day: "numeric" });
  const month = today.toLocaleDateString("en-US", { month: "long" });
  const year = today.getFullYear();
  const formattedDate = `${day} ${month}, ${year}`;

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch(
          "https://api.aladhan.com/v1/timingsByCity?city=Lagos&country=Nigeria&method=2"
        );
        const data = await response.json();
        setPrayerTimes(data.data.timings);
        setPrayerData(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prayer times:", error);
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(timeString);
    };

    updateCurrentTime();
    const timeInterval = setInterval(updateCurrentTime, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    if (!prayerTimes) return;

    const updateCurrentAndNextPrayer = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const prayers = [
        { name: "Fajr", time: prayerTimes.Fajr, emoji: "🌥️" },
        { name: "Dhuhr", time: prayerTimes.Dhuhr, emoji: "☀️" },
        { name: "Asr", time: prayerTimes.Asr, emoji: "🌤️" },
        { name: "Maghrib", time: prayerTimes.Maghrib, emoji: "🌅" },
        { name: "Isha", time: prayerTimes.Isha, emoji: "🌙" },
      ];

      const prayerMinutes = prayers.map((prayer) => {
        const [hours, minutes] = prayer.time.split(":").map(Number);
        return {
          ...prayer,
          minutes: hours * 60 + minutes,
        };
      });

      let current = "Isha";
      let next = "Fajr";
      let currentEmoji = "🌙";
      let nextEmoji = "🌥️";

      for (let i = 0; i < prayerMinutes.length; i++) {
        if (currentTime < prayerMinutes[i].minutes) {
          next = prayerMinutes[i].name;
          nextEmoji = prayerMinutes[i].emoji;
          if (i > 0) {
            current = prayerMinutes[i - 1].name;
            currentEmoji = prayerMinutes[i - 1].emoji;
          } else {
            current = "Isha";
            currentEmoji = "🌙";
          }
          break;
        }
        if (i === prayerMinutes.length - 1) {
          current = prayerMinutes[i].name;
          currentEmoji = prayerMinutes[i].emoji;
          next = "Fajr";
          nextEmoji = "🌥️";
        }
      }

      setCurrentPrayer(`${currentEmoji} ${current}`);
      setNextPrayer(`${nextEmoji} ${next}`);

      const nextPrayerTime =
        prayerMinutes.find((p) => p.name === next)?.minutes ||
        prayerMinutes[0].minutes;
      let minutesToNext = nextPrayerTime - currentTime;
      if (minutesToNext <= 0) {
        minutesToNext += 24 * 60;
      }

      const hoursToNext = Math.floor(minutesToNext / 60);
      const minsToNext = minutesToNext % 60;
      setTimeToNext(`${hoursToNext}h ${minsToNext}m`);
    };

    updateCurrentAndNextPrayer();
    const interval = setInterval(updateCurrentAndNextPrayer, 60000);

    return () => clearInterval(interval);
  }, [prayerTimes]);

  const QuickAction = ({ item }: { item: (typeof QUICK_ACTIONS)[0] }) => (
    <TouchableOpacity
      style={styles.quickAction}
      onPress={() => router.push(item.route)}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: item.bgColor }]}>
        {item.icon}
      </View>
      <Text style={styles.quickActionText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const PrayerTimeCard = () => {
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

  const EventCard = ({ item }: { item: (typeof eventData)[0] }) => (
    <TouchableOpacity style={styles.eventCard}>
      <ImageBackground
        source={item.image}
        style={styles.eventImage}
        imageStyle={styles.eventImageStyle}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.eventGradient}
        >
          <View style={styles.eventHeader}>
            <View style={[styles.statusBadge, { backgroundColor: "#10b981" }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Star size={12} color="#FBBF24" fill="#FBBF24" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>

          <View style={styles.eventInfo}>
            <Text style={styles.eventName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.locationRow}>
              <MapPin size={12} color="#F5F5DC" />
              <Text style={styles.eventMasjid} numberOfLines={1}>
                {item.masjid}
              </Text>
            </View>

            <View style={styles.eventFooter}>
              <View style={styles.eventDetails}>
                <Text style={styles.eventDateText}>{item.date}</Text>
                <Text style={styles.eventTimeText}>{item.time}</Text>
              </View>
              <View style={styles.attendeesBadge}>
                <Text style={styles.attendeesText}>{item.attendees}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  const ActivityItem = ({ item }: { item: (typeof recentActivities)[0] }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>{item.icon}</View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDescription}>{item.description}</Text>
      </View>
      <Text style={styles.activityTime}>{item.time}</Text>
    </View>
  );

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
            <MapPin size={16} color="#059669" />
            <Text style={styles.locationText}>Lagos, Nigeria</Text>
          </View>
        </View>

        {/* Prayer Time Card */}
        <PrayerTimeCard />

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

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color="#059669" />
            </TouchableOpacity>
          </View>

          <Carousel
            width={width - 32}
            height={180}
            data={eventData}
            loop
            autoPlay={true}
            autoPlayInterval={4000}
            mode="parallax"
            style={styles.carousel}
            renderItem={({ item }) => <EventCard item={item} />}
          />
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
          </View>

          <View style={styles.activitiesList}>
            {recentActivities.map((activity) => (
              <ActivityItem key={activity.id} item={activity} />
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
    marginBottom: 16,
  },
  greeting: {
    color: "#0D1B2A",
    fontSize: 24,
    fontFamily: "CrimsonText_700Bold",
    marginBottom: 4,
  },
  dateText: {
    color: "#64748b",
    fontSize: 16,
    fontFamily: "CrimsonText_600SemiBold",
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
  locationText: {
    color: "#059669",
    fontSize: 14,
    fontFamily: "CrimsonText_600SemiBold",
    marginLeft: 6,
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
    fontSize: 14,
    fontFamily: "CrimsonText_600SemiBold",
    textAlign: "center",
  },
  carousel: {
    marginTop: 8,
  },
  eventCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    marginHorizontal: 4,
  },
  eventImage: {
    height: 180,
    justifyContent: "space-between",
  },
  eventImageStyle: {
    borderRadius: 16,
  },
  eventGradient: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
  },
  eventHeader: {
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
  eventInfo: {
    marginTop: "auto",
  },
  eventName: {
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
  eventMasjid: {
    color: "#F5F5DC",
    fontSize: 14,
    fontFamily: "CrimsonText_400Regular",
    marginLeft: 6,
    flex: 1,
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventDateText: {
    color: "#F5F5DC",
    fontSize: 12,
    fontFamily: "CrimsonText_400Regular",
    marginRight: 12,
  },
  eventTimeText: {
    color: "#10b981",
    fontSize: 12,
    fontFamily: "CrimsonText_600SemiBold",
  },
  attendeesBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  attendeesText: {
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
    fontSize: 1,
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
