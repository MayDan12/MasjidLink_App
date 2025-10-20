// import { useAuth } from "@/app/context/AuthContext";
// import MosqueIcon from "@/components/icons/MosqueIcon";
// import {
//   Masjid,
//   MasjidFollower,
//   masjidService,
// } from "@/services/masjidServices";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import {
//   CalendarClock,
//   ChevronRight,
//   Edit,
//   Heart,
//   MapPin,
//   Save,
// } from "lucide-react-native";
// import { useEffect, useState } from "react";
// import {
//   FlatList,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import MultiSelect from "react-native-multiple-select";
// import RNPickerSelect from "react-native-picker-select";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function MasjidManagementScreen() {
//   const router = useRouter();
//   const { user } = useAuth();
//   const [masjid, setMasjid] = useState<Masjid | null>(null);
//   const [followers, setFollowers] = useState<MasjidFollower[]>([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedData, setEditedData] = useState<Partial<Masjid>>({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

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

//   const handleSaveChanges = async () => {
//     if (
//       !masjid ||
//       !editedData.name ||
//       !editedData.address ||
//       !editedData.city ||
//       !editedData.country
//     ) {
//       setError(
//         "Please fill in all required fields (Name, Address, City, Country)."
//       );
//       return;
//     }

//     try {
//       setError(null);
//       const updatedMasjid = await masjidService.updateMasjid(masjid.id, {
//         name: editedData.name,
//         address: editedData.address,
//         city: editedData.city,
//         state: editedData.state,
//         zip_code: editedData.zip_code,
//         country: editedData.country,
//         description: editedData.description,
//         established_year: editedData.established_year,
//         capacity: editedData.capacity,
//         denomination: editedData.denomination,
//         facility_types: editedData.facility_types,
//       });

//       setMasjid(updatedMasjid);
//       setIsEditing(false);
//       setError("Masjid details updated successfully!");
//     } catch (err) {
//       console.error("Error updating masjid:", err);
//       setError("Failed to update masjid. Please try again.");
//     }
//   };

//   const FollowerItem = ({ item }: { item: MasjidFollower }) => (
//     <TouchableOpacity style={styles.followerItem}>
//       <View style={styles.avatarPlaceholder}>
//         {item.user_avatar ? (
//           <Text style={styles.avatarText}>Avatar</Text>
//         ) : (
//           <Text style={styles.avatarText}>{item.user_name.charAt(0)}</Text>
//         )}
//       </View>
//       <Text style={styles.followerName}>{item.user_name}</Text>
//       <ChevronRight size={20} color="#059669" />
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.loadingContainer}>
//           <Text style={styles.loadingText}>Loading Masjid Details...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (!masjid) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.loadingContainer}>
//           <Text style={styles.errorText}>
//             No masjid found. Please create one first.
//           </Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {error && (
//           <View style={styles.errorContainer}>
//             <Text style={styles.errorText}>{error}</Text>
//           </View>
//         )}

//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Manage Your Masjid</Text>
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
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Masjid Details</Text>
//           <View style={styles.detailItem}>
//             <MosqueIcon size={20} color="#059669" />
//             <View style={styles.detailContent}>
//               <Text style={styles.detailLabel}>Name *</Text>
//               {isEditing ? (
//                 <TextInput
//                   style={styles.input}
//                   value={editedData.name}
//                   onChangeText={(text) =>
//                     setEditedData({ ...editedData, name: text })
//                   }
//                 />
//               ) : (
//                 <Text style={styles.detailText}>{masjid.name}</Text>
//               )}
//             </View>
//           </View>
//           <View style={styles.detailItem}>
//             <MapPin size={20} color="#059669" />
//             <View style={styles.detailContent}>
//               <Text style={styles.detailLabel}>Address *</Text>
//               {isEditing ? (
//                 <TextInput
//                   style={styles.input}
//                   value={editedData.address}
//                   onChangeText={(text) =>
//                     setEditedData({ ...editedData, address: text })
//                   }
//                 />
//               ) : (
//                 <Text style={styles.detailText}>{masjid.address}</Text>
//               )}
//             </View>
//           </View>
//           <View style={styles.detailRow}>
//             <View style={[styles.detailItem, styles.detailHalf]}>
//               <Text style={styles.detailLabel}>City *</Text>
//               {isEditing ? (
//                 <TextInput
//                   style={styles.input}
//                   value={editedData.city}
//                   onChangeText={(text) =>
//                     setEditedData({ ...editedData, city: text })
//                   }
//                 />
//               ) : (
//                 <Text style={styles.detailText}>{masjid.city}</Text>
//               )}
//             </View>
//             <View style={[styles.detailItem, styles.detailHalf]}>
//               <Text style={styles.detailLabel}>State</Text>
//               {isEditing ? (
//                 <TextInput
//                   style={styles.input}
//                   value={editedData.state}
//                   onChangeText={(text) =>
//                     setEditedData({ ...editedData, state: text })
//                   }
//                 />
//               ) : (
//                 <Text style={styles.detailText}>{masjid.state || "N/A"}</Text>
//               )}
//             </View>
//           </View>
//           <View style={styles.detailRow}>
//             <View style={[styles.detailItem, styles.detailHalf]}>
//               <Text style={styles.detailLabel}>Zip Code</Text>
//               {isEditing ? (
//                 <TextInput
//                   style={styles.input}
//                   value={editedData.zip_code}
//                   onChangeText={(text) =>
//                     setEditedData({ ...editedData, zip_code: text })
//                   }
//                   keyboardType="numeric"
//                 />
//               ) : (
//                 <Text style={styles.detailText}>
//                   {masjid.zip_code || "N/A"}
//                 </Text>
//               )}
//             </View>
//             <View style={[styles.detailItem, styles.detailHalf]}>
//               <Text style={styles.detailLabel}>Country *</Text>
//               {isEditing ? (
//                 <TextInput
//                   style={styles.input}
//                   value={editedData.country}
//                   onChangeText={(text) =>
//                     setEditedData({ ...editedData, country: text })
//                   }
//                 />
//               ) : (
//                 <Text style={styles.detailText}>{masjid.country}</Text>
//               )}
//             </View>
//           </View>
//           <View style={styles.detailItem}>
//             <Text style={styles.detailLabel}>Description</Text>
//             {isEditing ? (
//               <TextInput
//                 style={[styles.input, styles.textArea]}
//                 value={editedData.description}
//                 onChangeText={(text) =>
//                   setEditedData({ ...editedData, description: text })
//                 }
//                 multiline
//               />
//             ) : (
//               <Text style={styles.detailText}>
//                 {masjid.description || "N/A"}
//               </Text>
//             )}
//           </View>
//           <View style={styles.detailRow}>
//             <View style={[styles.detailItem, styles.detailHalf]}>
//               <Text style={styles.detailLabel}>Established Year</Text>
//               {isEditing ? (
//                 <TextInput
//                   style={styles.input}
//                   value={editedData.established_year}
//                   onChangeText={(text) =>
//                     setEditedData({ ...editedData, established_year: text })
//                   }
//                   keyboardType="numeric"
//                 />
//               ) : (
//                 <Text style={styles.detailText}>
//                   {masjid.established_year || "N/A"}
//                 </Text>
//               )}
//             </View>
//             <View style={[styles.detailItem, styles.detailHalf]}>
//               <Text style={styles.detailLabel}>Capacity</Text>
//               {isEditing ? (
//                 <TextInput
//                   style={styles.input}
//                   value={editedData.capacity}
//                   onChangeText={(text) =>
//                     setEditedData({ ...editedData, capacity: text })
//                   }
//                   keyboardType="numeric"
//                 />
//               ) : (
//                 <Text style={styles.detailText}>
//                   {masjid.capacity || "N/A"}
//                 </Text>
//               )}
//             </View>
//           </View>
//           <View style={styles.detailItem}>
//             <Text style={styles.detailLabel}>Denomination</Text>
//             {isEditing ? (
//               <RNPickerSelect
//                 onValueChange={(value) =>
//                   setEditedData({ ...editedData, denomination: value })
//                 }
//                 items={[
//                   { label: "Sunni", value: "Sunni" },
//                   { label: "Shia", value: "Shia" },
//                   { label: "Other", value: "Other" },
//                 ]}
//                 style={pickerSelectStyles}
//                 value={editedData.denomination}
//                 placeholder={{ label: "Select denomination", value: null }}
//               />
//             ) : (
//               <Text style={styles.detailText}>
//                 {masjid.denomination || "N/A"}
//               </Text>
//             )}
//           </View>
//           <View style={styles.detailItem}>
//             <Text style={styles.detailLabel}>Facility Types</Text>
//             {isEditing ? (
//               <MultiSelect
//                 items={facilityOptions}
//                 uniqueKey="id"
//                 onSelectedItemsChange={(selectedItems) =>
//                   setEditedData({
//                     ...editedData,
//                     facility_types: selectedItems,
//                   })
//                 }
//                 selectedItems={editedData.facility_types || []}
//                 selectText="Select facilities"
//                 searchInputPlaceholderText="Search Facilities..."
//                 tagRemoveIconColor="#059669"
//                 tagBorderColor="#059669"
//                 tagTextColor="#0D1B2A"
//                 selectedItemTextColor="#059669"
//                 itemTextColor="#0D1B2A"
//                 displayKey="name"
//                 styleMainWrapper={styles.multiSelect}
//                 styleDropdownMenuSubsection={styles.input}
//                 styleTextDropdown={styles.selectText}
//               />
//             ) : (
//               <Text style={styles.detailText}>
//                 {masjid.facility_types && masjid.facility_types.length > 0
//                   ? masjid.facility_types.join(", ")
//                   : "N/A"}
//               </Text>
//             )}
//           </View>
//           {isEditing && (
//             <View style={styles.buttonRow}>
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => {
//                   setIsEditing(false);
//                   setEditedData(masjid);
//                 }}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.saveButton}
//                 onPress={handleSaveChanges}
//               >
//                 <LinearGradient
//                   colors={["#059669", "#10b981"]}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={styles.saveButtonGradient}
//                 >
//                   <Save size={20} color="#F5F5DC" />
//                   <Text style={styles.saveButtonText}>Save Changes</Text>
//                 </LinearGradient>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>
//               Followers ({followers.length})
//             </Text>
//             <TouchableOpacity onPress={() => router.push("/imam/followers")}>
//               <Text style={styles.viewAllText}>View All</Text>
//             </TouchableOpacity>
//           </View>
//           <FlatList
//             data={followers.slice(0, 5)}
//             renderItem={FollowerItem}
//             keyExtractor={(item) => item.id}
//             scrollEnabled={false}
//           />
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Management Options</Text>
//           <TouchableOpacity
//             style={styles.optionItem}
//             onPress={() => router.push("/events")}
//           >
//             <View style={styles.optionRow}>
//               <CalendarClock size={20} color="#059669" />
//               <Text style={styles.optionText}>Manage Events</Text>
//             </View>
//             <ChevronRight size={20} color="#059669" />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.optionItem}
//             onPress={() => router.push("/imam/donations")}
//           >
//             <View style={styles.optionRow}>
//               <Heart size={20} color="#059669" />
//               <Text style={styles.optionText}>View Donations</Text>
//             </View>
//             <ChevronRight size={20} color="#059669" />
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F5F5DC",
//   },
//   optionItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f1f5f9",
//     justifyContent: "space-between",
//   },
//   optionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },
//   optionText: {
//     color: "#0D1B2A",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 16,
//     paddingBottom: 32,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 24,
//   },
//   headerTitle: {
//     color: "#0D1B2A",
//     fontSize: 24,
//     fontWeight: "700",
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
//   },
//   section: {
//     backgroundColor: "white",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   sectionTitle: {
//     color: "#0D1B2A",
//     fontSize: 20,
//     fontWeight: "700",
//     marginBottom: 12,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   viewAllText: {
//     color: "#059669",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   detailItem: {
//     marginBottom: 16,
//   },
//   detailRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   detailHalf: {
//     flex: 1,
//     marginRight: 8,
//   },
//   detailContent: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   detailLabel: {
//     color: "#64748b",
//     fontSize: 14,
//     fontWeight: "500",
//     marginBottom: 4,
//   },
//   detailText: {
//     color: "#0D1B2A",
//     fontSize: 16,
//     fontWeight: "400",
//   },
//   input: {
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 12,
//     fontSize: 16,
//     color: "#0D1B2A",
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: "top",
//   },
//   multiSelect: {
//     backgroundColor: "white",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   selectText: {
//     fontSize: 16,
//     color: "#0D1B2A",
//     padding: 12,
//   },
//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 16,
//   },
//   cancelButton: {
//     flex: 1,
//     backgroundColor: "#f8fafc",
//     borderRadius: 12,
//     padding: 16,
//     alignItems: "center",
//     marginRight: 8,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   cancelButtonText: {
//     color: "#0D1B2A",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   saveButton: {
//     flex: 1,
//     borderRadius: 12,
//     overflow: "hidden",
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
//     fontWeight: "600",
//     marginLeft: 8,
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
//   avatarText: {
//     color: "#F5F5DC",
//     fontSize: 18,
//     fontWeight: "700",
//   },
//   followerName: {
//     flex: 1,
//     color: "#0D1B2A",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     color: "#0D1B2A",
//     fontSize: 18,
//     fontWeight: "500",
//   },
//   errorContainer: {
//     backgroundColor: "#fef2f2",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: "#fecaca",
//   },
//   errorText: {
//     color: "#dc2626",
//     fontSize: 14,
//     fontWeight: "500",
//   },
// });

// const pickerSelectStyles = StyleSheet.create({
//   inputIOS: {
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 12,
//     fontSize: 16,
//     color: "#0D1B2A",
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   inputAndroid: {
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 12,
//     fontSize: 16,
//     color: "#0D1B2A",
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
// });

// import React from "react";
// import { Image, Text, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function MasjidScreen() {
//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5DC" }}>
//       {/* Header */}
//       <View style={{ padding: 16 }}>
//         <Text
//           style={{
//             fontSize: 24,
//             color: "#0D1B2A",
//             fontFamily: "CrimsonText_700Bold",
//           }}
//         >
//           Masjid
//         </Text>
//         <Text
//           style={{
//             fontSize: 16,
//             color: "#0D1B2A",
//             fontFamily: "CrimsonText_400Regular",
//           }}
//         >
//           Your mosque management solution
//         </Text>
//       </View>
//       {/* Content */}
//       <View style={{ flex: 1, alignItems: "center" }}>
//         <View>
//           <Image
//             source={require("@/assets/images/masjid1.jpg")}
//             style={{ width: 200, height: 200, borderRadius: 100 }}
//             resizeMode="contain"
//           />
//           <View>
//             <Text>Masjid Al Noor</Text>
//             <Text>123 Main St, Springfield</Text>
//             <Text>Followers: 150</Text>
//           </View>
//         </View>
//         {/* Tabs for About, Events, Donations */}
//         <View style={{ flexDirection: "row", marginTop: 16 }}>
//           <Text style={{ marginRight: 16 }}>About</Text>
//           <Text style={{ marginRight: 16 }}>Events</Text>
//           <Text>Donations</Text>
//         </View>
//         {/* Placeholder for tab content */}
//         <View style={{ marginTop: 32, alignItems: "center" }}>
//           <Text>About Masjid Al Noor</Text>
//           <Text>
//             Established in 1990, Masjid Al Noor serves the Springfield community
//             with a capacity of 500 worshippers. Facilities include a prayer
//             hall, library, and community center.
//           </Text>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

import { useAuth } from "@/app/context/AuthContext";
import {
  Masjid,
  MasjidFollower,
  masjidService,
} from "@/services/masjidServices";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ChevronRight, Save } from "lucide-react-native";
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

// interface Masjid {
//   id: string;
//   name: string;
//   address: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   country: string;
//   description: string;
//   establishedYear: string;
//   capacity: string;
//   denomination: string;
//   facilityTypes: string[];
//   followers: string[];
// }

// interface Follower {
//   id: string;
//   name: string;
//   avatar?: string;
// }

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

  const facilityOptions = [
    { id: "prayer_hall", name: "Prayer Hall" },
    { id: "library", name: "Library" },
    { id: "community_center", name: "Community Center" },
    { id: "education_room", name: "Education Room" },
    { id: "parking", name: "Parking" },
  ];

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

        const followersData = await masjidService.getMasjidFollowers(
          masjidData.id
        );
        setFollowers(followersData);
      }
    } catch (err) {
      console.error("Error loading masjid data:", err);
      setError("Failed to load masjid data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   // TODO: Fetch masjid data from API using imam/masjid ID
  //   const fetchedMasjid: Masjid = {
  //     id: "masjid1",
  //     name: "Masjid Al Noor",
  //     address: "123 Main St",
  //     city: "Springfield",
  //     state: "IL",
  //     zipCode: "62701",
  //     country: "USA",
  //     description:
  //       "Established in 1990, Masjid Al Noor serves the Springfield community with a capacity of 500 worshippers. Facilities include a prayer hall, library, and community center.",
  //     establishedYear: "1990",
  //     capacity: "500",
  //     denomination: "Sunni",
  //     facilityTypes: ["prayer_hall", "library", "community_center"],
  //     followers: ["user1", "user2", "user3"],
  //   };
  //   setMasjid(fetchedMasjid);
  //   setEditedData(fetchedMasjid);

  //   const fetchedFollowers: Follower[] = [
  //     {
  //       id: "user1",
  //       name: "Ahmed Yusuf",
  //       avatar: "https://example.com/avatar1.jpg",
  //     },
  //     {
  //       id: "user2",
  //       name: "Fatima Ali",
  //       avatar: "https://example.com/avatar2.jpg",
  //     },
  //     {
  //       id: "user3",
  //       name: "Mohammed Khan",
  //       avatar: "https://example.com/avatar3.jpg",
  //     },
  //   ];
  //   setFollowers(fetchedFollowers);

  //   setLoading(false);
  // }, []);

  const handleSaveChanges = () => {
    if (
      !masjid ||
      !editedData.name ||
      !editedData.address ||
      !editedData.city ||
      !editedData.country
    ) {
      Alert.alert(
        "Error",
        "Please fill in all required fields (Name, Address, City, Country)."
      );
      return;
    }

    const updatedMasjid: Masjid = {
      ...masjid,
      ...editedData,
    };

    // TODO: Update masjid data via API
    console.log("Updated Masjid:", updatedMasjid);
    setMasjid(updatedMasjid);
    setIsEditing(false);
    Alert.alert("Success", "Masjid details updated successfully!");
  };

  // const FollowerItem = ({ item }: { item: Follower }) => (
  //   <TouchableOpacity style={styles.followerItem}>
  //     <View style={styles.avatarPlaceholder}>
  //       {item.avatar ? (
  //         <Image source={{ uri: item.avatar }} style={styles.avatar} />
  //       ) : (
  //         <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
  //       )}
  //     </View>
  //     <Text style={styles.followerName}>{item.name}</Text>
  //     <ChevronRight size={20} color="#059669" />
  //   </TouchableOpacity>
  // );

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
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        {/* <View style={styles.header}>
          <Text style={styles.headerTitle}>Masjid</Text>
          <Text style={styles.headerSubtitle}>
            Your mosque management solution
          </Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <Save size={24} color="#059669" />
            ) : (
              <Edit size={24} color="#059669" />
            )}
          </TouchableOpacity>
        </View> */}

        {/* Content */}
        <View style={styles.content}>
          <Image
            source={require("@/assets/images/masjid1.jpg")} // Replace with your image path
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>{masjid.name}</Text>

            <Text style={styles.infoText}>{masjid.address}</Text>

            <Text style={styles.infoText}>
              {/* Followers: {masjid.followers.length} */}
            </Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "About" && styles.activeTab]}
              onPress={() => setActiveTab("About")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "About" && styles.activeTabText,
                ]}
              >
                About
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "Events" && styles.activeTab]}
              onPress={() => setActiveTab("Events")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "Events" && styles.activeTabText,
                ]}
              >
                Events
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "Donations" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("Donations")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "Donations" && styles.activeTabText,
                ]}
              >
                Donations
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === "About" && (
              <View style={styles.tabSection}>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={editedData.description}
                    onChangeText={(text) =>
                      setEditedData({ ...editedData, description: text })
                    }
                    multiline
                  />
                ) : (
                  <Text style={styles.tabTextContent}>
                    {masjid.description}
                  </Text>
                )}
              </View>
            )}
            {activeTab === "Events" && (
              <View style={styles.tabSection}>
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => router.push("/imam/events")}
                >
                  <Text style={styles.optionText}>Manage Events</Text>
                  <ChevronRight size={20} color="#059669" />
                </TouchableOpacity>
              </View>
            )}
            {activeTab === "Donations" && (
              <View style={styles.tabSection}>
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => router.push("/imam/donations")}
                >
                  <Text style={styles.optionText}>View Donations</Text>
                  <ChevronRight size={20} color="#059669" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Followers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Followers ({followers.length})
            </Text>
            {/* <FlatList
              data={followers.slice(0, 3)}
              renderItem={FollowerItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            /> */}
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => router.push("/imam/followers")}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isEditing && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveChanges}
          >
            <LinearGradient
              colors={["#059669", "#10b981"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButtonGradient}
            >
              <Save size={20} color="#F5F5DC" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    padding: 16,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    color: "#0D1B2A",
    fontFamily: "Inter_700Bold",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#64748b",
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
  editButton: {
    padding: 8,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: "absolute",
    right: 16,
    top: 16,
  },
  content: {
    alignItems: "center",
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 16,
  },
  infoContainer: {
    alignItems: "center",
  },
  infoTitle: {
    fontSize: 20,
    color: "#0D1B2A",
    fontFamily: "Inter_600SemiBold",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: "#0D1B2A",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#0D1B2A",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    textAlign: "center",
    width: 200,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    width: "100%",
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: "#f8fafc",
  },
  activeTab: {
    backgroundColor: "#059669",
  },
  tabText: {
    fontSize: 16,
    color: "#0D1B2A",
    fontFamily: "Inter_600SemiBold",
  },
  activeTabText: {
    color: "#F5F5DC",
  },
  tabContent: {
    width: "100%",
    alignItems: "center",
  },
  tabSection: {
    alignItems: "center",
    padding: 16,
  },
  tabTextContent: {
    fontSize: 16,
    color: "#0D1B2A",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  section: {
    width: "100%",
    marginTop: 16,
  },
  sectionTitle: {
    color: "#0D1B2A",
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
  },
  followerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#059669",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarText: {
    color: "#F5F5DC",
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  followerName: {
    flex: 1,
    color: "#0D1B2A",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  viewAllButton: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  viewAllText: {
    color: "#059669",
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  optionText: {
    flex: 1,
    color: "#0D1B2A",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginLeft: 12,
  },
  saveButton: {
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
    alignSelf: "center",
  },
  saveButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  saveButtonText: {
    color: "#F5F5DC",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginLeft: 8,
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
