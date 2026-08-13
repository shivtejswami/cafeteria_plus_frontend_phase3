export type NotificationType = "action_required" | "attention" | "info" | "success";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  meta: string;
  isRead: boolean;
  actionLabel?: string;
  actionHref?: string;
}

export interface NotificationGroup {
  id: string;
  title: string;
  items: NotificationItem[];
}
