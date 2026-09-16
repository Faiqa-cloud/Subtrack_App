import { icons } from "./icons";

export const SUBSCRIPTION_OPTIONS = [
  "Netflix",
  "Spotify",
  "YouTube",
  "LinkedIn",
  "Notion",
  "Figma",
  "ChatGPT",
  "Amazon Prime",
  "Adobe",
  "Canva",
] as const;

export const SUBSCRIPTION_CATEGORIES = [
  "Entertainment",
  "Work",
  "Learning",
  "Fitness",
  "News",
  "Cloud Storage",
  "Productivity",
  "Gaming",
  "Design",
  "Finance",
] as const;

export const tabs = [
  {
    name: "index",
    title: "Home",
    icon: icons.home,
  },
  {
    name: "insights",
    title: "Insights",
    icon: icons.activity,
  },
  {
    name: "settings",
    title: "Settings",
    icon: icons.settings,
  },
  {
    name: "subscription",
    title: "Subscription",
    icon: icons.wallet,
  },
];

export const HOME_USER = {
  name: "FAIQA",
};

export const HOME_BALANCE = {
  Balance: 1000,
  Withdrawl: 5000,
  renewalDate: "08/12/2026",
};

export const UPCOMING_SUBSCRIPTION = [
  {
    id: "spotify",
    name: "ChatGPT",
    icon: icons.spotify,
    price: 10,
    currency: "USD",
    daysLeft: 2,
  },
  {
    id: "notion",
    name: "Behance",
    icon: icons.notion,
    price: 7,
    currency: "USD",
    daysLeft: 5,
  },
  {
    id: "figma",
    name: "KlingAI",
    icon: icons.figma,
    price: 23,
    currency: "USD",
    daysLeft: 30,
  },
];

export const HOME_SUBSCRIPTION = [
  {
    id: "spotify",
    icon: icons.spotify,
    name: "Spotify",
    plan: "Premium",
    category: "Entertainment",
    paymentMethod: "Visa ending in 123",
    status: "active",
    startDate: "2026-01-22",
    price: 5.99,
    currency: "USD",
    billing: "Monthly",
    renewalDate: "2026-12-01",
    color: "#1DB954",
  },
  {
    id: "notion",
    icon: icons.notion,
    name: "Notion",
    plan: "pro",
    category: "Learning",
    paymentMethod: "Credit Card",
    status: "Paused",
    startDate: "2026-01-22",
    price: 5.99,
    currency: "USD",
    billing: "Monthly",
    renewalDate: "2026-12-01",
    color: "#1DB954",
  },
  {
    id: "figma",
    icon: icons.figma,
    name: "Figma",
    plan: "pro",
    category: "Learning",
    paymentMethod: "Credit Card",
    status: "cancelled",
    startDate: "2026-01-22",
    price: 9.99,
    currency: "USD",
    billing: "Monthly",
    renewalDate: "2026-12-01",
    color: "#1DB954",
  },
];
