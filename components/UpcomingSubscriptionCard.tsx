import type { UpcomingSubscriptionCardProps } from "@/type";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
const UpcomingSubscriptionCard = ({
  name,
  icon,
  price,
  currency,
  daysLeft,
}: UpcomingSubscriptionCardProps) => {
  return (
    <View className="mx-5 rounded-3xl bg-[#F3F4F6] p-5">
      {/* icon + name */}
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF4FF]">
          <Ionicons name={icon} size={26} color="#3B82F6" />
        </View>

        <View>
          <Text className="text-lg font-bold text-[#111827]">{name}</Text>
          <Text className="text-gray-500">Renews in {daysLeft} days</Text>
        </View>
      </View>

      {/* price + status */}
      <View className="mt-3 flex-row justify-between ">
        <Text className="text-base font-semibold text-[#111827]">${price}</Text>
        <Text className="text-[#3B82F6]">{currency}</Text>
      </View>
    </View>
  );
};
export default UpcomingSubscriptionCard;
