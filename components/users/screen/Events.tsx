import ShimmerSkeleton from "@/components/ShimmerSkeleton";
import { subscribeToEvents } from "@/services/getEvent";
import { Event } from "@/types/event";
import { StatusBar } from "expo-status-bar";
import {
  BookOpen,
  Calendar,
  CalendarClock,
  Filter,
  HandHeart,
  Search,
  Users,
  Utensils,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ Palette
const COLORS = {
  emerald: "#2E7D32",
  sand: "#F5F5DC",
  midnight: "#0D1B2A",
  gold: "#D4AF37",
};

const filters = ["All", "lecture", "janazah", "iftar", "class", "other"];

// const events = [
//   {
//     id: "1",
//     title: "Friday Congregational Prayer",
//     type: "Prayer",
//     attendees: 120,
//   },
//   {
//     id: "2",
//     title: "Community Iftar Gathering",
//     type: "Community",
//     attendees: 85,
//   },
//   {
//     id: "3",
//     title: "Qur’an Study Circle",
//     type: "Education",
//     attendees: 40,
//   },
// ];

export default function EventsScreen() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Subscribe to realtime events
    const unsubscribe = subscribeToEvents((newEvents) => {
      setEvents(newEvents);
      setLoading(false);
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  // "janazah" | "lecture" | "iftar" | "class" | "other";

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "janazah":
        return COLORS.emerald;
      case "lecture":
        return COLORS.gold;
      case "iftar":
        return COLORS.midnight;
      case "other":
        return "#8B5CF6"; // Optional extra (purple accent)
      default:
        return COLORS.midnight;
    }
  };
  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "janazah":
        return <HandHeart size={24} color={COLORS.emerald} />;
      case "lecture":
        return <Users size={24} color={COLORS.emerald} />;
      case "iftar":
        return <Utensils size={24} color={COLORS.emerald} />;
      case "class":
        return <BookOpen size={24} color={COLORS.emerald} />;
      case "other":
        return <Calendar size={24} color={COLORS.emerald} />;
      default:
        return <Calendar size={24} color={COLORS.emerald} />;
    }
  };

  const filteredEvents =
    selectedFilter === "All"
      ? events
      : events.filter((e) => e.type === selectedFilter);

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5DC" }}>
      <StatusBar style="auto" />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Upcoming Events</Text>
          <Text style={styles.headerSubtitle}>
            Stay connected with your community
          </Text>
        </View>

        {/* Search & Filter */}
        <View style={styles.searchFilterContainer}>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={20} color={COLORS.midnight} />
            <Text style={styles.searchText}>Search events</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={COLORS.emerald} />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <FlatList
          horizontal
          data={filters}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedFilter === item && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(item)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === item && styles.filterChipTextActive,
                ]}
                className="capitalize w-full text-center"
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />

        <FlatList
          data={loading ? [] : filteredEvents} // empty while loading
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            loading ? (
              // Skeleton loaders while fetching
              <View style={{ gap: 12 }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <ShimmerSkeleton key={i} height={70} variant="circle" />
                ))}
              </View>
            ) : (
              // Message when no events found
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  color: COLORS.midnight,
                }}
              >
                No events found
              </Text>
            )
          }
          renderItem={({ item: event }) => (
            <View
              style={styles.eventCard}
              className=" border-emerald/25 px-5 py-2 flex-row items-center"
            >
              {/* Event Icon */}
              <TouchableOpacity className="items-center justify-center bg-emerald/25 p-3 rounded-2xl">
                {getEventTypeIcon(event.type)}
              </TouchableOpacity>

              {/* Event Info */}
              <View className="flex-1 ml-4">
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text
                    style={[
                      styles.eventType,
                      { color: getEventTypeColor(event.type) },
                    ]}
                    className="capitalize"
                  >
                    {event.type}
                  </Text>
                </View>

                <View style={styles.eventFooter}>
                  <View className="space-y-2">
                    <View className="flex-row items-center">
                      <Users size={16} color={COLORS.midnight} />
                      <Text style={styles.attendeesText}>
                        {event.rsvps.length} attending
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <CalendarClock size={16} color={COLORS.midnight} />
                      <Text style={styles.attendeesText}>
                        {event.date
                          ? new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "TBD"}{" "}
                        / {event.startTime || "TBD"} - {event.endTime || "TBD"}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity className="p-2 bg-emerald rounded-lg ">
                    <Text style={styles.seeAllText}>Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    color: COLORS.midnight,
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  headerSubtitle: {
    color: COLORS.midnight,
    fontSize: 14,
    marginTop: 2,
    fontFamily: "Inter_400Regular",
  },
  searchFilterContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  searchButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.emerald,
    backgroundColor: "rgba(46, 125, 50, 0.05)",
    marginRight: 12,
  },
  searchText: {
    marginLeft: 8,
    color: COLORS.midnight,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(46, 125, 50, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.emerald,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fbfbf1",
    borderWidth: 1,
    borderColor: COLORS.emerald,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: COLORS.emerald,
    borderColor: COLORS.emerald,
  },
  filterChipText: {
    color: COLORS.midnight,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  filterChipTextActive: {
    color: COLORS.sand,
  },
  eventCard: {
    borderRadius: 16,
    backgroundColor: "#fbfbf1",
    borderWidth: 1,
    marginBottom: 10,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  eventTitle: {
    color: COLORS.midnight,
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  eventType: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  attendees: {
    flexDirection: "column",
    alignItems: "center",
  },
  attendeesText: {
    color: COLORS.midnight,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    marginLeft: 8,
  },
  seeAllText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
});
