import { Event } from "@/types/event";
import { LinearGradient } from "expo-linear-gradient";
import { CalendarClock, MapPin, Save, Users, X } from "lucide-react-native";
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
        "Error",
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create New Event</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={28} color="#0D1B2A" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.formContainer}>
            {/* Event Details Section */}
            <Text style={styles.sectionTitle}>Event Details</Text>

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
                placeholder="Enter event description"
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Event Type *</Text>
              <View className=" border border-gray-300 rounded-xl">
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

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Date *</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setDatePickerVisible(true)}
              >
                <CalendarClock size={20} color="#059669" />
                <Text style={styles.dateText}>
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
                  <CalendarClock size={20} color="#059669" />
                  <Text style={styles.dateText}>
                    {formData.startTime || "Select start time"}
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
                  <CalendarClock size={20} color="#059669" />
                  <Text style={styles.dateText}>
                    {formData.endTime || "Select end time"}
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

            {/* Location and Access Section */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location *</Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={styles.input}
                  value={formData.location}
                  onChangeText={(text) =>
                    setFormData({ ...formData, location: text })
                  }
                  placeholder="Enter location"
                  placeholderTextColor="#94a3b8"
                />
                <MapPin size={20} color="#059669" style={styles.inputIcon} />
              </View>
            </View>

            <View className="flex-row items-center justify-between">
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Public Event</Text>
                <Switch
                  value={formData.isPublic}
                  onValueChange={(value) =>
                    setFormData({ ...formData, isPublic: value })
                  }
                  trackColor={{ false: "#94a3b8", true: "#059669" }}
                  thumbColor="#F5F5DC"
                />
              </View>

              {/* Recurring Section */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Recurring Event</Text>
                <Switch
                  value={formData.isRecurring}
                  onValueChange={(value) =>
                    setFormData({ ...formData, isRecurring: value })
                  }
                  trackColor={{ false: "#94a3b8", true: "#059669" }}
                  thumbColor="#F5F5DC"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Max Attendees (Optional)</Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={styles.input}
                  value={formData.maxAttendees}
                  onChangeText={(text) =>
                    setFormData({ ...formData, maxAttendees: text })
                  }
                  placeholder="Enter max attendees"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                />
                <Users size={20} color="#059669" style={styles.inputIcon} />
              </View>
            </View>

            {/* <View style={styles.inputContainer}>
              <Text style={styles.label}>Meeting Link (Optional)</Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={styles.input}
                  value={formData.meetingLink}
                  onChangeText={(text) =>
                    setFormData({ ...formData, meetingLink: text })
                  }
                  placeholder="Enter meeting link"
                  placeholderTextColor="#94a3b8"
                />
                <Link size={20} color="#059669" style={styles.inputIcon} />
              </View>
            </View> */}

            {formData.isRecurring && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Recurring Frequency</Text>
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
                />
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <LinearGradient
                  colors={["#059669", "#10b981"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitButtonGradient}
                >
                  <Save size={20} color="#F5F5DC" />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    color: "#0D1B2A",
    fontSize: 24,
    fontFamily: "CrimsonText_700Bold",
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    color: "#0D1B2A",
    fontSize: 18,
    fontFamily: "CrimsonText_600SemiBold",
    marginBottom: 12,
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 4,
  },
  label: {
    color: "#0D1B2A",
    fontSize: 14,
    fontFamily: "CrimsonText_600SemiBold",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    fontFamily: "CrimsonText_600SemiBold",
    color: "#0D1B2A",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  inputWithIcon: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  dateText: {
    color: "#0D1B2A",
    fontSize: 14,
    fontFamily: "CrimsonText_600SemiBold",
    marginLeft: 8,
    flex: 1,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeInput: {
    flex: 1,
    marginRight: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cancelButtonText: {
    color: "#0D1B2A",
    fontSize: 16,
    fontFamily: "CrimsonText_600SemiBold",
  },
  submitButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  submitButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  submitButtonText: {
    color: "#F5F5DC",
    fontSize: 16,
    fontFamily: "CrimsonText_600SemiBold",
    marginLeft: 8,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: "CrimsonText_600SemiBold",
    color: "#0D1B2A",
    borderWidth: 1,
    borderColor: "#717478",
  },
  inputAndroid: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: "CrimsonText_600SemiBold",
    color: "#0D1B2A",
    borderWidth: 1,
    borderColor: "#717478",
  },
});
