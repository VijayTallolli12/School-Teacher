import { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScreenContainer } from "@/components";
import { Card } from "@/components/ui/Card";
import { cardShadow } from "@/theme/shadows";
import { useDocuments } from "@/hooks/useDocuments";
import type { DocumentItem } from "@/types";

function formatSize(bytes: number): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function fileIcon(fileType: string): keyof typeof Ionicons.glyphMap {
  const t = (fileType ?? "").toLowerCase();
  if (t.includes("pdf")) return "document-text-outline";
  if (t.includes("image") || t.includes("png") || t.includes("jpg") || t.includes("jpeg")) return "image-outline";
  if (t.includes("word") || t.includes("doc")) return "document-text-outline";
  if (t.includes("sheet") || t.includes("excel") || t.includes("xls")) return "grid-outline";
  if (t.includes("zip")) return "archive-outline";
  return "document-outline";
}

export function DocumentsScreen() {
  const { data: documents, isLoading, isError, refetch, isRefetching } = useDocuments();

  const handleOpen = useCallback((doc: DocumentItem) => {
    if (!doc?.fileUrl) {
      Alert.alert("Unavailable", "This document has no downloadable file.");
      return;
    }
    Linking.openURL(doc.fileUrl).catch(() => {
      Alert.alert("Error", "Could not open this document. Check your connection and try again.");
    });
  }, []);

  return (
    <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
      <View className="flex-1 bg-surface-background">
        <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
          <View className="flex-row items-center">
            <TouchableOpacity
              className="w-8 h-8 rounded-full items-center justify-center mr-2"
              activeOpacity={0.7}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="close" size={22} color="#334155" />
            </TouchableOpacity>
            <Text className="text-slate-900 text-[18px] font-semibold">Documents</Text>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#4F46E5" colors={["#4F46E5"]} />
          }
        >
          {isLoading ? (
            <View className="pt-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <View key={i} className="rounded-2xl bg-white border border-surface-border p-4" style={cardShadow}>
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-xl bg-slate-200 mr-3" />
                    <View className="flex-1 gap-1.5">
                      <View className="h-3.5 w-36 bg-slate-200 rounded" />
                      <View className="h-3 w-24 bg-slate-100 rounded" />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : isError ? (
            <View className="items-center justify-center pt-20 pb-8">
              <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="cloud-offline-outline" size={32} color="#DC2626" />
              </View>
              <Text className="text-slate-800 text-lg font-bold text-center mb-2">Unable to Load Documents</Text>
              <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px] mb-6">
                Pull down to retry or tap the button below.
              </Text>
              <TouchableOpacity
                className="flex-row items-center bg-primary-600 px-6 py-3 rounded-xl"
                activeOpacity={0.7}
                onPress={() => refetch()}
                accessibilityRole="button"
                accessibilityLabel="Retry"
              >
                <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
                <Text className="text-white font-semibold text-sm ml-2">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : !documents || documents.length === 0 ? (
            <View className="items-center justify-center pt-20 pb-8">
              <View className="w-16 h-16 bg-slate-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="folder-open-outline" size={32} color="#CBD5E1" />
              </View>
              <Text className="text-slate-700 text-sm font-semibold text-center">No documents found</Text>
              <Text className="text-slate-400 text-xs mt-1 text-center leading-5 max-w-[240px]">
                Shared documents and attachments will appear here.
              </Text>
            </View>
          ) : (
            <View className="pt-4 gap-3">
              {documents.map((doc, index) => (
                <Card key={doc?.id ?? `doc-${index}`} padding="md" onPress={() => handleOpen(doc)} style={cardShadow}>
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: "#EEF2FF" }}>
                      <Ionicons name={fileIcon(doc?.fileType ?? "")} size={18} color="#4F46E5" />
                    </View>
                    <View className="flex-1 min-w-0 mr-2">
                      <Text className="text-slate-800 text-sm font-bold" numberOfLines={1}>
                        {doc?.title ?? "Untitled document"}
                      </Text>
                      <Text className="text-slate-400 text-xs mt-0.5" numberOfLines={1}>
                        {[doc?.category, formatSize(doc?.size ?? 0), formatDate(doc?.uploadedAt ?? "")]
                          .filter(Boolean)
                          .join(" · ") || "Document"}
                      </Text>
                    </View>
                    <View className="w-9 h-9 bg-slate-50 rounded-full items-center justify-center">
                      <Ionicons name="open-outline" size={16} color="#94A3B8" />
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
