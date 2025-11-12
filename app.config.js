// import "dotenv/config";

// export default {
//   expo: {
//     name: "MasjidLink",
//     slug: "masjidlink",
//     version: "1.0.0",
//     orientation: "portrait",
//     icon: "./assets/images/masjidlink.png",
//     userInterfaceStyle: "light",

//     splash: {
//       image: "./assets/images/masjidlink.png",
//       resizeMode: "contain",
//       backgroundColor: "#ffffff",
//     },
//     ios: {
//       bundleIdentifier: "com.masjidlink.develop", // Add this line
//       supportsTablet: true,
//       infoPlist: {
//         ITSAppUsesNonExemptEncryption: false,
//         NSLocationWhenInUseUsageDescription:
//           "This app needs location access to find Qibla direction.",
//         NSMotionUsageDescription:
//           "This app needs motion access for compass functionality.",
//         NSPhotoLibraryUsageDescription: "We need access to save photos",
//         NSCameraUsageDescription: "We need access to take pictures",
//         NSMicrophoneUsageDescription: "We need access to record audio",
//       },
//     },
//     android: {
//       package: "com.masjidlink.app",
//       permissions: ["ACCESS_FINE_LOCATION"],
//     },
//     web: {
//       bundler: "metro",
//       output: "static",
//       favicon: "./assets/images/masjidlink.png",
//     },
//     experiments: {
//       typedRoutes: true,
//       reactCompiler: true,
//     },
//     extra: {
//       EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
//       EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN:
//         process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
//       EXPO_PUBLIC_FIREBASE_PROJECT_ID:
//         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
//       EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET:
//         process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
//       EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
//         process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//       EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
//       EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,

//       eas: {
//         projectId: "d9d620a9-2ea4-4943-bb7b-e23f30a23ad8",
//       },
//     },
//   },
// };
import "dotenv/config";

export default {
  expo: {
    name: "MasjidLink",
    slug: "masjidlink",
    scheme: "masjidlink",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/masjidlink.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,

    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    ios: {
      bundleIdentifier: "com.masjidlink.develop",
      buildNumber: "1.0.0",
      supportsTablet: true,
      jsEngine: "hermes",
      infoPlist: {
        UIBackgroundModes: ["audio"],
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
      package: "com.mayowadan.masjidlink",
      versionCode: 1,
      jsEngine: "hermes",
      adaptiveIcon: {
        foregroundImage: "./assets/images/masjidlink.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        backgroundColor: "#E6F4FE",
      },
      permissions: ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },

    plugins: [
      "expo-router",
      "expo-audio",
      [
        "@stripe/stripe-react-native",
        {
          enableGooglePay: false,
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: { backgroundColor: "#000000" },
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share them with your friends.",
          cameraPermission:
            "The app accesses your camera to let you take profile pictures.",
        },
      ],
      [
        "expo-build-properties",
        {
          ios: { deploymentTarget: "15.1" },
        },
      ],
    ],

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
