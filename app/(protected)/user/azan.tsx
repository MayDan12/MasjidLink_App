import ShimmerSkeleton from "@/components/ShimmerSkeleton";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import {
  Filter,
  Pause,
  Play,
  Search,
  ShoppingCart,
  User,
} from "lucide-react-native";
import { useState } from "react";
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
    type: "free",
    azan: "azan2.mp3",
    location: "Medina",
    price: 0,
  },
  {
    id: "3",
    name: "Muezzin 3",
    type: "free",
    azan: "azan3.mp3",
    location: "Mecca",
    price: 0,
  },
  {
    id: "4",
    name: "Muezzin 4",
    type: "free",
    azan: "azan4.mp3",
    location: "Medina",
    price: 0,
  },
  {
    id: "5",
    name: "Muezzin 5",
    type: "free",
    azan: "azan5.mp3",
    location: "Other",
    price: 0,
  },
  {
    id: "6",
    name: "Muezzin 6",
    type: "free",
    azan: "azan6.mp3",
    location: "Other",
    price: 0,
  },
  {
    id: "7",
    name: "Muezzin 7",
    type: "free",
    azan: "azan7.mp3",
    location: "Other",
    price: 0,
  },
  {
    id: "8",
    name: "Muezzin 8",
    type: "free",
    azan: "azan8.mp3",
    location: "Other",
    price: 0,
  },
];

// Map audio files for static require
const azanAudioMap: Record<string, any> = {
  "azan1.mp3": require("@/assets/audio/azan1.mp3"),
  "azan2.mp3": require("@/assets/audio/azan2.mp3"),
  "azan3.mp3": require("@/assets/audio/azan3.mp3"),
  "azan4.mp3": require("@/assets/audio/azan4.mp3"),
  "azan5.mp3": require("@/assets/audio/azan5.mp3"),
  "azan6.mp3": require("@/assets/audio/azan6.mp3"),
  "azan7.mp3": require("@/assets/audio/azan7.mp3"),
  "azan8.mp3": require("@/assets/audio/azan8.mp3"),
};

export default function AzanScreen() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [currentAzanId, setCurrentAzanId] = useState<string | null>(null);

  // Create individual audio players for each azan
  const azanPlayers = {
    "1": useAudioPlayer(azanAudioMap["azan1.mp3"]),
    "2": useAudioPlayer(azanAudioMap["azan2.mp3"]),
    "3": useAudioPlayer(azanAudioMap["azan3.mp3"]),
    "4": useAudioPlayer(azanAudioMap["azan4.mp3"]),
    "5": useAudioPlayer(azanAudioMap["azan5.mp3"]),
    "6": useAudioPlayer(azanAudioMap["azan6.mp3"]),
    "7": useAudioPlayer(azanAudioMap["azan7.mp3"]),
    "8": useAudioPlayer(azanAudioMap["azan8.mp3"]),
  };

  // Get status for each player
  const azanStatuses = {
    "1": useAudioPlayerStatus(azanPlayers["1"]),
    "2": useAudioPlayerStatus(azanPlayers["2"]),
    "3": useAudioPlayerStatus(azanPlayers["3"]),
    "4": useAudioPlayerStatus(azanPlayers["4"]),
    "5": useAudioPlayerStatus(azanPlayers["5"]),
    "6": useAudioPlayerStatus(azanPlayers["6"]),
    "7": useAudioPlayerStatus(azanPlayers["7"]),
    "8": useAudioPlayerStatus(azanPlayers["8"]),
  };

  const filteredAzans =
    selectedFilter === "All"
      ? azanVoices
      : azanVoices.filter((e) => e.type === selectedFilter);

  const handlePlayAzan = async (azanId: string) => {
    try {
      const player = azanPlayers[azanId as keyof typeof azanPlayers];
      const status = azanStatuses[azanId as keyof typeof azanStatuses];

      if (currentAzanId === azanId) {
        // If clicking the same azan, toggle play/pause
        if (status?.playing) {
          await player.pause();
          setCurrentAzanId(null);
        } else {
          await player.play();
          setCurrentAzanId(azanId);
        }
      } else {
        // If clicking a different azan, stop current and play new one
        if (currentAzanId) {
          await azanPlayers[currentAzanId as keyof typeof azanPlayers].pause();
        }

        await player.play();
        setCurrentAzanId(azanId);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  // Check if any azan is currently playing
  const isAzanPlaying = (azanId: string) => {
    const status = azanStatuses[azanId as keyof typeof azanStatuses];
    return currentAzanId === azanId && status?.playing;
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.sand }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
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
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Azan list */}
        <FlatList
          data={loading ? [] : filteredAzans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 150 }}
          ListEmptyComponent={
            loading ? (
              <View style={{ gap: 12 }}>
                {[...Array(9)].map((_, i) => (
                  <ShimmerSkeleton key={i} height={70} variant="circle" />
                ))}
              </View>
            ) : (
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
            <View style={styles.azanCard}>
              <TouchableOpacity style={styles.iconContainer}>
                <User size={24} color={COLORS.emerald} />
              </TouchableOpacity>

              <View style={{ flex: 1, marginLeft: 16 }}>
                <View style={styles.azanHeader}>
                  <View>
                    <Text style={styles.azanType}>
                      {azan.type}{" "}
                      {azan.price ? (
                        <Text style={{ color: COLORS.gold }}>
                          - ${azan.price}
                        </Text>
                      ) : (
                        ""
                      )}
                    </Text>
                    <Text style={styles.azanTitle}>{azan.name}</Text>
                    <Text style={styles.azanLocation}>{azan.location}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => handlePlayAzan(azan.id)}
                  >
                    {isAzanPlaying(azan.id) ? (
                      <Pause size={20} color={COLORS.emerald} />
                    ) : azan.type === "free" ? (
                      <Play size={20} color={COLORS.emerald} />
                    ) : (
                      <ShoppingCart size={20} color={COLORS.emerald} />
                    )}
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
  container: { padding: 20 },
  header: { marginBottom: 20 },
  headerSubtitle: { color: COLORS.midnight, fontSize: 14 },
  searchFilterContainer: { flexDirection: "row" },
  searchButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.emerald,
    backgroundColor: "rgba(46,125,50,0.05)",
    marginRight: 12,
  },
  searchText: { marginLeft: 8, color: COLORS.midnight },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(46,125,50,0.15)",
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
  filterChipText: { color: COLORS.midnight },
  filterChipTextActive: { color: COLORS.sand },
  azanCard: {
    borderRadius: 16,
    backgroundColor: "#fbfbf1",
    borderWidth: 1,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(46,125,50,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  azanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  azanTitle: { color: COLORS.midnight, fontSize: 18 },
  azanType: { fontSize: 14, color: COLORS.emerald },
  azanLocation: { fontSize: 14, color: "#666" },
  playButton: {
    padding: 10,
    borderRadius: 999,
    backgroundColor: "rgba(46,125,50,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
});
