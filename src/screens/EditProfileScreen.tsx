import { useState } from "react";
import { cardShadow } from "../theme/shadows";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScreenContainer } from "@/components";
import { Card } from "@/components/ui/Card";
import { authApi } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";


export function EditProfileScreen() {
  const { user, setUser } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [department, setDepartment] = useState(user?.department ?? "");
  const [designation, setDesignation] = useState(user?.designation ?? "");

  const [nameError, setNameError] = useState("");

  const validate = (): boolean => {
    let valid = true;
    if (!name.trim()) {
      setNameError("Name is required");
      valid = false;
    } else {
      setNameError("");
    }
    return valid;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      const response = await authApi.updateProfile({
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        department: department.trim() || undefined,
        designation: designation.trim() || undefined,
      });

      setUser(response.user);
      Alert.alert("Profile Updated", "Your profile has been updated successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to update profile";
      Alert.alert("Error", message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
      <View className="flex-1 bg-surface-background">
        {/* Header */}
        <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              className="w-9 h-9 bg-slate-100 rounded-full items-center justify-center"
              activeOpacity={0.7}
              onPress={handleCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
            >
              <Ionicons name="close-outline" size={20} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-slate-900 text-[18px] font-semibold">Edit Profile</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleSave}
              disabled={isSaving}
              accessibilityRole="button"
              accessibilityLabel="Save"
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#4F46E5" />
              ) : (
                <Text className="text-primary-600 text-sm font-semibold">Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Personal Info */}
            <View className="pt-4">
              <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 px-0.5">
                Personal Information
              </Text>
              <Card padding="md">
                <FormField
                  label="Full Name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Your full name"
                  error={nameError}
                />
                <View className="h-px bg-surface-border" />
                <FormField
                  label="Phone"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Phone number"
                  keyboardType="phone-pad"
                />
                <View className="h-px bg-surface-border" />
                <FormField
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Card>
            </View>

            {/* Work Info */}
            <View className="mt-6">
              <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 px-0.5">
                Work Information
              </Text>
              <Card padding="md">
                <FormField
                  label="Department"
                  value={department}
                  onChangeText={setDepartment}
                  placeholder="Department"
                />
                <View className="h-px bg-surface-border" />
                <FormField
                  label="Designation"
                  value={designation}
                  onChangeText={setDesignation}
                  placeholder="Designation"
                />
              </Card>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ScreenContainer>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string;
}) {
  return (
    <View className="py-1">
      <Text className="text-slate-500 text-xs font-medium mb-1.5">{label}</Text>
      <TextInput
        className={`text-slate-900 text-sm bg-slate-50 rounded-xl px-3.5 py-2.5 border ${error ? "border-red-300" : "border-surface-border"}`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#CBD5E1"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}
