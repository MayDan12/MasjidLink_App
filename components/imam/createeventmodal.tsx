// import { Event } from "@/types/event";
// import { LinearGradient } from "expo-linear-gradient";
// import { CalendarClock, MapPin, Save, Users, X } from "lucide-react-native";
// import { useState } from "react";
// import {
//   Alert,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Switch,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import RNPickerSelect from "react-native-picker-select";

// interface CreateEventModalProps {
//   visible: boolean;
//   onClose: () => void;
//   onSubmit: (event: Partial<Event>) => void;
// }

// export const CreateEventModal: React.FC<CreateEventModalProps> = ({
//   visible,
//   onClose,
//   onSubmit,
// }) => {
//   const [formData, setFormData] = useState<Partial<Event>>({
//     title: "",
//     description: "",
//     date: "",
//     startTime: "",
//     endTime: "",
//     location: "",
//     type: "lecture",
//     isRecurring: false,
//     recurringFrequency: undefined,
//     isPublic: true,
//     maxAttendees: "",
//     meetingLink: "",
//   });
//   const [isDatePickerVisible, setDatePickerVisible] = useState(false);
//   const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
//   const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

//   const handleDateConfirm = (date: Date) => {
//     setFormData({ ...formData, date: date.toISOString().split("T")[0] });
//     setDatePickerVisible(false);
//   };

//   const handleStartTimeConfirm = (time: Date) => {
//     const timeString = time.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//     setFormData({ ...formData, startTime: timeString });
//     setStartTimePickerVisible(false);
//   };

//   const handleEndTimeConfirm = (time: Date) => {
//     const timeString = time.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//     setFormData({ ...formData, endTime: timeString });
//     setEndTimePickerVisible(false);
//   };

//   const handleSubmit = () => {
//     if (
//       !formData.title ||
//       !formData.date ||
//       !formData.startTime ||
//       !formData.location ||
//       !formData.type
//     ) {
//       Alert.alert(
//         "Error",
//         "Please fill in all required fields (Title, Date, Start Time, Location, Type)."
//       );
//       return;
//     }

//     onSubmit(formData);
//     setFormData({
//       title: "",
//       description: "",
//       date: "",
//       startTime: "",
//       endTime: "",
//       location: "",
//       type: "lecture",
//       isRecurring: false,
//       recurringFrequency: undefined,
//       isPublic: true,
//       maxAttendees: "",
//       meetingLink: "",
//     });
//     onClose();
//   };

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       presentationStyle="pageSheet"
//       onRequestClose={onClose}
//     >
//       <View style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Create New Event</Text>
//           <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//             <X size={28} color="#0D1B2A" />
//           </TouchableOpacity>
//         </View>

//         <ScrollView
//           style={styles.scrollView}
//           contentContainerStyle={styles.scrollContent}
//         >
//           <View style={styles.formContainer}>
//             {/* Event Details Section */}
//             <Text style={styles.sectionTitle}>Event Details</Text>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Event Title *</Text>
//               <TextInput
//                 style={styles.input}
//                 value={formData.title}
//                 onChangeText={(text) =>
//                   setFormData({ ...formData, title: text })
//                 }
//                 placeholder="Enter event title"
//                 placeholderTextColor="#94a3b8"
//               />
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Description</Text>
//               <TextInput
//                 style={[styles.input, styles.textArea]}
//                 value={formData.description}
//                 onChangeText={(text) =>
//                   setFormData({ ...formData, description: text })
//                 }
//                 placeholder="Enter event description"
//                 placeholderTextColor="#94a3b8"
//                 multiline
//                 numberOfLines={3}
//               />
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Event Type *</Text>
//               <View className=" border border-gray-300 rounded-xl">
//                 <RNPickerSelect
//                   onValueChange={(value) =>
//                     setFormData({ ...formData, type: value })
//                   }
//                   items={[
//                     { label: "Lecture", value: "lecture" },
//                     { label: "Janazah", value: "janazah" },
//                     { label: "Iftar", value: "iftar" },
//                     { label: "Class", value: "class" },
//                     { label: "Other", value: "other" },
//                   ]}
//                   style={pickerSelectStyles}
//                   value={formData.type}
//                   placeholder={{ label: "Select event type", value: null }}
//                 />
//               </View>
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Date *</Text>
//               <TouchableOpacity
//                 style={styles.dateInput}
//                 onPress={() => setDatePickerVisible(true)}
//               >
//                 <CalendarClock size={20} color="#2E7D32" />
//                 <Text style={styles.dateText}>
//                   {formData.date || "Select date"}
//                 </Text>
//               </TouchableOpacity>
//               <DateTimePickerModal
//                 isVisible={isDatePickerVisible}
//                 mode="date"
//                 onConfirm={handleDateConfirm}
//                 onCancel={() => setDatePickerVisible(false)}
//                 minimumDate={new Date()}
//               />
//             </View>

//             <View style={styles.timeRow}>
//               <View style={[styles.inputContainer, styles.timeInput]}>
//                 <Text style={styles.label}>Start Time *</Text>
//                 <TouchableOpacity
//                   style={styles.dateInput}
//                   onPress={() => setStartTimePickerVisible(true)}
//                 >
//                   <CalendarClock size={20} color="#2E7D32" />
//                   <Text style={styles.dateText}>
//                     {formData.startTime || "Select start time"}
//                   </Text>
//                 </TouchableOpacity>
//                 <DateTimePickerModal
//                   isVisible={isStartTimePickerVisible}
//                   mode="time"
//                   onConfirm={handleStartTimeConfirm}
//                   onCancel={() => setStartTimePickerVisible(false)}
//                 />
//               </View>

//               <View style={[styles.inputContainer, styles.timeInput]}>
//                 <Text style={styles.label}>End Time</Text>
//                 <TouchableOpacity
//                   style={styles.dateInput}
//                   onPress={() => setEndTimePickerVisible(true)}
//                 >
//                   <CalendarClock size={20} color="#2E7D32" />
//                   <Text style={styles.dateText}>
//                     {formData.endTime || "Select end time"}
//                   </Text>
//                 </TouchableOpacity>
//                 <DateTimePickerModal
//                   isVisible={isEndTimePickerVisible}
//                   mode="time"
//                   onConfirm={handleEndTimeConfirm}
//                   onCancel={() => setEndTimePickerVisible(false)}
//                 />
//               </View>
//             </View>

//             {/* Location and Access Section */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Location *</Text>
//               <View style={styles.inputWithIcon}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.location}
//                   onChangeText={(text) =>
//                     setFormData({ ...formData, location: text })
//                   }
//                   placeholder="Enter location"
//                   placeholderTextColor="#94a3b8"
//                 />
//                 <MapPin size={20} color="#2E7D32" style={styles.inputIcon} />
//               </View>
//             </View>

//             <View className="flex-row items-center justify-between">
//               <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Public Event</Text>
//                 <Switch
//                   value={formData.isPublic}
//                   onValueChange={(value) =>
//                     setFormData({ ...formData, isPublic: value })
//                   }
//                   trackColor={{ false: "#94a3b8", true: "#2E7D32" }}
//                   thumbColor="#F5F5DC"
//                 />
//               </View>

//               {/* Recurring Section */}
//               <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Recurring Event</Text>
//                 <Switch
//                   value={formData.isRecurring}
//                   onValueChange={(value) =>
//                     setFormData({ ...formData, isRecurring: value })
//                   }
//                   trackColor={{ false: "#94a3b8", true: "#2E7D32" }}
//                   thumbColor="#F5F5DC"
//                 />
//               </View>
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Max Attendees (Optional)</Text>
//               <View style={styles.inputWithIcon}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.maxAttendees}
//                   onChangeText={(text) =>
//                     setFormData({ ...formData, maxAttendees: text })
//                   }
//                   placeholder="Enter max attendees"
//                   placeholderTextColor="#94a3b8"
//                   keyboardType="numeric"
//                 />
//                 <Users size={20} color="#2E7D32" style={styles.inputIcon} />
//               </View>
//             </View>

            

//             {formData.isRecurring && (
//               <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Recurring Frequency</Text>
//                 <RNPickerSelect
//                   onValueChange={(value) =>
//                     setFormData({ ...formData, recurringFrequency: value })
//                   }
//                   items={[
//                     { label: "Daily", value: "daily" },
//                     { label: "Weekly", value: "weekly" },
//                     { label: "Monthly", value: "monthly" },
//                   ]}
//                   style={pickerSelectStyles}
//                   value={formData.recurringFrequency}
//                   placeholder={{ label: "Select frequency", value: null }}
//                 />
//               </View>
//             )}

//             {/* Action Buttons */}
//             <View style={styles.buttonRow}>
//               <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.submitButton}
//                 onPress={handleSubmit}
//               >
//                 <LinearGradient
//                   colors={["#2E7D32", "#10b981"]}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={styles.submitButtonGradient}
//                 >
//                   <Save size={20} color="#F5F5DC" />
//                   <Text style={styles.submitButtonText}>Create Event</Text>
//                 </LinearGradient>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ScrollView>
//       </View>
//     </Modal>
//   );
// };

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
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     backgroundColor: "white",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e2e8f0",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   headerTitle: {
//     color: "#0D1B2A",
//     fontSize: 24,
//     fontFamily: "CrimsonText_700Bold",
//   },
//   closeButton: {
//     padding: 8,
//     borderRadius: 12,
//     backgroundColor: "#f8fafc",
//   },
//   formContainer: {
//     backgroundColor: "white",
//     borderRadius: 16,
//     padding: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   sectionTitle: {
//     color: "#0D1B2A",
//     fontSize: 18,
//     fontFamily: "CrimsonText_600SemiBold",
//     marginBottom: 12,
//     marginTop: 4,
//   },
//   inputContainer: {
//     marginBottom: 4,
//   },
//   label: {
//     color: "#0D1B2A",
//     fontSize: 14,
//     fontFamily: "CrimsonText_600SemiBold",
//     marginBottom: 4,
//   },
//   input: {
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 12,
//     fontSize: 14,
//     fontFamily: "CrimsonText_600SemiBold",
//     color: "#0D1B2A",
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   inputWithIcon: {
//     position: "relative",
//   },
//   inputIcon: {
//     position: "absolute",
//     right: 12,
//     top: 12,
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: "top",
//   },
//   dateInput: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   dateText: {
//     color: "#0D1B2A",
//     fontSize: 14,
//     fontFamily: "CrimsonText_600SemiBold",
//     marginLeft: 8,
//     flex: 1,
//   },
//   timeRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   timeInput: {
//     flex: 1,
//     marginRight: 8,
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
//     fontFamily: "CrimsonText_600SemiBold",
//   },
//   submitButton: {
//     flex: 1,
//     borderRadius: 12,
//     overflow: "hidden",
//   },
//   submitButtonGradient: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 16,
//   },
//   submitButtonText: {
//     color: "#F5F5DC",
//     fontSize: 16,
//     fontFamily: "CrimsonText_600SemiBold",
//     marginLeft: 8,
//   },
// });

// const pickerSelectStyles = StyleSheet.create({
//   inputIOS: {
//     backgroundColor: "white",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     fontSize: 14,
//     fontFamily: "CrimsonText_600SemiBold",
//     color: "#0D1B2A",
//     borderWidth: 1,
//     borderColor: "#717478",
//   },
//   inputAndroid: {
//     backgroundColor: "white",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     fontSize: 14,
//     fontFamily: "CrimsonText_600SemiBold",
//     color: "#0D1B2A",
//     borderWidth: 1,
//     borderColor: "#717478",
//   },
// });
import { Event } from "@/types/event";
import { LinearGradient } from "expo-linear-gradient";
import { CalendarClock, Clock, Globe, MapPin, Repeat, Save, Users, X } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from "react-native-picker-select";

interface CreateEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (event: Partial<Event>) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Partial<Event>>({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    type: "lecture",
    isRecurring: false,
    recurringFrequency: undefined,
    isPublic: true,
    maxAttendees: "",
    meetingLink: "",
  });
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

  const handleDateConfirm = (date: Date) => {
    setFormData({ ...formData, date: date.toISOString().split("T")[0] });
    setDatePickerVisible(false);
  };

  const handleStartTimeConfirm = (time: Date) => {
    const timeString = time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    setFormData({ ...formData, startTime: timeString });
    setStartTimePickerVisible(false);
  };

  const handleEndTimeConfirm = (time: Date) => {
    const timeString = time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    setFormData({ ...formData, endTime: timeString });
    setEndTimePickerVisible(false);
  };

  const handleSubmit = () => {
    if (
      !formData.title ||
      !formData.date ||
      !formData.startTime ||
      !formData.location ||
      !formData.type
    ) {
      Alert.alert(
        "Missing Information",
        "Please fill in all required fields (Title, Date, Start Time, Location, Type)."
      );
      return;
    }

    onSubmit(formData);
    setFormData({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      type: "lecture",
      isRecurring: false,
      recurringFrequency: undefined,
      isPublic: true,
      maxAttendees: "",
      meetingLink: "",
    });
    onClose();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      type: "lecture",
      isRecurring: false,
      recurringFrequency: undefined,
      isPublic: true,
      maxAttendees: "",
      meetingLink: "",
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={resetForm}
    >
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={["#2E7D32", "#10b981"]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Create New Event</Text>
              <Text style={styles.headerSubtitle}>Organize a community gathering</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={resetForm}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            {/* Event Details Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  <CalendarClock size={20} color="#2E7D32" />
                </View>
                <Text style={styles.sectionTitle}>Event Details</Text>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Event Title *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.title}
                    onChangeText={(text) =>
                      setFormData({ ...formData, title: text })
                    }
                    placeholder="Enter event title"
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.description}
                    onChangeText={(text) =>
                      setFormData({ ...formData, description: text })
                    }
                    placeholder="Describe your event..."
                    placeholderTextColor="#94a3b8"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Event Type *</Text>
                  <View style={styles.pickerContainer}>
                    <RNPickerSelect
                      onValueChange={(value) =>
                        setFormData({ ...formData, type: value })
                      }
                      items={[
                        { label: "Lecture", value: "lecture" },
                        { label: "Janazah", value: "janazah" },
                        { label: "Iftar", value: "iftar" },
                        { label: "Class", value: "class" },
                        { label: "Other", value: "other" },
                      ]}
                      style={pickerSelectStyles}
                      value={formData.type}
                      placeholder={{ label: "Select event type", value: null }}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Date & Time Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  <Clock size={20} color="#2E7D32" />
                </View>
                <Text style={styles.sectionTitle}>Date & Time</Text>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Date *</Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => setDatePickerVisible(true)}
                  >
                    <CalendarClock size={20} color="#2E7D32" />
                    <Text style={formData.date ? styles.dateTextSelected : styles.dateText}>
                      {formData.date || "Select date"}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleDateConfirm}
                    onCancel={() => setDatePickerVisible(false)}
                    minimumDate={new Date()}
                  />
                </View>

                <View style={styles.timeRow}>
                  <View style={[styles.inputContainer, styles.timeInput]}>
                    <Text style={styles.label}>Start Time *</Text>
                    <TouchableOpacity
                      style={styles.dateInput}
                      onPress={() => setStartTimePickerVisible(true)}
                    >
                      <Clock size={20} color="#2E7D32" />
                      <Text style={formData.startTime ? styles.dateTextSelected : styles.dateText}>
                        {formData.startTime || "Start time"}
                      </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={isStartTimePickerVisible}
                      mode="time"
                      onConfirm={handleStartTimeConfirm}
                      onCancel={() => setStartTimePickerVisible(false)}
                    />
                  </View>

                  <View style={[styles.inputContainer, styles.timeInput]}>
                    <Text style={styles.label}>End Time</Text>
                    <TouchableOpacity
                      style={styles.dateInput}
                      onPress={() => setEndTimePickerVisible(true)}
                    >
                      <Clock size={20} color="#2E7D32" />
                      <Text style={formData.endTime ? styles.dateTextSelected : styles.dateText}>
                        {formData.endTime || "End time"}
                      </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={isEndTimePickerVisible}
                      mode="time"
                      onConfirm={handleEndTimeConfirm}
                      onCancel={() => setEndTimePickerVisible(false)}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Location Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  <MapPin size={20} color="#2E7D32" />
                </View>
                <Text style={styles.sectionTitle}>Location</Text>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Location *</Text>
                  <View style={styles.inputWithIcon}>
                    <TextInput
                      style={styles.input}
                      value={formData.location}
                      onChangeText={(text) =>
                        setFormData({ ...formData, location: text })
                      }
                      placeholder="Enter event location"
                      placeholderTextColor="#94a3b8"
                    />
                    <MapPin size={20} color="#64748b" style={styles.inputIcon} />
                  </View>
                </View>
              </View>
            </View>

            {/* Settings Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  <Globe size={20} color="#2E7D32" />
                </View>
                <Text style={styles.sectionTitle}>Event Settings</Text>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.settingRow}>
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>Public Event</Text>
                    <Text style={styles.settingDescription}>
                      Visible to all community members
                    </Text>
                  </View>
                  <Switch
                    value={formData.isPublic}
                    onValueChange={(value) =>
                      setFormData({ ...formData, isPublic: value })
                    }
                    trackColor={{ false: "#cbd5e1", true: "#2E7D32" }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <View style={styles.settingRow}>
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>Recurring Event</Text>
                    <Text style={styles.settingDescription}>
                      Repeat this event regularly
                    </Text>
                  </View>
                  <Switch
                    value={formData.isRecurring}
                    onValueChange={(value) =>
                      setFormData({ ...formData, isRecurring: value })
                    }
                    trackColor={{ false: "#cbd5e1", true: "#2E7D32" }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                {formData.isRecurring && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Recurring Frequency</Text>
                    <View style={styles.pickerContainer}>
                      <RNPickerSelect
                        onValueChange={(value) =>
                          setFormData({ ...formData, recurringFrequency: value })
                        }
                        items={[
                          { label: "Daily", value: "daily" },
                          { label: "Weekly", value: "weekly" },
                          { label: "Monthly", value: "monthly" },
                        ]}
                        style={pickerSelectStyles}
                        value={formData.recurringFrequency}
                        placeholder={{ label: "Select frequency", value: null }}
                        Icon={() => <Repeat size={16} color="#64748b" />}
                      />
                    </View>
                  </View>
                )}

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Max Attendees (Optional)</Text>
                  <View style={styles.inputWithIcon}>
                    <TextInput
                      style={styles.input}
                      value={formData.maxAttendees}
                      onChangeText={(text) =>
                        setFormData({ ...formData, maxAttendees: text })
                      }
                      placeholder="No limit"
                      placeholderTextColor="#94a3b8"
                      keyboardType="numeric"
                    />
                    <Users size={20} color="#64748b" style={styles.inputIcon} />
                  </View>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={resetForm}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <LinearGradient
                  colors={["#2E7D32", "#10b981"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitButtonGradient}
                >
                  <Save size={20} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Create Event</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "#DCFCE7",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  formContainer: {
    gap: 12,
  },
  section: {
    backgroundColor: "#FCFCF5",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  inputGroup: {
    gap: 8,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    color: "#374151",
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
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
  inputWithIcon: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    overflow: "hidden",
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  dateText: {
    color: "#94A3B8",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    marginLeft: 12,
    flex: 1,
  },
  dateTextSelected: {
    color: "#0F172A",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    marginLeft: 12,
    flex: 1,
  },
  timeRow: {
    flexDirection: "row",
    gap: 12,
  },
  timeInput: {
    flex: 1,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  settingText: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    color: "#374151",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
  },
  settingDescription: {
    color: "#64748B",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cancelButtonText: {
    color: "#64748B",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  submitButton: {
    flex: 2,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  submitButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginLeft: 8,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#0F172A",
    borderWidth: 0,
  },
  inputAndroid: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#0F172A",
    borderWidth: 0,
  },
  placeholder: {
    color: "#94A3B8",
  },
});