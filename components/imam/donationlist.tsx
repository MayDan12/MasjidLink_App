import { useAuth } from "@/app/context/AuthContext";
import { CampaignCard } from "@/components/users/campaignCard";
import { subscribeToImamDonations } from "@/services/getCampaigns";
import { Campaign, CategoryType } from "@/types/donation";
import { Loader, Search } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORIES: { value: CategoryType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "general", label: "General" },
  { value: "construction", label: "Construction" },
  { value: "education", label: "Education" },
  { value: "charity", label: "Charity" },
  { value: "emergency", label: "Emergency" },
];

export const DonationListing: React.FC = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryType | "all"
  >("all");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToImamDonations(user.uid, (donationList) => {
      setDonations(donationList);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [user?.uid]);

  const filteredCampaigns = useMemo(() => {
    return donations.filter((campaign) => {
      const matchesSearch =
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || campaign.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, donations]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleCampaignPress = (campaign: Campaign) => {
    // Navigate to campaign detail screen
    console.log("Navigate to campaign:", campaign.id);
  };

  const handleDonatePress = (campaign: Campaign) => {
    if (campaign.status === "active") {
      // Start donation flow
      console.log("Start donation for:", campaign.id);
    } else {
      handleCampaignPress(campaign);
    }
  };

  const renderCategoryItem = ({ item }: { item: (typeof CATEGORIES)[0] }) => (
    <TouchableOpacity
      onPress={() => setSelectedCategory(item.value)}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor:
          selectedCategory === item.value ? "#2E7D32" : "#fbfbf1",
        borderRadius: 20,
        marginRight: 8,
        borderColor: "#2E7D32",
        borderWidth: 1,
      }}
    >
      <Text
        style={{
          color: selectedCategory === item.value ? "#fff" : "#2E7D32",
          fontSize: 14,
          fontWeight: "500",
          fontFamily: "CrimsonText_600SemiBold",
        }}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>
          <Loader className="animate-spin" />
          Loading campaigns...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5DC" }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={{ paddingHorizontal: 16 }}>
        <Text
          style={{
            fontSize: 28,
            color: "#212121",

            fontFamily: "CrimsonText_600SemiBold",
          }}
        >
          Donation Campaigns
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: "#222",
            fontFamily: "CrimsonText_400Regular",
          }}
        >
          Manage your ongoing and past donation campaigns.
        </Text>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 16, marginBottom: 12, marginTop: 5 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <Search size={20} color="#757575" />
          <TextInput
            placeholder="Search campaigns..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              color: "#212121",
              fontFamily: "CrimsonText_600SemiBold",
            }}
            placeholderTextColor="#9E9E9E"
          />
        </View>
      </View>

      {/* Category Filter */}
      <View style={{ marginBottom: 16 }}>
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.value}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>

      {/* Campaigns List */}
      <FlatList
        data={filteredCampaigns}
        renderItem={({ item }) => (
          <CampaignCard
            campaign={item}
            onPress={handleCampaignPress}
            onDonate={handleDonatePress}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0A9C94"]}
          />
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", padding: 40 }}>
            <Text
              style={{ fontSize: 16, color: "#757575", textAlign: "center" }}
            >
              No campaigns found{searchQuery ? ` for "${searchQuery}"` : ""}
              {selectedCategory !== "all" ? ` in ${selectedCategory}` : ""}.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default DonationListing;
