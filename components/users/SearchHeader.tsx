import { Search, X } from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  // selectedFilter: string;
  // onFilterChange: (filter: string) => void;
  // showFilters: boolean;
  // onToggleFilters: () => void;
  // filterOptions: FilterOption[];
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  const clearSearch = () => {
    onSearchChange("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover Masjids</Text>

      <View style={styles.searchContainer} className="bg-emerald/25 ">
        <Search size={20} color="#181816" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or location..."
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholderTextColor="#181816"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <X size={20} color="#181816" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* <View style={styles.filterHeader}>
        <TouchableOpacity
          onPress={onToggleFilters}
          style={[
            styles.filterToggle,
            showFilters && styles.filterToggleActive,
          ]}
        >
          <Filter size={16} color={showFilters ? "#FFFFFF" : "#3B82F6"} />
          <Text
            style={[
              styles.filterToggleText,
              showFilters && styles.filterToggleTextActive,
            ]}
          >
            Filters
          </Text>
        </TouchableOpacity>

        <Text style={styles.resultsCount}>
          {resultsCount} masjid{resultsCount !== 1 ? "s" : ""} found
        </Text>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => onFilterChange(option.value)}
              style={[
                styles.filterChip,
                selectedFilter === option.value && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === option.value &&
                    styles.filterChipTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
    color: "#0D1B2A",
    fontFamily: "CrimsonText_700Bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  filterToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  filterToggleActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  filterToggleText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },
  filterToggleTextActive: {
    color: "#FFFFFF",
  },
  resultsCount: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "CrimsonText_400Regular",
  },
  filtersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  filterChip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterChipActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4B5563",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
});
