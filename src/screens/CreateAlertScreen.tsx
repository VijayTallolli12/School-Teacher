import { useCallback, useState } from "react";
import { cardShadow } from "../theme/shadows";
import { ActivityIndicator, Alert as RNAlert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScreenContainer } from "@/components";
import { useCreateAlert } from "@/hooks/useNotifications";


const PRIORITIES = [
  { value: "low" as const, label: "Low", color: "#22C55E", tint: "#F0FDF4" },
  { value: "medium" as const, label: "Medium", color: "#D97706", tint: "#FFFBEB" },
  { value: "high" as const, label: "High", color: "#DC2626", tint: "#FEF2F2" },
];

export function CreateAlertScreen() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate: createAlert, isPending } = useCreateAlert();

  const handleBack = useCallback(() => router.back(), []);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required";
    if (!message.trim()) e.message = "Message is required";
    if (!audience.trim()) e.audience = "Audience is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    createAlert(
      { title: title.trim(), message: message.trim(), audience: audience.trim(), priority },
      {
        onSuccess: () => {
          RNAlert.alert("Success", "Alert created successfully", [
            { text: "OK", onPress: () => router.back() },
          ]);
        },
        onError: (err) => {
          RNAlert.alert("Error", err?.message ?? "Failed to create alert");
        },
      },
    );
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  return (
    <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
      <View className="flex-1 bg-surface-background">
        {/* Header */}
        <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
          <View className="flex-row items-center">
            <TouchableOpacity
              className="w-9 h-9 items-center justify-center -ml-1 mr-2"
              onPress={handleBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={22} color="#4F46E5" />
            </TouchableOpacity>
            <Text className="text-slate-900 text-[18px] font-semibold">Create Alert</Text>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="pt-4 gap-5">
            {/* Title */}
            <View>
              <Text className="text-slate-700 text-sm font-semibold mb-1.5">Title *</Text>
              <TextInput
                className={`bg-white border rounded-xl px-4 py-3 text-slate-800 text-sm ${errors.title ? "border-status-error" : "border-surface-border"}`}
                style={cardShadow}
                value={title}
                onChangeText={(v) => { setTitle(v); clearError("title"); }}
                placeholder="Enter alert title"
                placeholderTextColor="#94A3B8"
              />
              {errors.title && <Text className="text-status-error text-xs mt-1">{errors.title}</Text>}
            </View>

            {/* Message */}
            <View>
              <Text className="text-slate-700 text-sm font-semibold mb-1.5">Message *</Text>
              <TextInput
                className={`bg-white border rounded-xl px-4 py-3 text-slate-800 text-sm min-h-[120px] ${errors.message ? "border-status-error" : "border-surface-border"}`}
                style={cardShadow}
                value={message}
                onChangeText={(v) => { setMessage(v); clearError("message"); }}
                placeholder="Enter alert message"
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
              {errors.message && <Text className="text-status-error text-xs mt-1">{errors.message}</Text>}
            </View>

            {/* Audience */}
            <View>
              <Text className="text-slate-700 text-sm font-semibold mb-1.5">Audience *</Text>
              <TextInput
                className={`bg-white border rounded-xl px-4 py-3 text-slate-800 text-sm ${errors.audience ? "border-status-error" : "border-surface-border"}`}
                style={cardShadow}
                value={audience}
                onChangeText={(v) => { setAudience(v); clearError("audience"); }}
                placeholder="e.g., All Students, Class 10-A"
                placeholderTextColor="#94A3B8"
              />
              {errors.audience && <Text className="text-status-error text-xs mt-1">{errors.audience}</Text>}
            </View>

            {/* Priority */}
            <View>
              <Text className="text-slate-700 text-sm font-semibold mb-1.5">Priority *</Text>
              <View className="flex-row gap-2">
                {PRIORITIES.map((p) => {
                  const isActive = priority === p.value;
                  return (
                    <TouchableOpacity
                      key={p.value}
                      className={`flex-1 rounded-xl px-4 py-2.5 items-center border ${isActive ? "border-0" : "bg-white border-surface-border"}`}
                      style={isActive ? { backgroundColor: p.tint } : cardShadow}
                      activeOpacity={0.7}
                      onPress={() => setPriority(p.value)}
                      accessibilityRole="button"
                      accessibilityLabel={`Priority: ${p.label}`}
                      accessibilityState={{ selected: isActive }}
                    >
                      <Text
                        className={`text-xs font-semibold ${isActive ? "" : "text-slate-500"}`}
                        style={isActive ? { color: p.color } : undefined}
                      >
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity
              className={`flex-row items-center justify-center py-3.5 rounded-xl ${isPending ? "bg-primary-400" : "bg-primary-600"}`}
              activeOpacity={0.7}
              onPress={handleSubmit}
              disabled={isPending}
              accessibilityRole="button"
              accessibilityLabel="Create alert"
            >
              {isPending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="paper-plane-outline" size={18} color="#FFFFFF" />
                  <Text className="text-white font-semibold text-sm ml-2">Create Alert</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
