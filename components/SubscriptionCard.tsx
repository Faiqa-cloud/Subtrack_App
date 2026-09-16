import type { SubscriptionCardProps } from "@/type";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

const SubscriptionCard = ({
  name,
  plan,
  price,
  status,
  icon,
  expanded,
  category,
  paymentMethod,
  startDate,
  billing,
  renewalDate,
  onPress,
  onEdit,
  onDelete,
}: SubscriptionCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      className="mr-3 w-72 rounded-3xl bg-[#F3F4F6] p-5"
    >
      <View>
        {/* icon + name */}
        <View className="flex-row items-center gap-5">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF4FF]">
            <Ionicons name={icon} size={26} color="#3B82F6" />
          </View>

          <View>
            <Text className="text-xl font-bold text-[#111827]">{name}</Text>
            <Text className="text-gray-500">{plan}</Text>
          </View>
        </View>

        {/* price + status */}
        <View className="mt-3 flex-row items-center justify-between">
          <Text className="text-base font-semibold text-[#111827]">
            ${price}
          </Text>
          <Text className="text-[#3B82F6]">{status}</Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={onEdit}
              accessibilityLabel={`Edit ${name}`}
              hitSlop={8}
            >
              <Ionicons name="create-outline" size={20} color="#3B82F6" />
            </Pressable>
            <Pressable
              onPress={onDelete}
              accessibilityLabel={`Delete ${name}`}
              hitSlop={8}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </Pressable>
          </View>
        </View>
        {expanded ? (
          <View className="mt-4 rounded-2xl bg-white p-4">
            <Text className="mb-3 text-sm font-bold uppercase tracking-wide text-[#3B82F6]">
              Subscription details
            </Text>
            <View className="gap-2">
              <Text className="text-sm text-gray-600">
                <Text className="font-semibold text-[#111827]">Category </Text>
                {category}
              </Text>
              <Text className="text-sm text-gray-600">
                <Text className="font-semibold text-[#111827]">Payment </Text>
                {paymentMethod}
              </Text>
              <Text className="text-sm text-gray-600">
                <Text className="font-semibold text-[#111827]">Started </Text>
                {startDate}
              </Text>
              <Text className="text-sm text-gray-600">
                <Text className="font-semibold text-[#111827]">Billing </Text>
                {billing}
              </Text>
              <Text className="text-sm text-gray-600">
                <Text className="font-semibold text-[#111827]">Renews </Text>
                {renewalDate}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};
export default SubscriptionCard;
