import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ErrorState } from "@/components/users/ErrorState";
import { LoadingState } from "@/components/users/LoadingState";
import { MasjidCard } from "@/components/users/MasjidCard";
import { SearchHeader } from "@/components/users/SearchHeader";
import { useMasjids } from "@/hooks/useMasjids";
import { FilterOption, Masjid } from "@/types/masjid";

export default function DiscoverScreen() {
  const { masjids, loading, error } = useMasjids();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // // Debugging logs
  // useEffect(() => {
  //   console.log("✅ Screen masjids (from hook):", masjids);
  // }, [masjids]);

  const filterOptions: FilterOption[] = [
    { value: "all", label: "All Masjids" },
    { value: "nearby", label: "Nearby (≤2km)" },
    { value: "open", label: "Open Now" },
    { value: "favorites", label: "Favorites" },
  ];

  // Filter + search logic
  const filteredMasjids = useMemo(() => {
    if (!Array.isArray(masjids)) return [];

    const normalizedQuery = (searchQuery ?? "").toLowerCase();

    return masjids.filter((masjid: Masjid) => {
      const matchesSearch =
        (masjid.name ?? "").toLowerCase().includes(normalizedQuery) ||
        (masjid.address ?? "").toLowerCase().includes(normalizedQuery) ||
        (masjid.city ?? "").toLowerCase().includes(normalizedQuery) ||
        (masjid.state ?? "").toLowerCase().includes(normalizedQuery) ||
        (masjid.country ?? "").toLowerCase().includes(normalizedQuery);

      if (selectedFilter === "favorites") {
        return matchesSearch && favorites.has(masjid.id);
      }
      return matchesSearch;
    });
  }, [masjids, searchQuery, selectedFilter, favorites]);

  // console.log("Filtered masjids:", filteredMasjids);

  // Toggle favorites
  const toggleFavorite = useCallback((masjidId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(masjidId)) {
        newFavorites.delete(masjidId);
      } else {
        newFavorites.add(masjidId);
      }
      return newFavorites;
    });
  }, []);

  // Render each masjid card safely
  const renderMasjidCard = useCallback(
    ({ item }: { item: Masjid }) => {
      try {
        return (
          <TouchableOpacity
            onPress={() => {
              // Handle masjid card press if needed
            }}
            activeOpacity={0.8}
          >
            <MasjidCard
              masjid={item}
              isFavorite={favorites.has(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          </TouchableOpacity>
        );
      } catch (error) {
        console.error("❌ Error rendering masjid card:", error, item);
        return null;
      }
    },
    [favorites, toggleFavorite]
  );

  // ✅ Prevent rendering before data is ready
  if (loading || !Array.isArray(masjids)) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <StatusBar style="light" />

      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        // Uncomment these if filters will be used later
        // selectedFilter={selectedFilter}
        // onFilterChange={setSelectedFilter}
        // showFilters={showFilters}
        // onToggleFilters={() => setShowFilters(!showFilters)}
        // filterOptions={filterOptions}
      />

      <FlatList
        data={Array.isArray(filteredMasjids) ? filteredMasjids : []}
        renderItem={renderMasjidCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          filteredMasjids.length === 0 && { flex: 1, justifyContent: "center" },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading && <Text style={styles.emptyText}>No masjids found</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },
  listContainer: {
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
});
