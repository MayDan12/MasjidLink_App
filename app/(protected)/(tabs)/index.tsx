import { useAuth } from "@/app/context/AuthContext";
import ImamHomeScreen from "@/components/imam/screen/ImamHomeScreen";
import HomeScreen from "@/components/users/screen/HomeScreen";

// type UserRole = "imam" | "user" | null;

export default function Home() {
  const { role } = useAuth();

  // If the user is not an imam, show the regular home screen

  switch (role) {
    case "imam":
      return <ImamHomeScreen />;
    default:
      return <HomeScreen />;
  }
  // return <HomeScreenLoader />;
}
