import { Masjid } from "@/types/masjid";
import { Heart, Star } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MasjidCardProps {
  masjid: Masjid;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const { width } = Dimensions.get("window");
const cardWidth = width - 32;

export const MasjidCard: React.FC<MasjidCardProps> = ({
  masjid,
  isFavorite,
  onToggleFavorite,
}) => {
  const facilities = Array.isArray(masjid.facilityTypes)
    ? masjid.facilityTypes
    : [];

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer} className="flex-row  p-4 ">
        {masjid?.image ? (
          <Image
            source={{ uri: masjid.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={require("@/assets/images/mosque.jpg")}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <View className="flex-1">
          <View style={styles.header}>
            <Text style={styles.name} numberOfLines={1}>
              {masjid?.name}
            </Text>
            <Text style={styles.address}>{masjid?.address} </Text>
          </View>
        </View>

        <View>
          <TouchableOpacity
            onPress={onToggleFavorite}
            style={styles.favoriteButton}
          >
            <Heart
              size={20}
              color={isFavorite ? "#EF4444" : "#6B7280"}
              fill={isFavorite ? "#EF4444" : "transparent"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="h-0.5 w-full bg-emerald/30" />

      <View style={styles.content}>
        <View
          style={styles.statsRow}
          className="flex-row items-center justify-evenly"
        >
          <View style={styles.stat}>
            <Text style={styles.statText}>
              {masjid?.rating ?? 0}{" "}
              <Star color={"#ffbf00"} fill={"#ffbf00"} size={16} />
            </Text>
            <Text style={styles.statTextSub}>1.2k reviews</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statText}>{masjid.denomination}</Text>
            <Text style={styles.statTextSub}>Denomination</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statText}>{masjid?.followersCount ?? 0}</Text>
            <Text style={styles.statTextSub}>Members</Text>
          </View>
        </View>

        <View style={styles.facilities}>
          {facilities.slice(0, 3).map((facility, index) => (
            <View key={index} style={styles.facilityTag}>
              <Text style={styles.facilityText}>{facility}</Text>
            </View>
          ))}

          {facilities.length > 3 && (
            <View style={styles.facilityTag}>
              <Text style={styles.facilityText}>+{facilities.length - 3}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: "#fbfbf1",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  imageContainer: {
    padding: 10,
  },
  image: {
    width: "25%",
    height: "25%",
    borderRadius: 14,
    aspectRatio: 2 / 2,
    marginRight: 10,
  },
  favoriteButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  openBadge: {
    backgroundColor: "#10B981",
  },
  closedBadge: {
    backgroundColor: "#EF4444",
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    padding: 16,
  },
  header: {},
  name: {
    flex: 1,
    fontSize: 20,
    color: "#0D1B2A",
    marginRight: 8,
    fontFamily: "CrimsonText_700Bold",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  address: {
    flex: 1,
    marginLeft: 6,
    fontSize: 14,
    color: "#0D1B2A",
    fontFamily: "CrimsonText_400Regular",
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  stat: {
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    marginLeft: 4,
    fontSize: 18,
    color: "#0D1B2A",
    fontFamily: "CrimsonText_600SemiBold",
  },
  statTextSub: {
    marginLeft: 4,
    fontSize: 14,
    color: "#2E7D32",
    fontFamily: "CrimsonText_400Regular",
  },
  prayerInfo: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 10,
    marginBottom: 6,
  },
  prayerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  prayerLabel: {
    marginLeft: 6,
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "500",
    fontFamily: "CrimsonText_400Regular",
  },
  prayerDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prayerName: {
    fontSize: 16,
    color: "#1E40AF",
    fontFamily: "CrimsonText_600SemiBold",
  },
  prayerTime: {
    fontSize: 14,
    color: "#1E40AF",
  },
  facilities: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  facilityTag: {
    backgroundColor: "rgba(46, 125, 50, 0.15)",
    borderRadius: 16,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  facilityText: {
    fontSize: 13,
    color: "#4B5563",
    fontFamily: "CrimsonText_400Regular",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#3B82F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "CrimsonText_600SemiBold",
  },
  secondaryButton: {
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
});
