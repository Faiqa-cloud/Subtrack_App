import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

//Home Subscription

export interface SubscriptionCardProps {
  name: string;
  plan?: string;
  price: number;
  icon: ComponentProps<typeof Ionicons>["name"];
  status: string;

  // card expanding details
  category: string;
  paymentMethod: string;
  startDate: string;
  currency: string;
  billing: string;
  renewalDate: string;
  color: string;

  expanded: boolean;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

interface subscription {
  id: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  name: string;
  plan: string;
  paymentMethod: string;
  status: string;
  startDate: string;
  price: number;
  currency: string;
  billing: string;
  renewalDate: string;
  color: string;
}

//Upcoming subscription

export interface UpcomingSubscriptionCardProps {
  id: string;
  name: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  price: number;
  currency: string;
  daysLeft: number;
}

interface UpcomingSubscription {
  id: string;
  name: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  price: number;
  currency: string;
  daysLeft: number;
}
