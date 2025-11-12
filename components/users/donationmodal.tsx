// components/DonationModal.tsx
import { useCampaignDonation } from "@/hooks/useCampaignDonatin";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { DollarSign, Heart, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface DonationModalProps {
  visible: boolean;
  onClose: () => void;
  campaign: {
    id: string;
    title: string;
    goal_amount: number;
    amountRaised: number;
  };
}

const PRESET_AMOUNTS = [10, 25, 50, 100, 250];

export const DonationModal: React.FC<DonationModalProps> = ({
  visible,
  onClose,
  campaign,
}) => {
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);

  const { createDonationIntent, confirmDonation, loading } =
    useCampaignDonation();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmount = (amount: string) => {
    const cleaned = amount.replace(/[^0-9.]/g, "");
    // Ensure only one decimal point
    const parts = cleaned.split(".");
    if (parts.length > 2) return;
    setCustomAmount(cleaned);
    setSelectedAmount(null);
  };

  const getDonationAmount = (): number => {
    if (customAmount) {
      return parseFloat(customAmount) || 0;
    }
    return selectedAmount || 0;
  };

  const initializePaymentSheet = async (clientSecret: string) => {
    try {
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Masjid Link",
        returnURL: "masjidlink://stripe-redirect",
        style: "alwaysLight",
        allowsDelayedPaymentMethods: false,
      });

      if (error) {
        Alert.alert("Error", error.message);
        console.log("Payment error:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Exception initializing payment sheet:", error);
      Alert.alert("Error", "Failed to initialize payment system");
      return false;
    }
  };

  const handleDonate = async () => {
    const amount = getDonationAmount();

    if (amount <= 0) {
      Alert.alert("Error", "Please select or enter a valid amount");
      return;
    }

    if (amount < 1) {
      Alert.alert("Error", "Minimum donation amount is $1");
      return;
    }

    setProcessing(true);
    try {
      // Create donation intent
      const intentResult = await createDonationIntent(campaign.id, amount);

      if (!intentResult) return;

      // Initialize payment sheet
      const initialized = await initializePaymentSheet(
        intentResult.clientSecret
      );
      if (!initialized) return;

      // Present payment sheet
      const { error } = await presentPaymentSheet();

      if (error) {
        Alert.alert("Error", error.message);
        console.log("Payment error:", error);
        console.log("Payment error:", error);
        return;
      }

      // Confirm donation on success
      await confirmDonation(intentResult.paymentIntentId);

      // Reset and close
      setSelectedAmount(null);
      setCustomAmount("");
      onClose();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Payment failed");
      console.log("Payment error:", error);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (!visible) {
      setSelectedAmount(null);
      setCustomAmount("");
      setProcessing(false);
    }
  }, [visible]);

  const donationAmount = getDonationAmount();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <StripeProvider
        publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
        merchantIdentifier="merchant.identifier"
      >
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#E0E0E0",
            }}
          >
            <Text style={{ fontSize: 22, fontFamily: "CrimsonText_700Bold" }}>
              Support {campaign.title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1, padding: 16 }}>
            {/* Progress */}
            <View
              style={{
                backgroundColor: "#f8f9fa",
                padding: 16,
                borderRadius: 12,
                marginBottom: 18,
                borderColor: "#2E7D32",
                borderWidth: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  marginBottom: 8,
                  fontFamily: "CrimsonText_600SemiBold",
                }}
              >
                Campaign Progress
              </Text>
              <View
                style={{
                  height: 6,
                  backgroundColor: "#E0E0E0",
                  borderRadius: 3,
                  marginBottom: 8,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${(campaign.amountRaised / campaign.goal_amount) * 100}%`,
                    backgroundColor: "#2E7D32",
                    borderRadius: 3,
                  }}
                />
              </View>
              <Text
                style={{
                  color: "#757575",
                  fontSize: 16,
                  fontFamily: "CrimsonText_600SemiBold",
                }}
              >
                ${campaign.amountRaised} raised of ${campaign.goal_amount}
              </Text>
            </View>

            {/* Preset Amounts */}
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 10,
                fontFamily: "CrimsonText_600SemiBold",
              }}
            >
              Select Amount
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {PRESET_AMOUNTS.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  onPress={() => handleAmountSelect(amount)}
                  style={{
                    flex: 1,
                    minWidth: "30%",
                    paddingVertical: 12,
                    backgroundColor:
                      selectedAmount === amount ? "#2E7D32" : "#f5f5f5",
                    borderRadius: 12,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor:
                      selectedAmount === amount ? "#2E7D32" : "#2E7D32",
                  }}
                >
                  <Text
                    style={{
                      color: selectedAmount === amount ? "#fff" : "#212121",
                      fontWeight: "600",
                      fontSize: 16,
                      fontFamily: "CrimsonText_600SemiBold",
                    }}
                  >
                    ${amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Amount */}
            <View style={{ marginBottom: 32 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  marginBottom: 8,
                  fontFamily: "CrimsonText_600SemiBold",
                }}
              >
                Custom Amount
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: customAmount ? "#2E7D32" : "#2E7D32",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                }}
              >
                <DollarSign size={20} color="#757575" />
                <TextInput
                  placeholder="Enter amount"
                  value={customAmount}
                  onChangeText={handleCustomAmount}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    marginLeft: 12,
                    fontSize: 16,
                    color: "#212121",
                  }}
                  placeholderTextColor="#9E9E9E"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Donation Summary */}
            {donationAmount > 0 && (
              <View
                style={{
                  backgroundColor: "#f0f9ff",
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#2E7D32",
                  marginBottom: 24,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#2E7D32",
                    marginBottom: 4,
                  }}
                >
                  Donation Summary
                </Text>
                <Text style={{ color: "#666" }}>
                  You&apos;re about to donate{" "}
                  <Text style={{ fontWeight: "700" }}>${donationAmount}</Text>{" "}
                  to &quot;{campaign.title}&quot;
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View
            style={{
              padding: 16,
              borderTopWidth: 1,
              borderTopColor: "#E0E0E0",
              backgroundColor: "#fff",
            }}
          >
            <TouchableOpacity
              onPress={handleDonate}
              disabled={donationAmount <= 0 || loading || processing}
              style={{
                backgroundColor: donationAmount <= 0 ? "#E0E0E0" : "#2E7D32",
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Heart size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                {processing ? "Processing..." : `Donate $${donationAmount}`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </StripeProvider>
    </Modal>
  );
};
