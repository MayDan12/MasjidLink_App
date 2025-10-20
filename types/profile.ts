export interface UserProfile {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  profilePicture?: string;
  skills?: string;
  occupation?: string;
  languages?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface UpdateProfileData {
  name: string;
  phone?: string;
  location?: string;
  bio?: string;
  profilePicture?: string;
  skills?: string;
  occupation?: string;
  languages?: string;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface ImageUploadResponse {
  success: boolean;
  message: string;
  imageUrl: string;
  publicId: string;
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
}

export interface ProfileFetchResponse {
  success: boolean;
  data: UserProfile;
}
