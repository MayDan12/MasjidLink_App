import ShimmerSkeleton from "@/components/ShimmerSkeleton";
import { subscribeToEvents } from "@/services/getEvent";
import { Event } from "@/types/event";
import { Filter, Play, Search, ShoppingCart, User } from "lucide-react-native";
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

type AzanData = {
  id: string;
  name: string;
  type: string;
  azan: string;
  location: string;
  price?: number;
};

const filters = ["All", "free", "premium", "mecca", "medina", "other"];

const azanVoices: AzanData[] = [
  {
    id: "1",
    name: "Muezzin 1",
    type: "free",
    azan: "azan1.mp3",
    location: "Mecca",
    price: 0,
  },
  {
    id: "2",
    name: "Muezzin 2",
    type: "premium",
    azan: "azan2.mp3",
    location: "Medina",
    price: 5,
  },
  {
    id: "3",
    name: "Muezzin 3",
    type: "mecca",
    azan: "azan3.mp3",
    location: "Mecca",
    price: 10,
  },
  {
    id: "4",
    name: "Muezzin 4",
    type: "medina",
    azan: "azan4.mp3",
    location: "Medina",
    price: 15,
  },
  {
    id: "5",
    name: "Muezzin 5",
    type: "other",
    azan: "azan5.mp3",
    location: "Other",
    price: 20,
  },
];

export default function AzanScreen() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [events, setEvents] = useState<Event[]>([]);
  const [azans, setAzans] = useState<AzanData[]>([]);
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

  const filteredAzans =
    selectedFilter === "All"
      ? azanVoices
      : azanVoices.filter((e) => e.type === selectedFilter);

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5DC" }}>
      {/* <StatusBar style="light" /> */}
      {/* Background */}

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* <Text style={styles.headerTitle}></Text> */}
          <Text style={styles.headerSubtitle}>
            Add your favorite Azan voices to prayer time
          </Text>
        </View>

        {/* Search & Filter */}
        <View style={styles.searchFilterContainer}>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={20} color={COLORS.midnight} />
            <Text style={styles.searchText}>Search azan&apos;s</Text>
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
          data={loading ? [] : filteredAzans} // empty while loading
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
                No azans found
              </Text>
            )
          }
          renderItem={({ item: azan }) => (
            <View
              style={styles.azanCard}
              className=" border-emerald/25 px-5 py-2 flex-row items-center"
            >
              {/* azan Icon */}
              <TouchableOpacity className="items-center justify-center bg-emerald/25 p-3 rounded-2xl">
                {/* {getEventTypeIcon(azan.type)} */}
                <User size={24} color={COLORS.emerald} />
              </TouchableOpacity>

              {/* azan Info */}
              <View className="flex-1 ml-4">
                <View style={styles.azanHeader}>
                  <View>
                    <Text style={[styles.azanType]} className="capitalize">
                      {azan.type}{" "}
                      {azan.price ? (
                        <Text className="text-gold">- ${azan.price}</Text>
                      ) : (
                        ""
                      )}
                    </Text>
                    <Text style={styles.azanTitle}>{azan.name}</Text>
                    <Text style={styles.azanLocation} className="text-gray-500">
                      {azan.location}
                    </Text>
                  </View>
                  <View className="items-center justify-center">
                    <TouchableOpacity className=" bg-emerald/20 p-2 rounded-full">
                      {azan.type === "free" ? (
                        <Play size={20} color={COLORS.emerald} />
                      ) : (
                        <ShoppingCart size={20} color={COLORS.emerald} />
                      )}
                    </TouchableOpacity>
                  </View>
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
  azanCard: {
    borderRadius: 16,
    backgroundColor: "#fbfbf1",
    borderWidth: 1,
    marginBottom: 10,
  },
  azanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  azanTitle: {
    color: COLORS.midnight,
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  azanType: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: COLORS.emerald,
  },
  azanLocation: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  azanFooter: {
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

/* <View style={styles.azanFooter}>
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
                </View> */
