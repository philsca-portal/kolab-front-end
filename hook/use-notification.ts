import { create } from 'zustand'

type Notification = {
  id: string;
  sendersInfo: {
    id: string;
    name: string | null;
    hashedPassword: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    bio: string | null;
    skill: string | null;
  } | null;
  teamId: string;
  userId: string;
  type: 'TASK_ASSIGNED' | 'INVITATION' | 'GENERAL';
  content: string;
  invitationStatus: string | null;
  status: 'READ' | 'UNREAD';
  createdAt: string;
};

type NotificationStore = {
  notifications: Notification[];
  addNotification: (notification: Notification[]) => void;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
};

const useNotification = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) => set({ notifications: notification }),
  markNotificationAsRead: async (notificationId) => {
    try {
      set((state) => ({
        notifications: state.notifications.map((notification) =>
          notification.id === notificationId ? { ...notification, status: 'READ' } : notification
        ),
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },
}));

export default useNotification;
