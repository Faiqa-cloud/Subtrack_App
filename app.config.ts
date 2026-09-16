import type { ExpoConfig } from "expo/config";

const appConfig = require("./app.json").expo as ExpoConfig;

export default (): ExpoConfig => ({
  ...appConfig,
  extra: {
    ...appConfig.extra,
    posthogProjectToken: process.env.EXPO_PUBLIC_POSTHOG_KEY,
    posthogHost: process.env.EXPO_PUBLIC_POSTHOG_HOST,
  },
});
