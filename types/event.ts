export type EventType = "janazah" | "lecture" | "iftar" | "class" | "other";

export type RecurringFrequency = "daily" | "weekly" | "monthly" | "yearly";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  type: EventType;
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency;
  isPublic: boolean;
  maxAttendees?: string;
  rsvps: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  meetingLink?: string;
}
