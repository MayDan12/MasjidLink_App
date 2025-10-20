import { useAuth } from "@/app/context/AuthContext";
import ShimmerSkeleton from "@/components/ShimmerSkeleton";
import { subscribeToImamEvents } from "@/services/getEvent";
import {
  BookOpen,
  Calendar,
  CalendarClock,
  HandHeart,
  Users,
  Utensils,
} from "lucide-react-native";
import { useEffect, useState } from "react";

import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateEventModal } from "../createeventmodal";

const COLORS = {
  emerald: "#2E7D32",
  sand: "#F5F5DC",
  midnight: "#0D1B2A",
  gold: "#D4AF37",
};

export type EventType = "lecture" | "janazah" | "iftar" | "class" | "other";
export type RecurringFrequency = "daily" | "weekly" | "monthly";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  type: EventType;
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency;
  isPublic: boolean;
  maxAttendees?: string;
  rsvps: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  meetingLink?: string;
}

const filters = ["All", "lecture", "janazah", "iftar", "class", "other"];

export default function CreateEventScreen() {
  const { user } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (!user?.uid) return;
    // Subscribe to realtime events
    const unsubscribe = subscribeToImamEvents(user?.uid, (newEvents) => {
      setEvents(newEvents);
      setLoading(false);
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  const imamEvents =
    selectedFilter === "All"
      ? events
      : events.filter((e) => e.type === selectedFilter);

  const handleCreateEvent = (formData: Partial<Event>) => {
    const event: Event = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title || "",
      description: formData.description || "",
      date: formData.date || "",
      startTime: formData.startTime || "",
      endTime: formData.endTime || undefined,
      location: formData.location || "",
      type: formData.type as EventType,
      isRecurring: formData.isRecurring || false,
      recurringFrequency: formData.isRecurring
        ? formData.recurringFrequency
        : undefined,
      isPublic: formData.isPublic || true,
      maxAttendees: formData.maxAttendees || undefined,
      rsvps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user?.uid || "imam_id",
    };

    // TODO: Replace with actual API call to save event
    console.log("Event created:", event);
    Alert.alert("Success", "Event created successfully!");
  };

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

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      {/* <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      > */}
      <View style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View className="flex-row items-center justify-between">
            <Text style={styles.headerTitle}>Events</Text>
            <TouchableOpacity
              className="ml-2 rounded-xl bg-emerald p-2"
              onPress={() => setCreateModalVisible(true)}
            >
              <Text
                style={{ fontFamily: "CrimsonText_600SemiBold", fontSize: 16 }}
                className="text-white"
              >
                Create Event
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>
            Create and manage events, programs, and activities for your masjid
            community.
          </Text>
        </View>

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
          data={loading ? [] : imamEvents} // empty while loading
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
              <TouchableOpacity className="items-center justify-center bg-emerald/25 p-3 rounded-2xl">
                {getEventTypeIcon(event.type)}
              </TouchableOpacity>

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
      {/* </ScrollView> */}
      {/* Modal for creating events */}
      <CreateEventModal
        visible={isCreateModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSubmit={handleCreateEvent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },
  scrollView: {
    padding: 16,
    paddingBottom: 32,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 10,
  },
  headerTitle: {
    color: "#0D1B2A",
    fontSize: 24,
    fontFamily: "CrimsonText_700Bold",
  },
  headerSubtitle: {
    color: "#64748b",
    fontSize: 16,
    fontFamily: "CrimsonText_600SemiBold",
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
  formContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: "#0D1B2A",
    fontSize: 14,
    fontFamily: "CrimsonText_600SemiBold",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    fontFamily: "CrimsonText_400Regular",
    color: "#0D1B2A",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
  },
  dateText: {
    color: "#0D1B2A",
    fontSize: 14,
    fontFamily: "CrimsonText_400Regular",
    marginLeft: 8,
    flex: 1,
  },
  inputIcon: {
    position: "absolute",
    right: 12,
    top: 38,
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  submitButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  submitButtonText: {
    color: "#F5F5DC",
    fontSize: 16,
    fontFamily: "CrimsonText_600SemiBold",
    marginLeft: 8,
  },
});
