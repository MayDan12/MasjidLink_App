import { CategoryType, CreateCampaignData, FormErrors } from "@/types/donation";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Calendar,
  Camera,
  DollarSign,
  FileText,
  Globe,
  Heart,
  Home,
  Type,
} from "lucide-react-native";
import React, { JSX, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CreateCampaignProps {
  onSubmit: (data: CreateCampaignData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CreateCampaign: React.FC<CreateCampaignProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateCampaignData>({
    title: "",
    description: "",
    goal_amount: 0,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 30 days from now
    category: "general",
    image: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  //   const [isLoading, setIsLoading] = useState(false);

  const CATEGORIES: {
    value: CategoryType;
    label: string;
    icon: JSX.Element;
  }[] = [
    {
      value: "general",
      label: "General",
      icon: <Globe size={20} color="#666" />,
    },
    {
      value: "construction",
      label: "Construction",
      icon: <Home size={20} color="#666" />,
    },
    {
      value: "education",
      label: "Education",
      icon: <BookOpen size={20} color="#666" />,
    },
    {
      value: "charity",
      label: "Charity",
      icon: <Heart size={20} color="#666" />,
    },
    {
      value: "emergency",
      label: "Emergency",
      icon: <AlertTriangle size={20} color="#666" />,
    },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Campaign title is required";
    } else if (formData.title.length < 10) {
      newErrors.title = "Title must be at least 10 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    }

    if (!formData.goal_amount || formData.goal_amount <= 0) {
      newErrors.goal_amount = "Goal amount must be greater than 0";
    } else if (formData.goal_amount > 1000000) {
      newErrors.goal_amount = "Goal amount cannot exceed $1,000,000";
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      newErrors.startDate = "Start date cannot be in the past";
    }

    if (endDate <= startDate) {
      newErrors.endDate = "End date must be after start date";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Sorry, we need camera roll permissions to upload images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setFormData((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const handleDateChange = (
    field: "startDate" | "endDate",
    selectedDate?: Date
  ) => {
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, [field]: dateString }));
    }

    if (field === "startDate") {
      setShowStartDatePicker(false);
    } else {
      setShowEndDatePicker(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5DC" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 5,
          marginBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: "#E0E0E0",
        }}
      >
        <TouchableOpacity onPress={onCancel} style={{ padding: 8 }}>
          <ArrowLeft size={24} color="#212121" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,

            color: "#212121",
            marginLeft: 16,
            fontFamily: "CrimsonText_700Bold",
          }}
        >
          Create Campaign
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Upload Section */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#212121",
              marginBottom: 8,
              fontFamily: "CrimsonText_600SemiBold",
            }}
          >
            Campaign Image
          </Text>

          <TouchableOpacity
            onPress={pickImage}
            style={{
              height: 100,
              backgroundColor: "#f5f5f5",
              borderRadius: 12,
              borderWidth: 2,
              borderColor: "#2E7D32",
              borderStyle: selectedImage ? "solid" : "dashed",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : (
              <View style={{ alignItems: "center" }}>
                <Camera size={40} color="#2E7D32" />
                <Text
                  style={{
                    marginTop: 4,
                    color: "#2E7D32",
                    fontSize: 14,
                    fontFamily: "CrimsonText_600SemiBold",
                  }}
                >
                  Tap to upload image
                </Text>
                <Text
                  style={{
                    color: "#2E7D32",
                    fontSize: 12,
                    marginTop: 4,
                    fontFamily: "CrimsonText_600SemiBold",
                  }}
                >
                  Recommended: 16:9 ratio
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Campaign Title */}
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#212121",
              marginBottom: 4,
              fontFamily: "CrimsonText_600SemiBold",
            }}
          >
            Campaign Title
          </Text>

          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: errors.title ? "#f44336" : "#2E7D32",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Type size={20} color="#757575" />
              <TextInput
                placeholder="Enter a compelling campaign title"
                value={formData.title}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, title: text }))
                }
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: "#212121",
                  fontFamily: "CrimsonText_400Regular",
                }}
                placeholderTextColor="#9E9E9E"
              />
            </View>
          </View>
          {errors.title && (
            <Text
              style={{
                color: "#f44336",
                fontSize: 12,
                marginTop: 4,
                fontFamily: "CrimsonText_400Regular",
              }}
            >
              {errors.title}
            </Text>
          )}
        </View>

        {/* Description */}
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#212121",
              marginBottom: 4,
              fontFamily: "CrimsonText_600SemiBold",
            }}
          >
            Description
          </Text>

          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: errors.description ? "#f44336" : "#2E7D32",
              minHeight: 120,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <FileText size={20} color="#757575" style={{ marginTop: 13 }} />
              <TextInput
                placeholder="Describe your campaign in detail. Explain the cause, how funds will be used, and the impact..."
                value={formData.description}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, description: text }))
                }
                style={{
                  flex: 1,
                  marginLeft: 8,
                  fontSize: 16,
                  color: "#212121",
                  textAlignVertical: "top",
                  minHeight: 70,
                  fontFamily: "CrimsonText_600SemiBold",
                }}
                placeholderTextColor="#9E9E9E"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
          {errors.description && (
            <Text
              style={{
                color: "#f44336",
                fontSize: 13,
                marginTop: 4,
                fontFamily: "CrimsonText_600SemiBold",
              }}
            >
              {errors.description}
            </Text>
          )}
          <Text style={{ color: "#757575", fontSize: 12, marginTop: 4 }}>
            {formData.description.length}/500 characters
          </Text>
        </View>

        {/* Goal Amount */}
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#212121",
              marginBottom: 4,
              fontFamily: "CrimsonText_600SemiBold",
            }}
          >
            Goal Amount
          </Text>

          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: errors.goal_amount ? "#f44336" : "#2E7D32",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <DollarSign size={20} color="#757575" />
              <TextInput
                placeholder="0"
                value={
                  formData.goal_amount === 0
                    ? ""
                    : formData.goal_amount.toString()
                }
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setFormData((prev) => ({
                    ...prev,
                    goal_amount: numericValue ? parseInt(numericValue) : 0,
                  }));
                }}
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: "#212121",
                  fontFamily: "CrimsonText_600SemiBold",
                }}
                placeholderTextColor="#9E9E9E"
                keyboardType="numeric"
              />
              <Text style={{ color: "#757575", fontSize: 14 }}>USD</Text>
            </View>
          </View>
          {errors.goal_amount && (
            <Text
              style={{
                color: "#f44336",
                fontSize: 14,
                marginTop: 4,
                fontFamily: "CrimsonText_600SemiBold",
              }}
            >
              {errors.goal_amount}
            </Text>
          )}
          {formData.goal_amount > 0 && (
            <Text
              style={{
                color: "#2E7D32",
                fontSize: 14,
                marginTop: 4,
                fontWeight: "500",
                fontFamily: "CrimsonText_600SemiBold",
              }}
            >
              Goal: {formatCurrency(formData.goal_amount)}
            </Text>
          )}
        </View>

        {/* Category Selection */}
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#212121",
              marginBottom: 12,
              fontFamily: "CrimsonText_600SemiBold",
            }}
          >
            Category
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.value}
                onPress={() =>
                  setFormData((prev) => ({
                    ...prev,
                    category: category.value,
                  }))
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  backgroundColor:
                    formData.category === category.value ? "#2E7D32" : "#fff",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor:
                    formData.category === category.value
                      ? "#2E7D32"
                      : "#E0E0E0",
                  minWidth: "48%",
                }}
              >
                {React.cloneElement(category.icon, {
                  color: formData.category === category.value ? "#fff" : "#666",
                })}
                <Text
                  style={{
                    marginLeft: 8,
                    color:
                      formData.category === category.value ? "#fff" : "#212121",

                    fontFamily: "CrimsonText_600SemiBold",
                  }}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.category && (
            <Text
              style={{
                color: "#f44336",
                fontSize: 14,
                marginTop: 4,
                fontFamily: "CrimsonText_600SemiBold",
              }}
            >
              {errors.category}
            </Text>
          )}
        </View>

        {/* Dates */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#212121",
              marginBottom: 8,
              fontFamily: "CrimsonText_600SemiBold",
            }}
          >
            Campaign Duration
          </Text>

          <View style={{ flexDirection: "row", gap: 12 }}>
            {/* Start Date */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "#757575",
                  marginBottom: 8,
                  fontFamily: "CrimsonText_600SemiBold",
                }}
              >
                Start Date
              </Text>
              <TouchableOpacity
                onPress={() => setShowStartDatePicker(true)}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: errors.startDate ? "#f44336" : "#2E7D32",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Calendar size={16} color="#757575" />
                <Text
                  style={{
                    marginLeft: 8,
                    color: "#212121",
                    fontSize: 14,
                    fontFamily: "CrimsonText_600SemiBold",
                  }}
                >
                  {new Date(formData.startDate).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {errors.startDate && (
                <Text style={{ color: "#f44336", fontSize: 12, marginTop: 4 }}>
                  {errors.startDate}
                </Text>
              )}
            </View>

            {/* End Date */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "#757575",
                  marginBottom: 8,
                  fontFamily: "CrimsonText_600SemiBold",
                }}
              >
                End Date
              </Text>
              <TouchableOpacity
                onPress={() => setShowEndDatePicker(true)}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: errors.endDate ? "#f44336" : "#2E7D32",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Calendar size={16} color="#757575" />
                <Text
                  style={{
                    marginLeft: 8,
                    color: "#212121",
                    fontSize: 14,
                    fontFamily: "CrimsonText_600SemiBold",
                  }}
                >
                  {new Date(formData.endDate).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {errors.endDate && (
                <Text
                  style={{
                    color: "#f44336",
                    fontSize: 14,
                    marginTop: 4,
                    fontFamily: "CrimsonText_600SemiBold",
                  }}
                >
                  {errors.endDate}
                </Text>
              )}
            </View>
          </View>

          {/* Date Pickers */}
          {showStartDatePicker && (
            <DateTimePicker
              value={new Date(formData.startDate)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, date) => handleDateChange("startDate", date)}
              minimumDate={new Date()}
            />
          )}

          {showEndDatePicker && (
            <DateTimePicker
              value={new Date(formData.endDate)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, date) => handleDateChange("endDate", date)}
              minimumDate={new Date(formData.startDate)}
            />
          )}
        </View>

        {/* Submit Button */}
        <View style={{ paddingHorizontal: 16 }}>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? "#ccc" : "#2E7D32",
              paddingVertical: 10,
              borderRadius: 12,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontFamily: "CrimsonText_700Bold",
              }}
            >
              {isLoading ? "Creating Campaign..." : "Create Campaign"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
