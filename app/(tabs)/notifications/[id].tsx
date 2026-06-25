import { router, useLocalSearchParams } from "expo-router";
import { NotificationDetailScreen } from "@/screens";
import { EmptyState, ScreenContainer } from "@/components";
import type { NotificationItem } from "@/types";

function getParam(value: string | string[] | undefined, fallback = "") {
  return Array.isArray(value) ? value[0] ?? fallback : value ?? fallback;
}

export default function NotificationDetail() {
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    body?: string;
    type?: NotificationItem["type"];
    is_read?: string;
    created_at?: string;
  }>();

  const id = getParam(params.id);

  if (!id) {
    return (
      <ScreenContainer>
        <EmptyState
          icon="notifications-off-outline"
          title="Notification not found"
          message="Go back and choose another alert."
          actionLabel="Go Back"
          onAction={() => router.back()}
        />
      </ScreenContainer>
    );
  }

  const notification: NotificationItem = {
    id,
    title: getParam(params.title, "Notification"),
    message: getParam(params.body),
    type: getParam(params.type, "system") as NotificationItem["type"],
    isRead: getParam(params.is_read) === "true",
    createdAt: getParam(params.created_at, new Date().toISOString()),
    readAt: null,
  };

  const route = {
    key: `notification-${id}`,
    name: "NotificationDetail" as const,
    params: { notification },
  };

  const navigation = {
    goBack: () => router.back(),
  };

  return (
    <NotificationDetailScreen
      navigation={navigation as never}
      route={route as never}
    />
  );
}
