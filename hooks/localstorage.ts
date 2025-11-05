import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveLocationToStorage = async (city: string, country: string) => {
  try {
    const data = JSON.stringify({ city, country });
    await AsyncStorage.setItem("user_location", data);
    console.log("✅ Location saved");
  } catch (error) {
    console.log("❌ Error saving location", error);
  }
};

export const getLocationFromStorage = async () => {
  try {
    const value = await AsyncStorage.getItem("user_location");
    if (value) {
      return JSON.parse(value);
    }
    return null;
  } catch (error) {
    console.log("❌ Error reading location", error);
    return null;
  }
};
