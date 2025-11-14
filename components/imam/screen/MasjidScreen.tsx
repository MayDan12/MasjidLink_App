// import { useAuth } from "@/app/context/AuthContext";
// import {
//   Masjid,
//   MasjidFollower,
//   masjidService,
// } from "@/services/masjidServices";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import { ChevronRight, Save } from "lucide-react-native";
// import { useEffect, useState } from "react";
// import {
//   Alert,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";



// export default function MasjidManagementScreen() {
//   const router = useRouter();
//   const [masjid, setMasjid] = useState<Masjid | null>(null);
//   const [followers, setFollowers] = useState<MasjidFollower[]>([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedData, setEditedData] = useState<Partial<Masjid>>({});
//   const [activeTab, setActiveTab] = useState("About");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { user } = useAuth();

//   const facilityOptions = [
//     { id: "prayer_hall", name: "Prayer Hall" },
//     { id: "library", name: "Library" },
//     { id: "community_center", name: "Community Center" },
//     { id: "education_room", name: "Education Room" },
//     { id: "parking", name: "Parking" },
//   ];

//   useEffect(() => {
//     loadMasjidData();
//   }, []);

//   const loadMasjidData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       if (!user) {
//         setError("User not authenticated");
//         setLoading(false);
//         return;
//       }

//       const masjidData = await masjidService.getMasjidByImamId(user?.uid);

//       if (masjidData) {
//         setMasjid(masjidData);
//         setEditedData(masjidData);

//         const followersData = await masjidService.getMasjidFollowers(
//           masjidData.id
//         );
//         setFollowers(followersData);
//       }
//     } catch (err) {
//       console.error("Error loading masjid data:", err);
//       setError("Failed to load masjid data. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleSaveChanges = () => {
//     if (
//       !masjid ||
//       !editedData.name ||
//       !editedData.address ||
//       !editedData.city ||
//       !editedData.country
//     ) {
//       Alert.alert(
//         "Error",
//         "Please fill in all required fields (Name, Address, City, Country)."
//       );
//       return;
//     }

//     const updatedMasjid: Masjid = {
//       ...masjid,
//       ...editedData,
//     };

//     // TODO: Update masjid data via API
//     console.log("Updated Masjid:", updatedMasjid);
//     setMasjid(updatedMasjid);
//     setIsEditing(false);
//     Alert.alert("Success", "Masjid details updated successfully!");
//   };

//   // const FollowerItem = ({ item }: { item: Follower }) => (
//   //   <TouchableOpacity style={styles.followerItem}>
//   //     <View style={styles.avatarPlaceholder}>
//   //       {item.avatar ? (
//   //         <Image source={{ uri: item.avatar }} style={styles.avatar} />
//   //       ) : (
//   //         <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
//   //       )}
//   //     </View>
//   //     <Text style={styles.followerName}>{item.name}</Text>
//   //     <ChevronRight size={20} color="#059669" />
//   //   </TouchableOpacity>
//   // );

//   if (loading || !masjid) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.loadingContainer}>
//           <Text style={styles.loadingText}>Loading Masjid Details...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* Header */}
//         {/* <View style={styles.header}>
//           <Text style={styles.headerTitle}>Masjid</Text>
//           <Text style={styles.headerSubtitle}>
//             Your mosque management solution
//           </Text>
//           <TouchableOpacity
//             style={styles.editButton}
//             onPress={() => setIsEditing(!isEditing)}
//           >
//             {isEditing ? (
//               <Save size={24} color="#059669" />
//             ) : (
//               <Edit size={24} color="#059669" />
//             )}
//           </TouchableOpacity>
//         </View> */}

//         {/* Content */}
//         <View style={styles.content}>
//           <Image
//             source={require("@/assets/images/masjid1.jpg")} // Replace with your image path
//             style={styles.image}
//             resizeMode="cover"
//           />
//           <View style={styles.infoContainer}>
//             <Text style={styles.infoTitle}>{masjid.name}</Text>

//             <Text style={styles.infoText}>{masjid.address}</Text>

//             <Text style={styles.infoText}>
//               {/* Followers: {masjid.followers.length} */}
//             </Text>
//           </View>

//           {/* Tabs */}
//           <View style={styles.tabContainer}>
//             <TouchableOpacity
//               style={[styles.tab, activeTab === "About" && styles.activeTab]}
//               onPress={() => setActiveTab("About")}
//             >
//               <Text
//                 style={[
//                   styles.tabText,
//                   activeTab === "About" && styles.activeTabText,
//                 ]}
//               >
//                 About
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.tab, activeTab === "Events" && styles.activeTab]}
//               onPress={() => setActiveTab("Events")}
//             >
//               <Text
//                 style={[
//                   styles.tabText,
//                   activeTab === "Events" && styles.activeTabText,
//                 ]}
//               >
//                 Events
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[
//                 styles.tab,
//                 activeTab === "Donations" && styles.activeTab,
//               ]}
//               onPress={() => setActiveTab("Donations")}
//             >
//               <Text
//                 style={[
//                   styles.tabText,
//                   activeTab === "Donations" && styles.activeTabText,
//                 ]}
//               >
//                 Donations
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Tab Content */}
//           <View style={styles.tabContent}>
//             {activeTab === "About" && (
//               <View style={styles.tabSection}>
//                 {isEditing ? (
//                   <TextInput
//                     style={[styles.input, styles.textArea]}
//                     value={editedData.description}
//                     onChangeText={(text) =>
//                       setEditedData({ ...editedData, description: text })
//                     }
//                     multiline
//                   />
//                 ) : (
//                   <Text style={styles.tabTextContent}>
//                     {masjid.description}
//                   </Text>
//                 )}
//               </View>
//             )}
//             {activeTab === "Events" && (
//               <View style={styles.tabSection}>
//                 <TouchableOpacity
//                   style={styles.optionItem}
//                   onPress={() => router.push("/imam/events")}
//                 >
//                   <Text style={styles.optionText}>Manage Events</Text>
//                   <ChevronRight size={20} color="#059669" />
//                 </TouchableOpacity>
//               </View>
//             )}
//             {activeTab === "Donations" && (
//               <View style={styles.tabSection}>
//                 <TouchableOpacity
//                   style={styles.optionItem}
//                   onPress={() => router.push("/imam/donations")}
//                 >
//                   <Text style={styles.optionText}>View Donations</Text>
//                   <ChevronRight size={20} color="#059669" />
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>

//           {/* Followers */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>
//               Followers ({followers.length})
//             </Text>
//             {/* <FlatList
//               data={followers.slice(0, 3)}
//               renderItem={FollowerItem}
//               keyExtractor={(item) => item.id}
//               scrollEnabled={false}
//             /> */}
//             <TouchableOpacity
//               style={styles.viewAllButton}
//               onPress={() => router.push("/imam/followers")}
//             >
//               <Text style={styles.viewAllText}>View All</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {isEditing && (
//           <TouchableOpacity
//             style={styles.saveButton}
//             onPress={handleSaveChanges}
//           >
//             <LinearGradient
//               colors={["#059669", "#10b981"]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.saveButtonGradient}
//             >
//               <Save size={20} color="#F5F5DC" />
//               <Text style={styles.saveButtonText}>Save Changes</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F5F5DC",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 16,
//     paddingBottom: 32,
//   },
//   header: {
//     padding: 16,
//     marginBottom: 24,
//   },
//   headerTitle: {
//     fontSize: 24,
//     color: "#0D1B2A",
//     fontFamily: "Inter_700Bold",
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     color: "#64748b",
//     fontFamily: "Inter_400Regular",
//     marginTop: 4,
//   },
//   editButton: {
//     padding: 8,
//     backgroundColor: "white",
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//     position: "absolute",
//     right: 16,
//     top: 16,
//   },
//   content: {
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   image: {
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     marginBottom: 16,
//   },
//   infoContainer: {
//     alignItems: "center",
//   },
//   infoTitle: {
//     fontSize: 20,
//     color: "#0D1B2A",
//     fontFamily: "Inter_600SemiBold",
//     marginBottom: 8,
//   },
//   infoText: {
//     fontSize: 16,
//     color: "#0D1B2A",
//     fontFamily: "Inter_400Regular",
//     textAlign: "center",
//   },
//   input: {
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 12,
//     fontSize: 16,
//     fontFamily: "Inter_400Regular",
//     color: "#0D1B2A",
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     textAlign: "center",
//     width: 200,
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: "top",
//     width: "100%",
//     marginTop: 8,
//   },
//   tabContainer: {
//     flexDirection: "row",
//     marginBottom: 10,
//   },
//   tab: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 12,
//     marginRight: 8,
//     backgroundColor: "#f8fafc",
//   },
//   activeTab: {
//     backgroundColor: "#059669",
//   },
//   tabText: {
//     fontSize: 16,
//     color: "#0D1B2A",
//     fontFamily: "Inter_600SemiBold",
//   },
//   activeTabText: {
//     color: "#F5F5DC",
//   },
//   tabContent: {
//     width: "100%",
//     alignItems: "center",
//   },
//   tabSection: {
//     alignItems: "center",
//     padding: 16,
//   },
//   tabTextContent: {
//     fontSize: 16,
//     color: "#0D1B2A",
//     fontFamily: "Inter_400Regular",
//     textAlign: "center",
//   },
//   section: {
//     width: "100%",
//     marginTop: 16,
//   },
//   sectionTitle: {
//     color: "#0D1B2A",
//     fontSize: 20,
//     fontFamily: "Inter_700Bold",
//     marginBottom: 12,
//   },
//   followerItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f1f5f9",
//   },
//   avatarPlaceholder: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#059669",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
//   avatarText: {
//     color: "#F5F5DC",
//     fontSize: 18,
//     fontFamily: "Inter_700Bold",
//   },
//   followerName: {
//     flex: 1,
//     color: "#0D1B2A",
//     fontSize: 16,
//     fontFamily: "Inter_600SemiBold",
//   },
//   viewAllButton: {
//     alignItems: "flex-end",
//     marginTop: 8,
//   },
//   viewAllText: {
//     color: "#059669",
//     fontSize: 14,
//     fontFamily: "Inter_600SemiBold",
//   },
//   optionItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//   },
//   optionText: {
//     flex: 1,
//     color: "#0D1B2A",
//     fontSize: 16,
//     fontFamily: "Inter_600SemiBold",
//     marginLeft: 12,
//   },
//   saveButton: {
//     marginTop: 16,
//     borderRadius: 12,
//     overflow: "hidden",
//     alignSelf: "center",
//   },
//   saveButtonGradient: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 16,
//   },
//   saveButtonText: {
//     color: "#F5F5DC",
//     fontSize: 16,
//     fontFamily: "Inter_600SemiBold",
//     marginLeft: 8,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     color: "#0D1B2A",
//     fontSize: 18,
//     fontFamily: "Inter_500Medium",
//   },
// });
import { useAuth } from "@/app/context/AuthContext";
import {
  Masjid,
  MasjidFollower,
  masjidService,
} from "@/services/masjidServices";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Calendar, ChevronRight, Edit3, Heart, Save, Users } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MasjidManagementScreen() {
  const router = useRouter();
  const [masjid, setMasjid] = useState<Masjid | null>(null);
  const [followers, setFollowers] = useState<MasjidFollower[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<Masjid>>({});
  const [activeTab, setActiveTab] = useState("About");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadMasjidData();
  }, []);

  const loadMasjidData = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const masjidData = await masjidService.getMasjidByImamId(user?.uid);
      if (masjidData) {
        setMasjid(masjidData);
        setEditedData(masjidData);
        const followersData = await masjidService.getMasjidFollowers(masjidData.id);
        setFollowers(followersData);
      }
    } catch (err) {
      console.error("Error loading masjid data:", err);
      setError("Failed to load masjid data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = () => {
    if (!masjid || !editedData.name || !editedData.address || !editedData.city || !editedData.country) {
      Alert.alert("Error", "Please fill in all required fields (Name, Address, City, Country).");
      return;
    }

    const updatedMasjid: Masjid = { ...masjid, ...editedData };
    console.log("Updated Masjid:", updatedMasjid);
    setMasjid(updatedMasjid);
    setIsEditing(false);
    Alert.alert("Success", "Masjid details updated successfully!");
  };

  if (loading || !masjid) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Masjid Details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header with Edit Button */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Masjid Management</Text>
            <Text style={styles.headerSubtitle}>Manage your mosque profile and activities</Text>
          </View>
          <TouchableOpacity
            style={[styles.editButton, isEditing && styles.editButtonActive]}
            onPress={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <Save size={20} color="#059669" />
            ) : (
              <Edit3 size={20} color="#059669" />
            )}
          </TouchableOpacity>
        </View>

        {/* Masjid Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={["#059669", "#10b981"]}
            style={styles.avatarGradient}
          >
            <Image
              source={require("@/assets/images/masjid1.jpg")}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </LinearGradient>
          
          <View style={styles.profileInfo}>
            {isEditing ? (
              <TextInput
                style={styles.nameInput}
                value={editedData.name}
                onChangeText={(text) => setEditedData({ ...editedData, name: text })}
                placeholder="Masjid Name"
              />
            ) : (
              <Text style={styles.masjidName}>{masjid.name}</Text>
            )}
            
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>{masjid.address}</Text>
              <Text style={styles.locationText}>{masjid.city}, {masjid.country}</Text>
            </View>

            {/* Stats Row */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Users size={16} color="#059669" />
                <Text style={styles.statNumber}>{followers.length}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Calendar size={16} color="#059669" />
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Events</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Heart size={16} color="#059669" />
                <Text style={styles.statNumber}>24</Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabContainer}>
          {[
            { id: "About", label: "About" },
            { id: "Events", label: "Events" },
            { id: "Donations", label: "Donations" }
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.label}
              </Text>
              {activeTab === tab.id && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === "About" && (
            <View style={styles.tabSection}>
              <Text style={styles.sectionTitle}>About Masjid</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editedData.description}
                  onChangeText={(text) => setEditedData({ ...editedData, description: text })}
                  multiline
                  numberOfLines={4}
                  placeholder="Describe your masjid..."
                />
              ) : (
                <Text style={styles.descriptionText}>
                  {masjid.description || "No description provided. Tap edit to add one."}
                </Text>
              )}
            </View>
          )}

          {activeTab === "Events" && (
            <View style={styles.tabSection}>
              <Text style={styles.sectionTitle}>Event Management</Text>
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => router.push("/events")}
              >
                <View style={styles.optionContent}>
                  <Calendar size={24} color="#059669" />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Manage Events</Text>
                    <Text style={styles.optionSubtitle}>Create and manage prayer events</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
          )}

          {activeTab === "Donations" && (
            <View style={styles.tabSection}>
              <Text style={styles.sectionTitle}>Donation Management</Text>
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => router.push("/user/imam/donation")}
              >
                <View style={styles.optionContent}>
                  <Heart size={24} color="#059669" />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>View Donations</Text>
                    <Text style={styles.optionSubtitle}>Track donations and contributions</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Followers Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Followers ({followers.length})</Text>
            <TouchableOpacity onPress={() => router.push("/imam/followers")}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {followers.length > 0 ? (
            <View style={styles.followersPreview}>
              {/* Add follower avatars preview here */}
              <Text style={styles.followersHint}>
                {followers.length} people follow this masjid
              </Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Users size={32} color="#64748b" />
              <Text style={styles.emptyStateText}>No followers yet</Text>
              <Text style={styles.emptyStateSubtext}>Followers will appear here</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Save Button */}
      {isEditing && (
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <LinearGradient
              colors={["#059669", "#10b981"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButtonGradient}
            >
              <Save size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
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
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    color: "#0F172A",
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#64748B",
    fontFamily: "Inter_400Regular",
  },
  editButton: {
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  editButtonActive: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#059669",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    alignItems: "center",
  },
  avatarGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  profileInfo: {
    alignItems: "center",
    width: "100%",
  },
  masjidName: {
    fontSize: 24,
    color: "#0F172A",
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: 8,
  },
  nameInput: {
    fontSize: 24,
    color: "#0F172A",
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: 8,
    backgroundColor: "#F8FAFC",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    width: "100%",
  },
  locationInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  locationText: {
    fontSize: 16,
    color: "#64748B",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E2E8F0",
  },
  statNumber: {
    fontSize: 18,
    color: "#0F172A",
    fontFamily: "Inter_700Bold",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
    position: "relative",
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
  },
  tabText: {
    fontSize: 16,
    color: "#64748B",
    fontFamily: "Inter_600SemiBold",
  },
  activeTabText: {
    color: "#059669",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 4,
    width: 20,
    height: 3,
    backgroundColor: "#059669",
    borderRadius: 2,
  },
  tabContent: {
    marginBottom: 24,
  },
  tabSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#0F172A",
    fontFamily: "Inter_700Bold",
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: "#475569",
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 20,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionTextContainer: {
    marginLeft: 16,
  },
  optionTitle: {
    fontSize: 18,
    color: "#0F172A",
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: "#64748B",
    fontFamily: "Inter_400Regular",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllText: {
    color: "#059669",
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  followersPreview: {
    alignItems: "center",
    padding: 20,
  },
  followersHint: {
    color: "#64748B",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateText: {
    color: "#64748B",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginTop: 12,
  },
  emptyStateSubtext: {
    color: "#94A3B8",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
  saveButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  saveButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#0F172A",
    fontSize: 18,
    fontFamily: "Inter_500Medium",
  },
});