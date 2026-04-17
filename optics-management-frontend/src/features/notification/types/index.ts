export interface NotificationItem {
  id: string;
  recipientId: string;
  recipientName: string;
  title: string;
  content: string;
  senderId: string;
  createdAt: string;
  readAt: string | null;
  read: boolean;
}
