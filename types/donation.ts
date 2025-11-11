export interface Campaign {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  amountRaised: number;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "upcoming" | "archived";
  category: "general" | "construction" | "education" | "charity" | "emergency";
  createdAt?: any;
  updatedAt?: any;
}

export interface CreateCampaignData {
  title: string;
  description: string;
  goal_amount: number;
  startDate: string;
  endDate: string;
  category: Campaign["category"];
  image?: string;
}

export interface FormErrors {
  title?: string;
  description?: string;
  goal_amount?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
}

export type CategoryType = Campaign["category"];
export type StatusType = Campaign["status"];
