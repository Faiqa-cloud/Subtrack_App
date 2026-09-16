import {
  SUBSCRIPTION_CATEGORIES,
  SUBSCRIPTION_OPTIONS,
} from "@/constants/data";
import { icons } from "@/constants/icons";
import { Ionicons } from "@expo/vector-icons";
import { styled } from "nativewind";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import type {
  SubscriptionInput,
  Subscription as SubscriptionRecord,
} from "../../../lib/subscriptions";
import { useSubscriptions } from "../../../lib/subscriptions";
const SafeAreaView = styled(RNSafeAreaView);
const categoryColors = ["#3B82F6", "#F59E0B", "#0D9488", "#F97316"];
type SubscriptionProps = {
  onClose?: () => void;
  initialSubscription?: SubscriptionRecord | null;
};

const Subscription = ({ onClose, initialSubscription }: SubscriptionProps) => {
  const {
    subscriptions,
    addSubscription: addSubscriptionToStore,
    updateSubscription,
    deleteSubscription,
  } = useSubscriptions();
  const [name, setName] = useState(initialSubscription?.name ?? "");
  const [category, setCategory] = useState(initialSubscription?.category ?? "");
  const [price, setPrice] = useState(
    initialSubscription ? String(initialSubscription.price) : "",
  );
  const [frequency, setFrequency] = useState<SubscriptionInput["billing"]>(
    initialSubscription?.billing ?? "Monthly",
  );
  const [error, setError] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"name" | "category" | null>(
    null,
  );
  const [editingId, setEditingId] = useState<string | null>(
    initialSubscription?.id ?? null,
  );

  const resetForm = () => {
    setName("");
    setCategory("");
    setPrice("");
    setFrequency("Monthly");
    setEditingId(null);
  };

  const addSubscription = () => {
    const parsedPrice = Number(price.replace(",", "."));

    if (!name.trim() || !category.trim() || !price.trim()) {
      setError("Complete the name, category, and price fields.");
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError("Enter a valid price greater than 0.");
      return;
    }

    const subscription = {
      name: name.trim(),
      plan: frequency,
      category: category.trim(),
      paymentMethod: "Credit Card",
      status: "active",
      startDate: new Date().toISOString().slice(0, 10),
      price: parsedPrice,
      currency: "USD",
      billing: frequency,
      renewalDate: "Not set",
      color: "#3B82F6",
      icon: icons.wallet,
    } satisfies SubscriptionInput;

    if (editingId) updateSubscription(editingId, subscription);
    else addSubscriptionToStore(subscription);
    resetForm();
    setError("");
    setIsAdded(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-32"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-6 mt-4">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-3xl font-bold text-[#111827]">
                  Subscriptions
                </Text>
                <Text className="mt-2 text-base text-gray-500">
                  Keep track of every recurring payment.
                </Text>
              </View>
              {onClose ? (
                <Pressable
                  accessibilityLabel="Close subscription form"
                  accessibilityRole="button"
                  onPress={onClose}
                  className="ml-3 h-10 w-10 items-center justify-center rounded-full bg-gray-100"
                >
                  <Ionicons name="close" size={22} color="#111827" />
                </Pressable>
              ) : null}
            </View>
          </View>

          <View className="rounded-3xl bg-[#F3F4F6] p-5">
            <Text className="mb-4 text-lg font-bold text-gray-900">
              Add subscription
            </Text>

            <Text className="mb-2 text-sm font-semibold text-gray-700">
              Subscription
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter a subscription name"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              className="mb-3 h-14 rounded-2xl bg-white px-4 text-base text-gray-900"
            />
            <Pressable
              onPress={() =>
                setOpenDropdown(openDropdown === "name" ? null : "name")
              }
              className="mb-2 h-12 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4"
            >
              <Text className="text-sm font-semibold text-gray-600">
                Choose from available subscriptions
              </Text>
              <Ionicons
                name={openDropdown === "name" ? "chevron-up" : "chevron-down"}
                size={18}
                color="#6B7280"
              />
            </Pressable>
            {openDropdown === "name" ? (
              <View className="mb-4 overflow-hidden rounded-2xl bg-white">
                {SUBSCRIPTION_OPTIONS.map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => {
                      setName(option);
                      setOpenDropdown(null);
                    }}
                    className="border-b border-gray-100 px-4 py-3"
                  >
                    <Text className="text-base text-gray-700">{option}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}

            <Text className="mb-2 text-sm font-semibold text-gray-700">
              Category
            </Text>
            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="Enter a category"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              className="mb-3 h-14 rounded-2xl bg-white px-4 text-base text-gray-900"
            />
            <Pressable
              onPress={() =>
                setOpenDropdown(openDropdown === "category" ? null : "category")
              }
              className="mb-2 h-12 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4"
            >
              <Text className="text-sm font-semibold text-gray-600">
                Choose from available categories
              </Text>
              <Ionicons
                name={
                  openDropdown === "category" ? "chevron-up" : "chevron-down"
                }
                size={18}
                color="#6B7280"
              />
            </Pressable>
            {openDropdown === "category" ? (
              <View className="mb-4 overflow-hidden rounded-2xl bg-white">
                {SUBSCRIPTION_CATEGORIES.map((option, index) => (
                  <Pressable
                    key={option}
                    onPress={() => {
                      setCategory(option);
                      setOpenDropdown(null);
                    }}
                    className="flex-row items-center border-b border-gray-100 px-4 py-3"
                  >
                    <View
                      style={{
                        backgroundColor:
                          categoryColors[index % categoryColors.length],
                      }}
                      className="mr-3 h-3 w-3 rounded-full"
                    />
                    <Text className="text-base text-gray-700">{option}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}

            <Text className="mb-2 text-sm font-semibold text-gray-700">
              Price (USD)
            </Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="e.g. 15.99"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              className="h-14 rounded-2xl bg-white px-4 text-base text-gray-900"
            />

            <Text className="mb-2 mt-4 text-sm font-semibold text-gray-700">
              Frequency
            </Text>
            <View className="flex-row gap-2">
              {(["Monthly", "Yearly"] as const).map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setFrequency(option)}
                  className={`flex-1 items-center rounded-2xl px-4 py-3 ${
                    frequency === option ? "bg-[#FDE7DD]" : "bg-white"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      frequency === option ? "text-[#C86D63]" : "text-gray-700"
                    }`}
                  >
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>

            {error ? (
              <Text className="mt-3 text-sm text-red-500">{error}</Text>
            ) : null}

            {isAdded ? (
              <View className="mt-4 flex-row items-center rounded-2xl bg-[#D1FAE5] p-3">
                <Ionicons name="checkmark-circle" size={22} color="#059669" />
                <Text className="ml-2 font-semibold text-[#047857]">
                  Subscription added successfully
                </Text>
              </View>
            ) : null}

            <Pressable
              onPress={addSubscription}
              className="mt-5 h-14 items-center justify-center rounded-2xl bg-[#111827]"
            >
              <Text className="text-base font-bold text-white">
                {editingId ? "Save changes" : "Add subscription"}
              </Text>
            </Pressable>
          </View>

          <Text className="mb-3 mt-8 text-xl font-bold text-[#111827]">
            Your subscriptions
          </Text>
          {subscriptions.map((subscription) => (
            <View
              key={subscription.id}
              className="mb-3 flex-row items-center justify-between rounded-2xl bg-gray-100 p-5"
            >
              <View className="flex-row items-center gap-3">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-white">
                  <Text className="text-lg font-bold text-[#3B82F6]">$</Text>
                </View>
                <View>
                  <Text className="text-base font-bold text-gray-900">
                    {subscription.name}
                  </Text>
                  <Text className="mt-1 text-sm text-gray-500">
                    {subscription.category} · {subscription.billing}
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-base font-bold text-gray-900">
                  ${subscription.price.toFixed(2)}
                </Text>
                <View className="mt-2 flex-row gap-3">
                  <Pressable
                    onPress={() => {
                      setEditingId(subscription.id);
                      setName(subscription.name);
                      setCategory(subscription.category);
                      setPrice(String(subscription.price));
                      setFrequency(subscription.billing);
                    }}
                    accessibilityLabel={`Edit ${subscription.name}`}
                  >
                    <Ionicons name="create-outline" size={20} color="#3B82F6" />
                  </Pressable>
                  <Pressable
                    onPress={() => deleteSubscription(subscription.id)}
                    accessibilityLabel={`Delete ${subscription.name}`}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Subscription;
