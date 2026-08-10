import { HomeworkItem } from "@/types";

export type HomeworkStatusLabel = "Upcoming" | "Due Today" | "Overdue" | "Completed";

export function getHomeworkStatusLabel(homework: HomeworkItem): HomeworkStatusLabel {
  if (homework.status === "submitted") return "Completed";
  if (homework.status === "overdue") return "Overdue";

  const due = new Date(homework.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  if (due.getTime() === today.getTime()) return "Due Today";
  return "Upcoming";
}

export function getHomeworkStatusColor(label: HomeworkStatusLabel): string {
  switch (label) {
    case "Upcoming":   return "#D97706";
    case "Due Today":  return "#D97706";
    case "Overdue":    return "#DC2626";
    case "Completed":  return "#22C55E";
  }
}

export function getHomeworkStatusTint(label: HomeworkStatusLabel): string {
  switch (label) {
    case "Upcoming":   return "#FFFBEB";
    case "Due Today":  return "#FFFBEB";
    case "Overdue":    return "#FEF2F2";
    case "Completed":  return "#F0FDF4";
  }
}
