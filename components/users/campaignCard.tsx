import { useAuth } from "@/app/context/AuthContext";
import { deleteDonationCampaign } from "@/services/getCampaigns";
import { Campaign } from "@/types/donation";
import { LinearGradient } from "expo-linear-gradient";
import {
  AlertTriangle,
  BookOpen,
  Clock,
  Edit,
  Globe,
  Heart,
  Home,
  Trash,
} from "lucide-react-native";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { toast } from "sonner-native";
import { DonationModal } from "./donationmodal";

interface CampaignCardProps {
  campaign: Campaign;
  onPress: (campaign: Campaign) => void;
  onDonate: (campaign: Campaign) => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onPress,
  onDonate,
}) => {
  const { role } = useAuth();
  const [donationModalVisible, setDonationModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const progress = (campaign.amountRaised / campaign.goal_amount) * 100;
  const daysRemaining = Math.ceil(
    (new Date(campaign.endDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const getCategoryIcon = (category: Campaign["category"]) => {
    const iconSize = 16;
    const iconColor = "#2E7D32";

    switch (category) {
      case "education":
        return <BookOpen size={iconSize} color={iconColor} />;
      case "construction":
        return <Home size={iconSize} color={iconColor} />;
      case "charity":
        return <Heart size={iconSize} color={iconColor} />;
      case "emergency":
        return <AlertTriangle size={iconSize} color={iconColor} />;
      default:
        return <Globe size={iconSize} color={iconColor} />;
    }
  };

  const getStatusConfig = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return { color: "#4CAF50", label: "Active", textColor: "#fff" };
      case "completed":
        return { color: "#9E9E9E", label: "Completed", textColor: "#fff" };
      case "upcoming":
        return { color: "#FF9800", label: "Upcoming", textColor: "#fff" };
      case "archived":
        return { color: "#E0E0E0", label: "Archived", textColor: "#666" };
      default:
        return { color: "#666", label: "Unknown", textColor: "#fff" };
    }
  };

  const statusConfig = getStatusConfig(campaign.status);

  const getStatusText = () => {
    switch (campaign.status) {
      case "active":
        return `Ends in ${daysRemaining} days`;
      case "completed":
        return "Successfully Completed!";
      case "upcoming":
        return `Starts ${new Date(campaign.startDate).toLocaleDateString()}`;
      case "archived":
        return "Archived Campaign";
      default:
        return "";
    }
  };

  const handleDonatePress = () => {
    if (campaign.status === "active") {
      setDonationModalVisible(true);
    } else {
      onPress(campaign);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCampaignDelete = async (campaignId: string) => {
    setLoading(true);
    try {
      await deleteDonationCampaign(campaignId);
      toast.success("Campaign deleted successfully.", {
        icon: <Trash size={20} color="red" />,

        duration: 3000,
        style: { borderBlockColor: "red", borderWidth: 1 },
      });
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }

    setLoading(false);
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(campaign)}
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Campaign Image with Status Badge */}
      <View style={{ position: "relative" }}>
        <Image
          source={{
            uri: `https://picsum.photos/seed/${campaign.id}/400/200`,
          }}
          style={{
            width: "100%",
            height: 150,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        />
        <View
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            backgroundColor: statusConfig.color,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
          }}
        >
          <Text
            style={{
              color: statusConfig.textColor,
              fontSize: 12,
              fontWeight: "600",
            }}
          >
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* Card Content */}
      <View style={{ paddingHorizontal: 16, paddingTop: 5 }}>
        {/* Category and Title */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          {getCategoryIcon(campaign.category)}
          <Text
            style={{
              marginLeft: 6,
              fontSize: 15,
              color: "#2E7D32",
              textTransform: "capitalize",
              fontFamily: "CrimsonText_600SemiBold",
            }}
          >
            {campaign.category}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 20,
            marginBottom: 3,
            color: "#212121",
            fontFamily: "CrimsonText_700Bold",
          }}
        >
          {campaign.title}
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "#757575",
            marginBottom: 8,
            lineHeight: 18,
            fontFamily: "CrimsonText_700Bold",
          }}
          numberOfLines={3}
        >
          {campaign.description}
        </Text>

        {/* Progress Bar */}
        {campaign.status !== "upcoming" && (
          <View style={{ marginBottom: 5 }}>
            <View
              style={{
                height: 6,
                backgroundColor: "#E0E0E0",
                borderRadius: 3,
                marginBottom: 8,
                overflow: "hidden",
              }}
            >
              <LinearGradient
                colors={["#0A9C94", "#4361EE"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  height: "100%",
                  width: `${Math.min(progress, 100)}%`,
                  borderRadius: 3,
                }}
              />
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#212121",
                  fontFamily: "CrimsonText_600SemiBold",
                }}
              >
                {formatCurrency(campaign.amountRaised)} raised
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#757575",
                  fontWeight: "600",
                  fontFamily: "CrimsonText_600SemiBold",
                }}
              >
                of {formatCurrency(campaign.goal_amount)}
              </Text>
            </View>
          </View>
        )}

        {/* Status and Time */}
        <View style={{ gap: 4, flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Clock size={16} color="#757575" />
            <Text
              style={{
                marginLeft: 6,
                fontSize: 16,
                color: "#757575",
                fontFamily: "CrimsonText_600SemiBold",
              }}
            >
              {getStatusText()}
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: 14,
                color: "#9E9E9E",
                fontFamily: "CrimsonText_600SemiBold",
              }}
            >
              Created by {campaign.masjidName}
            </Text>
          </View>
        </View>
        {/* Donate Button */}
        {role === "user" ? (
          <TouchableOpacity
            onPress={() => handleDonatePress()}
            disabled={campaign.status !== "active"}
            style={{
              backgroundColor:
                campaign.status === "active" ? "#2E7D32" : "#E0E0E0",
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: campaign.status === "active" ? "#fff" : "#9E9E9E",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              {campaign.status === "active"
                ? "Donate Now"
                : campaign.status === "completed"
                  ? "View Details"
                  : campaign.status === "upcoming"
                    ? "Notify Me"
                    : "Archived"}
            </Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => handleCampaignDelete(campaign.id)}
              disabled={campaign.status !== "active"}
              style={{
                backgroundColor:
                  campaign.status === "active" ? "#2E7D32" : "#E0E0E0",
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 8,
                alignItems: "center",
                flexDirection: "row",
                gap: 3,
              }}
            >
              <Trash size={18} className="animate-ping" color="#fff" />
              <Text
                style={{
                  color: campaign.status === "active" ? "#fff" : "#9E9E9E",
                  fontSize: 17,
                  fontWeight: "600",
                  fontFamily: "CrimsonText_600SemiBold",
                }}
              >
                Delete
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => onDonate(campaign)}
              disabled={campaign.status !== "active"}
              style={{
                backgroundColor:
                  campaign.status === "active" ? "#2E7D32" : "#E0E0E0",
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderRadius: 8,
                alignItems: "center",
                flexDirection: "row",
                gap: 6,
              }}
            >
              <Edit size={20} color="#fff" />

              <Text
                style={{
                  color: campaign.status === "active" ? "#fff" : "#9E9E9E",
                  fontSize: 16,
                  fontWeight: "600",
                  fontFamily: "CrimsonText_600SemiBold",
                }}
              >
                Recieved Amount
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => onDonate(campaign)}
              disabled={campaign.status !== "active"}
              style={{
                backgroundColor:
                  campaign.status === "active" ? "#2E7D32" : "#E0E0E0",
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 8,
                alignItems: "center",
                flexDirection: "row",
                gap: 6,
              }}
            >
              <Text>
                <Edit size={20} color="#fff" />
              </Text>
              <Text
                style={{
                  color: campaign.status === "active" ? "#fff" : "#9E9E9E",
                  fontSize: 16,
                  fontWeight: "600",
                  fontFamily: "CrimsonText_600SemiBold",
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <DonationModal
        visible={donationModalVisible}
        onClose={() => setDonationModalVisible(false)}
        campaign={campaign}
      />
    </TouchableOpacity>
  );
};
