import { RefreshCw, Wifi } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PrayerErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const PrayerErrorState: React.FC<PrayerErrorStateProps> = ({
  error,
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Wifi size={64} color="#ef4444" style={styles.icon} />
        <Text style={styles.title}>Connection Error</Text>
        <Text style={styles.message}>{error}</Text>

        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <RefreshCw size={20} color="#ffffff" />
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>

        <Text style={styles.helpText}>
          Make sure you have an active internet connection
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ef4444",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  retryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  helpText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
});
