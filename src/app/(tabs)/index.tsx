import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import {
  HOME_BALANCE,
  HOME_USER,
  UPCOMING_SUBSCRIPTION,
} from "@/constants/data";
import { FORMAT_DATE, formatCurrency, formatDate } from "@/lib/utlil";
import { Ionicons } from "@expo/vector-icons";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import type { Subscription as SubscriptionRecord } from "../../../lib/subscriptions";
import { useSubscriptions } from "../../../lib/subscriptions";
import "../global.css";
import Subscription from "./subscription";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const [isSubscriptionModalVisible, setSubscriptionModalVisible] =
    useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<SubscriptionRecord | null>(null);
  const posthog = usePostHog();
  const { subscriptions, deleteSubscription } = useSubscriptions();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        className="w-full"
        ListHeaderComponent={() => (
          <View>
            {/* header */}
            <View className="flex-row items-center justify-between px-5">
              <View className="flex-1 flex-row items-center gap-3">
                {/* header profile image*/}

                <Image
                  source={require("@/assets/images/profile.jpeg")}
                  className="w-12 h-12 rounded-full"
                />
                {/* header user name */}

                <Text className="flex-1 text-2xl font-bold text-[#081126]">
                  {HOME_USER.name}
                </Text>
              </View>

              {/* header addition button */}
              <Pressable
                accessibilityLabel="Add subscription"
                accessibilityRole="button"
                onPress={() => {
                  setEditingSubscription(null);
                  setSubscriptionModalVisible(true);
                }}
                className="h-12 w-12 items-center justify-center rounded-full bg-gray-100"
              >
                <Ionicons name="add" size={30} color="#111827" />
              </Pressable>
            </View>

            {/* balance card */}
            <View className="mx-5 mt-3 mb-2 rounded-3xl bg-gray-100 p-5">
              <Text className="text-lg text-shadow-fuchsia-300">Balance</Text>
              {/* balance show view */}
              <View className="mt-5 flex-row items-end justify-between">
                <Text className="text-4xl font-bold text-[#111827]">
                  {formatCurrency(HOME_BALANCE.Balance)}
                </Text>
                <Text className="text-lg text-gray-600">
                  {formatDate(HOME_BALANCE.renewalDate)}
                </Text>
                <Text className="text-sm text-gray-500">
                  {FORMAT_DATE(HOME_BALANCE.renewalDate)}
                </Text>
              </View>
            </View>

            <Text className="mx-5 mt-6 text-xl font-bold text-[#111827]">
              Your subscriptions
            </Text>
            <FlatList
              data={subscriptions}
              renderItem={({ item }) => (
                <SubscriptionCard
                  {...item}
                  expanded={expandedSubscriptionId === item.id}
                  onPress={() => {
                    const isExpanded = expandedSubscriptionId === item.id;
                    setExpandedSubscriptionId(isExpanded ? null : item.id);
                    if (isExpanded) {
                      posthog?.capture("subscription_card_collapsed", {
                        subscription_name: item.name,
                        subscription_id: item.id,
                      });
                    } else {
                      posthog?.capture("subscription_card_expanded", {
                        subscription_name: item.name,
                        subscription_id: item.id,
                      });
                    }
                  }}
                  onEdit={() => {
                    setEditingSubscription(item);
                    setSubscriptionModalVisible(true);
                  }}
                  onDelete={() =>
                    Alert.alert(
                      "Delete subscription?",
                      `Remove ${item.name}?`,
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => deleteSubscription(item.id),
                        },
                      ],
                    )
                  }
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingLeft: 20,
                paddingRight: 8,
                paddingTop: 12,
              }}
            />
            <Text className="mx-5 mb-3 mt-8 text-xl font-bold text-[#111827]">
              Upcoming subscriptions
            </Text>
          </View>
        )}
        data={UPCOMING_SUBSCRIPTION}
        renderItem={({ item }) => <UpcomingSubscriptionCard {...item} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View className="h-1" />}
      />
      <Modal
        animationType="slide"
        presentationStyle="pageSheet"
        visible={isSubscriptionModalVisible}
        onRequestClose={() => {
          setEditingSubscription(null);
          setSubscriptionModalVisible(false);
        }}
      >
        <Subscription
          key={editingSubscription?.id ?? "new-subscription"}
          initialSubscription={editingSubscription}
          onClose={() => {
            setEditingSubscription(null);
            setSubscriptionModalVisible(false);
          }}
        />
      </Modal>
    </SafeAreaView>
  );
}
