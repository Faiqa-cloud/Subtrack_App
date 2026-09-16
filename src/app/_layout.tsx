import { ClerkProvider, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, usePathname } from "expo-router";
import {
  PostHogErrorBoundary,
  PostHogProvider,
  usePostHog,
} from "posthog-react-native";
import { Text, View } from "react-native";
import { useEffect, useRef } from "react";
import { posthog } from "../lib/posthog";
import "./global.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is missing from .env");
}

const RootErrorFallback = () => (
  <View>
    <Text>Something went wrong. Please restart the app.</Text>
  </View>
);

const PostHogIdentity = () => {
  const posthogClient = usePostHog();
  const { isLoaded, user } = useUser();
  const distinctId = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!user) {
      if (distinctId.current) {
        posthogClient.reset();
        distinctId.current = null;
      }
      return;
    }

    if (distinctId.current === user.id) {
      return;
    }

    if (distinctId.current) {
      posthogClient.reset();
    }

    posthogClient.identify(user.id, {
      $set: {
        ...(user.primaryEmailAddress?.emailAddress
          ? { email: user.primaryEmailAddress.emailAddress }
          : {}),
        ...(user.firstName ? { first_name: user.firstName } : {}),
        ...(user.lastName ? { last_name: user.lastName } : {}),
      },
    });
    distinctId.current = user.id;
  }, [isLoaded, posthogClient, user]);

  return null;
};

const PostHogScreenTracker = () => {
  const posthogClient = usePostHog();
  const pathname = usePathname();

  useEffect(() => {
    posthogClient.screen(pathname);
  }, [pathname, posthogClient]);

  return null;
};

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../../assets/fonts/Inter_24pt-Regular.ttf"),
    "Inter-SemiBold": require("../../assets/fonts/Inter_24pt-SemiBold.ttf"),
    "Inter-Bold": require("../../assets/fonts/Inter_28pt-Bold.ttf"),
    "Inter-ThinItalic": require("../../assets/fonts/Inter_28pt-ThinItalic.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  });
  if (!fontsLoaded) return null;
  const content = <Stack screenOptions={{ headerShown: false }} />;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {posthog ? (
        <PostHogProvider client={posthog}>
          <PostHogIdentity />
          <PostHogScreenTracker />
          <PostHogErrorBoundary fallback={RootErrorFallback}>
            {content}
          </PostHogErrorBoundary>
        </PostHogProvider>
      ) : (
        content
      )}
    </ClerkProvider>
  );
};

export default RootLayout;
