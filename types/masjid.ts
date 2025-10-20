// export interface Masjid {
//   id: string;
//   name: string;
//   address: string;
//   distance: number;
//   nextPrayer: string;
//   nextPrayerTime: string;
//   congregation: number;
//   rating: number;
//   facilities: string[];
//   isOpen: boolean;
//   image: string;
//   phone?: string;
//   description?: string;
//   latitude?: number;
//   longitude?: number;
// }

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export type Masjid = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  rating: number;
  country: string;
  denomination: string;
  // followersCount: number;
  facilityTypes: string[];
  isFavorite: boolean;
  image?: string;
  description?: string;
  capacity?: string;
  email?: string;
};
