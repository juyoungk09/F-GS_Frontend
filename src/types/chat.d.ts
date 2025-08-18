type ChatMessage = {
  id: number;
  from: string;
  to: string;
  message: string;
  createdAt: string;  
  isRead: boolean;
};
type SendMessage = {
  to: string;
  content: string;
};
type ChatListItem = {
  userId: string;
  userName: string;
  profilePath: string;
  lastMessage: string;
  lastMessageAt: string; 
  unreadCount: number;
};
