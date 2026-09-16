import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import { Redirect, Tabs } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tabs } from "@/constants/data";
import { colors, components } from "@/constants/theme";
import { SubscriptionProvider } from "../../../lib/subscriptions";

const tabBar = components.tabBar;
const color = colors;

const TabLayout = () => {
  const insets = useSafeAreaInsets();
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        {/* Loading while Clerk restores the session */}
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/SignIn" />;
  }

  return (
    <SubscriptionProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,

          tabBarStyle: {
            position: "absolute",
            bottom: Math.max(insets.bottom, tabBar.horizontalInset),
            borderRadius: tabBar.radius,
            height: tabBar.height,
            marginHorizontal: tabBar.horizontalInset,
            backgroundColor: color.primary,
            borderTopWidth: 0,
            elevation: 0,
          },

          tabBarItemStyle: {
            alignItems: "center",
            justifyContent: "center",
          },

          tabBarIconStyle: {
            alignItems: "center",
            justifyContent: "center",
            padding: 30,
          },
        }}
      >
        {tabs.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,

              tabBarIcon: ({ focused }) => (
                <View
                  className={clsx(
                    "h-11 w-11 items-center justify-center",
                    focused && "rounded-full bg-white",
                  )}
                >
                  <Ionicons
                    name={tab.icon}
                    size={24}
                    color={focused ? "#3B82F6" : "#6B7280"}
                  />
                </View>
              ),
            }}
          />
        ))}
      </Tabs>
    </SubscriptionProvider>
  );
};

export default TabLayout;
