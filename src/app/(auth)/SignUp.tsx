import { useClerk, useSignUp } from "@clerk/expo";
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

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const clerk = useClerk();
  const router = useRouter();
  const posthog = usePostHog();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [pendingVerification, setPendingVerification] = useState(false);
  const [missingRequirements, setMissingRequirements] = useState(false);
  const [customError, setCustomError] = useState("");

  const isLoading = fetchStatus === "fetching";

  const handleSignUp = async () => {
    if (!email.trim() || !password || isLoading) {
      return;
    }

    setCustomError("");

    const { error } = await signUp.password({
      emailAddress: email.trim(),
      password,
    });

    if (error) {
      setCustomError(error.message || "Could not create your account.");
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();

    if (sendError) {
      setCustomError(
        sendError.message || "Could not send the verification code.",
      );
      return;
    }

    posthog?.capture("sign_up_started");
    setPendingVerification(true);
  };

  const handleVerify = async () => {
    if (code.trim().length !== 6 || isLoading) {
      return;
    }

    setCustomError("");

    const { error } = await signUp.verifications.verifyEmailCode({
      code: code.trim(),
    });

    if (error) {
      setCustomError(error.message || "The verification code is incorrect.");
      return;
    }

    /*
     * IMPORTANT:
     * Do not call finalize() until Clerk says the sign-up
     * is complete.
     */

    if (signUp.status === "complete") {
      const { error: finalizeError } = await signUp.finalize();

      if (finalizeError) {
        setCustomError(
          finalizeError.message || "Your account could not be completed.",
        );
        return;
      }

      posthog?.capture("sign_up_email_verified");
      posthog?.capture("sign_up_completed");
      router.replace("/(tabs)");
      return;
    }

    /*
     * Clerk requires additional information.
     */
    if (
      signUp.status === "missing_requirements" &&
      signUp.missingFields.length > 0
    ) {
      posthog?.capture("sign_up_email_verified");
      setMissingRequirements(true);
      return;
    }

    setCustomError(
      `Sign-up could not be completed. Current status: ${signUp.status}`,
    );
  };

  const handleCompleteAccount = async () => {
    if (isLoading) {
      return;
    }

    setCustomError("");

    const updateData: {
      firstName?: string;
      lastName?: string;
    } = {};

    if (signUp.missingFields.includes("first_name")) {
      if (!firstName.trim()) {
        setCustomError("Please enter your first name.");
        return;
      }

      updateData.firstName = firstName.trim();
    }

    if (signUp.missingFields.includes("last_name")) {
      if (!lastName.trim()) {
        setCustomError("Please enter your last name.");
        return;
      }

      updateData.lastName = lastName.trim();
    }

    const { error } = await signUp.update(updateData);

    if (error) {
      setCustomError(error.message || "Could not complete your account.");
      return;
    }

    if (signUp.status === "complete") {
      const { error: finalizeError } = await signUp.finalize();

      if (finalizeError) {
        setCustomError(
          finalizeError.message || "Your account could not be completed.",
        );
        return;
      }

      posthog?.capture("sign_up_completed");
      router.replace("/(tabs)");
      return;
    }

    if (signUp.status === "missing_requirements") {
      setCustomError(
        `More information is required: ${signUp.missingFields.join(", ")}`,
      );
      return;
    }

    setCustomError(
      `Sign-up could not be completed. Current status: ${signUp.status}`,
    );
  };

  const handleGoBack = () => {
    clerk.client.resetSignUp();

    setCode("");
    setCustomError("");
    setPendingVerification(false);
    setMissingRequirements(false);
    setFirstName("");
    setLastName("");
  };

  /*
   * STEP 3:
   * Collect any fields Clerk still requires.
   */
  if (missingRequirements) {
    const needsFirstName = signUp.missingFields.includes("first_name");

    const needsLastName = signUp.missingFields.includes("last_name");

    const needsLegalAcceptance =
      signUp.missingFields.includes("legal_accepted");

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
            <View className="mb-8">
              <Text className="text-3xl font-bold text-gray-900">
                Complete your account
              </Text>

              <Text className="mt-2 text-base leading-6 text-gray-500">
                Your email has been verified. Complete the remaining information
                to create your account.
              </Text>
            </View>

            {needsFirstName ? (
              <View className="mb-4">
                <Text className="mb-2 text-sm font-semibold text-gray-700">
                  First name
                </Text>

                <TextInput
                  value={firstName}
                  onChangeText={(value) => {
                    setFirstName(value);
                    setCustomError("");
                  }}
                  placeholder="Enter your first name"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                  autoCorrect={false}
                  className="h-14 rounded-2xl bg-gray-100 px-4 text-base text-gray-900"
                />
              </View>
            ) : null}

            {needsLastName ? (
              <View className="mb-4">
                <Text className="mb-2 text-sm font-semibold text-gray-700">
                  Last name
                </Text>

                <TextInput
                  value={lastName}
                  onChangeText={(value) => {
                    setLastName(value);
                    setCustomError("");
                  }}
                  placeholder="Enter your last name"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                  autoCorrect={false}
                  className="h-14 rounded-2xl bg-gray-100 px-4 text-base text-gray-900"
                />
              </View>
            ) : null}

            {needsLegalAcceptance ? (
              <View className="mb-4 rounded-2xl bg-gray-100 p-4">
                <Text className="text-sm leading-5 text-gray-700">
                  Your account requires acceptance of the applicable legal
                  terms.
                </Text>
              </View>
            ) : null}

            {customError ? (
              <Text className="mt-2 text-sm leading-5 text-red-500">
                {customError}
              </Text>
            ) : null}

            <TouchableOpacity
              onPress={handleCompleteAccount}
              disabled={isLoading}
              className="mt-5 h-14 items-center justify-center rounded-2xl bg-gray-400"
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-base font-bold text-white">
                  Complete Account
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGoBack}
              disabled={isLoading}
              className="mt-5 items-center py-2"
            >
              <Text className="font-semibold text-gray-600">Go back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  /*
   * STEP 2:
   * Email verification
   */
  if (pendingVerification) {
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
            <View className="mb-8">
              <Text className="text-3xl font-bold text-gray-900">
                Verify your email
              </Text>

              <Text className="mt-2 text-base leading-6 text-gray-500">
                Enter the 6-digit code we sent to your email.
              </Text>

              <Text className="mt-2 text-sm font-semibold text-gray-900">
                {email.trim()}
              </Text>
            </View>

            <View>
              <Text className="mb-2 text-sm font-semibold text-gray-700">
                Verification code
              </Text>

              <TextInput
                value={code}
                onChangeText={(value) => {
                  setCode(value.replace(/[^0-9]/g, ""));
                  setCustomError("");
                }}
                placeholder="Enter 6-digit code"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="oneTimeCode"
                maxLength={6}
                className="h-14 rounded-2xl bg-gray-100 px-4 text-base text-gray-900"
              />

              {customError ? (
                <Text className="mt-2 text-sm leading-5 text-red-500">
                  {customError}
                </Text>
              ) : null}

              {errors?.fields?.code?.message ? (
                <Text className="mt-2 text-sm leading-5 text-red-500">
                  {errors.fields.code.message}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={handleVerify}
              disabled={isLoading || code.trim().length !== 6}
              className="mt-5 h-14 items-center justify-center rounded-2xl bg-gray-400"
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-base font-bold text-white">
                  Verify Email
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGoBack}
              disabled={isLoading}
              className="mt-5 items-center py-2"
            >
              <Text className="font-semibold text-gray-600">Go back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  /*
   * STEP 1:
   * Email + password
   */
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
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900">
              Create your account
            </Text>

            <Text className="mt-2 text-base leading-6 text-gray-500">
              Start managing your subscriptions in one place.
            </Text>
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm font-semibold text-gray-700">
              Email
            </Text>

            <TextInput
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setCustomError("");
              }}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              className="h-14 rounded-2xl bg-gray-100 px-4 text-base text-gray-900"
            />

            {errors?.fields?.emailAddress?.message ? (
              <Text className="mt-2 text-sm text-red-500">
                {errors.fields.emailAddress.message}
              </Text>
            ) : null}
          </View>

          <View className="mb-2">
            <Text className="mb-2 text-sm font-semibold text-gray-700">
              Password
            </Text>

            <TextInput
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setCustomError("");
              }}
              placeholder="Create a password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
              className="h-14 rounded-2xl bg-gray-100 px-4 text-base text-gray-900"
            />

            <Text className="mt-2 text-xs text-gray-500">
              Use at least 15 characters.
            </Text>

            {errors?.fields?.password?.message ? (
              <Text className="mt-2 text-sm text-red-500">
                {errors.fields.password.message}
              </Text>
            ) : null}
          </View>

          {errors?.global?.[0]?.message ? (
            <Text className="mt-2 text-sm text-red-500">
              {errors.global[0].message}
            </Text>
          ) : null}

          {customError ? (
            <Text className="mt-2 text-sm leading-5 text-red-500">
              {customError}
            </Text>
          ) : null}

          <TouchableOpacity
            onPress={handleSignUp}
            disabled={isLoading || !email.trim() || !password}
            className="mt-5 h-14 items-center justify-center rounded-2xl bg-gray-400"
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-base font-bold text-white">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          <View className="mt-6 flex-row justify-center">
            <Text className="text-gray-500">Already have an account? </Text>

            <Link href="/(auth)/SignIn">
              <Text className="font-bold text-gray-900">Sign In</Text>
            </Link>
          </View>

          <View nativeID="clerk-captcha" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
