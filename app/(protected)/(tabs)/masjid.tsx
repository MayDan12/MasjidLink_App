import { useAuth } from "@/app/context/AuthContext";
import MasjidManagementScreen from "@/components/imam/screen/MasjidScreen";
import DiscoverScreen from "@/components/users/screen/Masjids";

export default function Home() {
  const { role } = useAuth();

  // Show loader while checking authentication or fetching role

  // Show user home screen for non-imam users
  switch (role) {
    case "user":
      return <DiscoverScreen />;
    default:
      return <MasjidManagementScreen />;
  }
}
