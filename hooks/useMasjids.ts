import { getAllMasjids } from "@/services/getMasjids";
import { Masjid } from "@/types/masjid";
import { useEffect, useState } from "react";

export const useMasjids = () => {
  const [masjids, setMasjids] = useState<Masjid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMasjids = async () => {
      try {
        setLoading(true);

        const response = await getAllMasjids();

        if (response.error) throw new Error(response.message);
        if (!response.data) throw new Error("No masjids data received.");

        // ✅ Sanitize the response data before setting state
        const sanitizeMasjids = (data: any[]): Masjid[] => {
          return data.map((m) => ({
            ...m,
            // Ensure facilityTypes is always a safe array
            facilityTypes: Array.isArray(m.facilityTypes)
              ? m.facilityTypes.filter(Boolean)
              : [],
            // Ensure rating is a number
            rating:
              typeof m.rating === "number" ? m.rating : Number(m.rating) || 0,
            // Ensure followersCount is numeric
            followersCount: Number(m.followersCount) || 0,
            // Optional safe defaults
            address: m.address || "No address provided",
            name: m.name || "Unnamed Masjid",
            description: m.description || "",
            city: m.city || "",
            state: m.state || "",
            country: m.country || "",
          }));
        };

        const cleanedData = sanitizeMasjids(response.data);
        // console.log("✅ Cleaned Masjids:", cleanedData);

        setMasjids(cleanedData);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching masjids:", err);
        setError("Failed to load masjids. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMasjids();
  }, []);

  return { masjids, loading, error, setMasjids };
};
