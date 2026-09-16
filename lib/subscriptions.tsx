import { HOME_SUBSCRIPTION } from "@/constants/data";
import type { SubscriptionCardProps } from "@/type";
import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";

type Subscription = Omit<
  SubscriptionCardProps,
  "expanded" | "onPress" | "onEdit" | "onDelete"
> & {
  id: string;
};

type SubscriptionInput = Omit<Subscription, "id">;

type SubscriptionContextValue = {
  subscriptions: Subscription[];
  addSubscription: (subscription: SubscriptionInput) => void;
  updateSubscription: (id: string, subscription: SubscriptionInput) => void;
  deleteSubscription: (id: string) => void;
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(
  null,
);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(HOME_SUBSCRIPTION);

  const value = useMemo(
    () => ({
      subscriptions,
      addSubscription: (subscription: SubscriptionInput) => {
        setSubscriptions((current) => [
          {
            ...subscription,
            id: `${Date.now()}-${subscription.name.toLowerCase()}`,
          },
          ...current,
        ]);
      },
      updateSubscription: (id: string, subscription: SubscriptionInput) => {
        setSubscriptions((current) =>
          current.map((item) =>
            item.id === id ? { ...subscription, id } : item,
          ),
        );
      },
      deleteSubscription: (id: string) => {
        setSubscriptions((current) => current.filter((item) => item.id !== id));
      },
    }),
    [subscriptions],
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscriptions must be used inside SubscriptionProvider",
    );
  }
  return context;
};

export type { Subscription, SubscriptionInput };
