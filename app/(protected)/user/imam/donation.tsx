import { useAuth } from "@/app/context/AuthContext";
import { CreateCampaign } from "@/components/imam/createcampaign";
import { DonationListing } from "@/components/imam/donationlist";
import { createDonationCampaign } from "@/services/getCampaigns";
import { CreateCampaignData } from "@/types/donation";
import { BellPlus, Plus } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { toast } from "sonner-native";

export default function ImamDonation() {
  const { user, role } = useAuth();
  const [currentView, setCurrentView] = useState<"list" | "create">("list");

  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCampaign = async (data: CreateCampaignData) => {
    setIsCreating(true);
    if (!user || role === "user") return;

    try {
      // Call your service to create the campaign
      await createDonationCampaign(data, user.uid);
      toast.success("Campaign created successfully!", {
        style: { borderBlockColor: "#2E7D32", borderWidth: 1 },
        icon: <BellPlus size={20} color="#2E7D32" />,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign. Please try again.");
      return;
    } finally {
      setIsCreating(false);
      setCurrentView("list");
    }
  };

  const handleCancelCreate = () => {
    setCurrentView("list");
  };

  if (currentView === "create") {
    return (
      <CreateCampaign
        onSubmit={handleCreateCampaign}
        onCancel={handleCancelCreate}
        isLoading={isCreating}
      />
    );
  }

  return (
    <View style={{ flex: 1, paddingVertical: 20, backgroundColor: "#F5F5DC" }}>
      <DonationListing />
      {/* Add FAB or button to switch to create view */}
      <TouchableOpacity
        onPress={() => setCurrentView("create")}
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          backgroundColor: "#0A9C94",
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
