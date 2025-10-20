import { useAuth } from "@/app/context/AuthContext";
import CreateEventScreen from "@/components/imam/screen/CreateEvent Screen";
import EventsScreen from "@/components/users/screen/Events";

export default function Home() {
  const { role } = useAuth();

  // Show loader while checking authentication or fetching role

  // Show user home screen for non-imam users
  switch (role) {
    case "imam":
      return <CreateEventScreen />;
    default:
      return <EventsScreen />;
  }
}
