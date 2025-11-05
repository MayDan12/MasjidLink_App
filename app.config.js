import "dotenv/config";

export default {
  expo: {
    name: "MasjidLink",
    slug: "masjidlink",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/masjidlink.png",
    userInterfaceStyle: "light",

    splash: {
      image: "./assets/images/masjidlink.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      bundleIdentifier: "com.masjidlink.develop", // Add this line
      supportsTablet: true,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSLocationWhenInUseUsageDescription:
          "This app needs location access to find Qibla direction.",
        NSMotionUsageDescription:
          "This app needs motion access for compass functionality.",
        NSPhotoLibraryUsageDescription: "We need access to save photos",
        NSCameraUsageDescription: "We need access to take pictures",
        NSMicrophoneUsageDescription: "We need access to record audio",
      },
    },
    android: {
      package: "com.masjidlink.app",
      permissions: ["ACCESS_FINE_LOCATION"],
    },
    extra: {
      EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN:
        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      EXPO_PUBLIC_FIREBASE_PROJECT_ID:
        process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET:
        process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
        process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,

      eas: {
        projectId: "d9d620a9-2ea4-4943-bb7b-e23f30a23ad8",
      },
    },
  },
};
