// hooks/useCampaignDonation.ts

import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";
import { Alert } from "react-native";

export const useCampaignDonation = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createDonationIntent = async (campaignId: string, amount: number) => {
    if (!user) {
      Alert.alert("Error", "Please login to make a donation");
      return null;
    }

    if (amount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return null;
    }

    setLoading(true);
    try {
      const token = await user.getIdToken();

      const response = await fetch("/api/donations/campaign/intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          campaignId,
          amount,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create donation");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const confirmDonation = async (paymentIntentId: string) => {
    if (!user) {
      Alert.alert("Error", "User not authenticated");
      return null;
    }

    setLoading(true);
    try {
      const token = await user.getIdToken();

      const response = await fetch("/api/donations/campaign/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentIntentId,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      Alert.alert(
        "Success",
        `Thank you for your donation of $${result.amount}!`
      );
      return result;
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to confirm donation");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createDonationIntent,
    confirmDonation,
    loading,
  };
};
