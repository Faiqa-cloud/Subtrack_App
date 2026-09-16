import { useClerk, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { styled } from "nativewind";
import { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(
    user?.primaryEmailAddress?.emailAddress ?? "",
  );
  const [isSaving, setIsSaving] = useState(false);

  const displayName =
    user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "Your account";
  const displayEmail =
    user?.primaryEmailAddress?.emailAddress ?? "No email available";

  const saveProfile = async () => {
    if (!user || !name.trim() || !email.trim()) return;
    setIsSaving(true);
    try {
      const nameParts = name.trim().split(/\s+/);
      await user.update({
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" ") || undefined,
      });
      if (email.trim() !== user.primaryEmailAddress?.emailAddress) {
        await user.createEmailAddress({ email: email.trim() });
      }
      setIsEditing(false);
    } catch {
      Alert.alert("Could not save profile", "Check the details and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const changeProfileImage = async () => {
    if (!user) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      await user.setProfileImage({ file: result.assets[0].uri });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      <Text className="mb-6 mt-5 text-3xl font-bold text-[#111827]">
        Settings
      </Text>

      <View className="rounded-3xl bg-[#EEF4FF] p-5">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={changeProfileImage}
            accessibilityLabel="Change profile photo"
          >
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                className="h-14 w-14 rounded-full"
              />
            ) : (
              <View className="h-14 w-14 items-center justify-center rounded-full bg-[#3B82F6]">
                <Ionicons name="person-outline" size={26} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
          <View className="ml-4 flex-1">
            {isEditing ? (
              <>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  className="h-11 rounded-xl bg-white px-3 text-base text-[#111827]"
                />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="Email address"
                  className="mt-2 h-11 rounded-xl bg-white px-3 text-sm text-gray-600"
                />
              </>
            ) : (
              <>
                <Text className="text-lg font-bold text-[#111827]">
                  {displayName}
                </Text>
                <Text className="mt-1 text-sm text-gray-500">
                  {displayEmail}
                </Text>
              </>
            )}
          </View>
          <TouchableOpacity
            onPress={() => setIsEditing((current) => !current)}
            accessibilityLabel="Edit profile"
          >
            <Ionicons
              name={isEditing ? "close" : "create-outline"}
              size={22}
              color="#3B82F6"
            />
          </TouchableOpacity>
        </View>

        {isEditing ? (
          <TouchableOpacity
            onPress={saveProfile}
            disabled={isSaving}
            className="mt-4 h-12 items-center justify-center rounded-2xl bg-[#3B82F6]"
          >
            <Text className="font-bold text-white">
              {isSaving ? "Saving..." : "Save profile"}
            </Text>
          </TouchableOpacity>
        ) : null}

        <View className="my-5 h-px bg-[#D8E5FF]" />

        <TouchableOpacity
          onPress={() => signOut()}
          className="h-14 flex-row items-center justify-center rounded-2xl bg-[#111827]"
        >
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          <Text className="ml-2 font-bold text-white">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
