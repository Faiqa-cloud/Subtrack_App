import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { usePostHog } from "posthog-react-native";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const posthog = usePostHog();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLoading = fetchStatus === "fetching";

  const handleSignIn = async () => {
    if (!email.trim() || !password || isLoading) {
      return;
    }

    posthog?.capture("sign_in_started");

    const { error } = await signIn.password({
      emailAddress: email.trim(),
      password,
    });

    if (error) {
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize();
      posthog?.capture("sign_in_completed");
      router.replace("/(tabs)");
      return;
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          {/* Heading */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900">
              Welcome back
            </Text>

            <Text className="mt-2 text-base leading-6 text-gray-500">
              Sign in to continue to your account.
            </Text>
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-semibold text-gray-700">
              Email
            </Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              className="h-14 rounded-2xl bg-gray-100 px-4 text-base text-gray-900"
            />

            {errors?.fields?.identifier?.message ? (
              <Text className="mt-2 text-sm text-red-500">
                {errors.fields.identifier.message}
              </Text>
            ) : null}
          </View>

          {/* Password */}
          <View className="mb-2">
            <Text className="mb-2 text-sm font-semibold text-gray-700">
              Password
            </Text>

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              className="h-14 rounded-2xl bg-gray-100 px-4 text-base text-gray-900"
            />

            {errors?.fields?.password?.message ? (
              <Text className="mt-2 text-sm text-red-500">
                {errors.fields.password.message}
              </Text>
            ) : null}
          </View>

          {/* General error */}
          {errors?.global?.[0]?.message ? (
            <Text className="mb-2 mt-2 text-sm text-red-500">
              {errors.global[0].message}
            </Text>
          ) : null}

          {/* Sign In */}
          <TouchableOpacity
            onPress={handleSignIn}
            disabled={isLoading || !email.trim() || !password}
            className="mt-5 h-14 items-center justify-center rounded-2xl bg-gray-400"
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-base font-bold text-white">Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up */}
          <View className="mt-6 flex-row justify-center">
            <Text className="text-gray-500">Don&apos;t have an account? </Text>

            <Link href="/(auth)/SignUp">
              <Text className="font-bold text-gray-900">Sign Up</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
