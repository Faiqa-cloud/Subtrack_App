import { HOME_SUBSCRIPTION, UPCOMING_SUBSCRIPTION } from "@/constants/data";
import { Ionicons } from "@expo/vector-icons";
import { styled } from "nativewind";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const periods = ["This month", "This year"] as const;
type Period = (typeof periods)[number];

const categoryColors: Record<string, string> = {
  Entertainment: "#3B82F6",
  Learning: "#F59E0B",
  Work: "#14B8A6",
  Productivity: "#F97316",
};

const currency = (value: number) => `$${value.toFixed(2)}`;

const Insights = () => {
  const [period, setPeriod] = useState<Period>("This month");

  const analytics = useMemo(() => {
    const activeSubscriptions = HOME_SUBSCRIPTION.filter(
      (subscription) => subscription.status === "active",
    );
    const monthlySpend = activeSubscriptions.reduce(
      (total, subscription) =>
        total +
        (subscription.billing === "Yearly"
          ? subscription.price / 12
          : subscription.price),
      0,
    );
    const yearlySpend = monthlySpend * 12;
    const categoryTotals = activeSubscriptions.reduce<Record<string, number>>(
      (totals, subscription) => {
        totals[subscription.category] =
          (totals[subscription.category] ?? 0) + subscription.price;
        return totals;
      },
      {},
    );
    const categories = Object.entries(categoryTotals).sort(
      ([, first], [, second]) => second - first,
    );
    const chartValues =
      period === "This month"
        ? [12, 18, 15, 25, 22, 31, monthlySpend]
        : [58, 72, 64, 88, 76, 94, yearlySpend / 10];
    const maxChartValue = Math.max(...chartValues, 1);

    return {
      activeSubscriptions,
      monthlySpend,
      yearlySpend,
      categories,
      chartValues,
      maxChartValue,
    };
  }, [period]);

  const largestCategory = analytics.categories[0];
  const nextPayment = UPCOMING_SUBSCRIPTION[0];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-32"
      >
        <View className="mb-6 mt-4 flex-row items-start justify-between">
          <View>
            <Text className="text-3xl font-bold text-[#081126]">Insights</Text>
            <Text className="mt-2 text-base text-gray-500">
              A clearer view of your recurring spend.
            </Text>
          </View>
          <View className="h-11 w-11 items-center justify-center rounded-full bg-[#EEF4FF]">
            <Ionicons name="analytics-outline" size={22} color="#3B82F6" />
          </View>
        </View>

        <View className="mb-5 flex-row rounded-2xl bg-gray-100 p-1">
          {periods.map((option) => (
            <Pressable
              key={option}
              onPress={() => setPeriod(option)}
              className={`flex-1 items-center rounded-xl py-3 ${
                period === option ? "bg-white" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  period === option ? "text-[#111827]" : "text-gray-500"
                }`}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="mb-5 rounded-3xl bg-[#111827] p-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-gray-300">
              Estimated recurring spend
            </Text>
            <View className="rounded-full bg-[#273449] px-3 py-1">
              <Text className="text-xs font-semibold text-[#A9C7FF]">
                {period}
              </Text>
            </View>
          </View>
          <Text className="mt-3 text-4xl font-bold text-white">
            {currency(
              period === "This month"
                ? analytics.monthlySpend
                : analytics.yearlySpend,
            )}
          </Text>
          <View className="mt-5 flex-row items-center">
            <View className="mr-2 h-7 w-7 items-center justify-center rounded-full bg-[#D1FAE5]">
              <Ionicons name="trending-down" size={16} color="#059669" />
            </View>
            <Text className="text-sm text-gray-300">
              12% less than your spending target
            </Text>
          </View>
        </View>

        <View className="mb-6 flex-row gap-3">
          <View className="flex-1 rounded-2xl bg-[#F3F4F6] p-4">
            <View className="mb-3 h-9 w-9 items-center justify-center rounded-xl bg-white">
              <Ionicons name="layers-outline" size={19} color="#3B82F6" />
            </View>
            <Text className="text-2xl font-bold text-[#111827]">
              {analytics.activeSubscriptions.length}
            </Text>
            <Text className="mt-1 text-sm text-gray-500">Active plans</Text>
          </View>
          <View className="flex-1 rounded-2xl bg-[#F3F4F6] p-4">
            <View className="mb-3 h-9 w-9 items-center justify-center rounded-xl bg-white">
              <Ionicons name="calendar-outline" size={19} color="#F59E0B" />
            </View>
            <Text className="text-2xl font-bold text-[#111827]">
              {UPCOMING_SUBSCRIPTION.length}
            </Text>
            <Text className="mt-1 text-sm text-gray-500">Coming up</Text>
          </View>
        </View>

        <Text className="mb-3 text-xl font-bold text-[#081126]">
          Spending trend
        </Text>
        <View className="mb-6 rounded-3xl bg-[#F3F4F6] p-5">
          <View className="h-44 flex-row items-end justify-between">
            {analytics.chartValues.map((value, index) => (
              <View key={`${value}-${index}`} className="items-center">
                <View
                  className={`w-7 rounded-t-xl ${
                    index === analytics.chartValues.length - 1
                      ? "bg-[#3B82F6]"
                      : "bg-[#C9D8F6]"
                  }`}
                  style={{
                    height: Math.max(
                      (value / analytics.maxChartValue) * 132,
                      10,
                    ),
                  }}
                />
                <Text className="mt-3 text-xs text-gray-500">
                  {period === "This month"
                    ? ["M", "T", "W", "T", "F", "S", "Now"][index]
                    : ["Jan", "Mar", "May", "Jul", "Sep", "Nov", "Now"][index]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-6 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-[#081126]">By category</Text>
          <Text className="text-sm text-gray-500">Monthly average</Text>
        </View>
        <View className="mb-6 rounded-3xl bg-[#F3F4F6] p-5">
          {analytics.categories.map(([category, amount], index) => (
            <View key={category} className={index === 0 ? "" : "mt-5"}>
              <View className="mb-2 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View
                    className="mr-3 h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: categoryColors[category] ?? "#9CA3AF",
                    }}
                  />
                  <Text className="text-sm font-semibold text-gray-700">
                    {category}
                  </Text>
                </View>
                <Text className="text-sm font-bold text-[#111827]">
                  {currency(amount)}
                </Text>
              </View>
              <View className="h-2 overflow-hidden rounded-full bg-white">
                <View
                  className="h-2 rounded-full"
                  style={{
                    width: `${(amount / (largestCategory?.[1] ?? 1)) * 100}%`,
                    backgroundColor: categoryColors[category] ?? "#9CA3AF",
                  }}
                />
              </View>
            </View>
          ))}
        </View>

        <Text className="mb-3 text-xl font-bold text-[#081126]">
          Renewal watch
        </Text>
        <View className="rounded-3xl bg-[#EEF4FF] p-5">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 flex-row items-center">
              <View className="mr-3 h-11 w-11 items-center justify-center rounded-2xl bg-white">
                <Ionicons name="time-outline" size={21} color="#3B82F6" />
              </View>
              <View>
                <Text className="text-base font-bold text-[#111827]">
                  Next renewal
                </Text>
                <Text className="mt-1 text-sm text-gray-500">
                  {nextPayment.name} renews in {nextPayment.daysLeft} days
                </Text>
              </View>
            </View>
            <Text className="text-base font-bold text-[#111827]">
              {currency(nextPayment.price)}
            </Text>
          </View>
          <View className="mt-4 h-px bg-[#D8E5FF]" />
          <Text className="mt-4 text-sm leading-5 text-gray-600">
            Your {largestCategory?.[0] ?? "top"} plans make up the largest share
            of recurring spend.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Insights;
