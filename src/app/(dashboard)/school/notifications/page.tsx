import { NotificationCentre } from '@/components/common/Notifications';
import { seedNotifications, typeFilterGroups } from '@/lib/schoolNotificationData';

export default function NotificationsRoute() {
  return (
    <NotificationCentre
      notifications={seedNotifications}
      typeFilterGroups={typeFilterGroups}
      title="Notifications"
      description="Alerts about your surveys, reports, and account."
    />
  );
}
