import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Check, ChevronLeft, DollarSign, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Donation {
  id: string;
  donorName: string;
  amount: number;
  date: string;
  status: "pending" | "completed";
  description?: string;
}

export default function DonationManagementScreen() {
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDonation, setNewDonation] = useState<Partial<Donation>>({
    donorName: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    status: "pending",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch donations from API using masjid ID
    const fetchedDonations: Donation[] = [
      {
        id: "don1",
        donorName: "Ahmed Yusuf",
        amount: 5000,
        date: "2025-10-15",
        status: "pending",
        description: "Annual zakat contribution",
      },
      {
        id: "don2",
        donorName: "Fatima Ali",
        amount: 2000,
        date: "2025-10-18",
        status: "completed",
        description: "Ramadan donation",
      },
      {
        id: "don3",
        donorName: "Mohammed Khan",
        amount: 3000,
        date: "2025-10-19",
        status: "pending",
        description: "Community support",
      },
    ];
    setDonations(fetchedDonations);
    setLoading(false);
  }, []);

  const handleAddDonation = () => {
    if (!newDonation.donorName || !newDonation.amount) {
      Alert.alert("Error", "Please fill in Donor Name and Amount.");
      return;
    }

    const donation: Donation = {
      id: Math.random().toString(36).substr(2, 9),
      donorName: newDonation.donorName,
      amount: newDonation.amount,
      date: newDonation.date || new Date().toISOString().split("T")[0],
      status: newDonation.status || "pending",
      description: newDonation.description || "",
    };

    // TODO: Save to API
    setDonations([...donations, donation]);
    setNewDonation({
      donorName: "",
      amount: 0,
      date: "",
      status: "pending",
      description: "",
    });
    setShowAddForm(false);
    Alert.alert("Success", "Donation added successfully!");
  };

  const handleMarkCompleted = (id: string) => {
    const updatedDonations = donations.map((donation) =>
      donation.id === id ? { ...donation, status: "completed" } : donation
    );
    setDonations(updatedDonations);
    // TODO: Update status via API
    Alert.alert("Success", "Donation marked as completed!");
  };

  const DonationItem = ({ item }: { item: Donation }) => (
    <View style={styles.donationItem}>
      <View style={styles.donationInfo}>
        <Text style={styles.donorName}>{item.donorName}</Text>
        <Text style={styles.donationDetails}>
          ${item.amount} - {item.date} ({item.status})
        </Text>
        {item.description && (
          <Text style={styles.donationDescription}>{item.description}</Text>
        )}
      </View>
      {item.status === "pending" && (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => handleMarkCompleted(item.id)}
        >
          <Check size={20} color="#F5F5DC" />
          <Text style={styles.completeButtonText}>Complete</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Donations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalAmount = donations.reduce(
    (sum, donation) => sum + donation.amount,
    0
  );

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/imam/masjid-management")}
          >
            <ChevronLeft size={24} color="#059669" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Donations</Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Plus size={24} color="#F5F5DC" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Manage donations for your masjid
        </Text>

        {/* Summary */}
        <View style={styles.summary}>
          <DollarSign size={24} color="#059669" />
          <Text style={styles.summaryText}>
            Total Collected: ${totalAmount.toLocaleString()}
          </Text>
        </View>

        {/* Donation List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Donations</Text>
          <FlatList
            data={donations}
            renderItem={DonationItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Add Donation Form */}
        {showAddForm && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Add New Donation</Text>
            <TextInput
              style={styles.input}
              value={newDonation.donorName}
              onChangeText={(text) =>
                setNewDonation({ ...newDonation, donorName: text })
              }
              placeholder="Donor Name"
              placeholderTextColor="#94a3b8"
            />
            <TextInput
              style={styles.input}
              value={newDonation.amount ? newDonation.amount.toString() : ""}
              onChangeText={(text) =>
                setNewDonation({
                  ...newDonation,
                  amount: parseFloat(text) || 0,
                })
              }
              placeholder="Amount ($)"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={newDonation.date}
              onChangeText={(text) =>
                setNewDonation({ ...newDonation, date: text })
              }
              placeholder="Date (YYYY-MM-DD)"
              placeholderTextColor="#94a3b8"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newDonation.description}
              onChangeText={(text) =>
                setNewDonation({ ...newDonation, description: text })
              }
              placeholder="Description (optional)"
              placeholderTextColor="#94a3b8"
              multiline
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddDonation}
            >
              <LinearGradient
                colors={["#059669", "#10b981"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.saveButtonGradient}
              >
                <Text style={styles.saveButtonText}>Add Donation</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowAddForm(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    color: "#0D1B2A",
    fontFamily: "Inter_700Bold",
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#64748b",
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
  addButton: {
    padding: 8,
    backgroundColor: "#059669",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryText: {
    fontSize: 18,
    color: "#0D1B2A",
    fontFamily: "Inter_600SemiBold",
    marginLeft: 8,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    color: "#0D1B2A",
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
  },
  donationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  donationInfo: {
    flex: 1,
  },
  donorName: {
    fontSize: 16,
    color: "#0D1B2A",
    fontFamily: "Inter_600SemiBold",
  },
  donationDetails: {
    fontSize: 14,
    color: "#64748b",
    fontFamily: "Inter_400Regular",
  },
  donationDescription: {
    fontSize: 12,
    color: "#94a3b8",
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#059669",
    padding: 8,
    borderRadius: 8,
  },
  completeButtonText: {
    color: "#F5F5DC",
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginLeft: 4,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 20,
    color: "#0D1B2A",
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#0D1B2A",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  saveButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  saveButtonText: {
    color: "#F5F5DC",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  cancelButton: {
    alignItems: "center",
    padding: 12,
    marginTop: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cancelButtonText: {
    color: "#0D1B2A",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#0D1B2A",
    fontSize: 18,
    fontFamily: "Inter_500Medium",
  },
});
