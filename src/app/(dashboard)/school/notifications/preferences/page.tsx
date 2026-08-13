import { NotificationPreferencesPage } from '@/components/common/Notifications';
import { schoolNotificationGroups, accountEmail } from '@/lib/schoolNotificationData';

export default function NotificationPreferencesRoute() {
  return (
    <NotificationPreferencesPage
      groups={schoolNotificationGroups}
      accountEmail={accountEmail}
      accountHref="/school/my-account"
    />
  );
}
