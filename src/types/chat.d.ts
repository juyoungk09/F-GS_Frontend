type ChatMessage = {
  id: number;
  from: string;
  to: string;
  message: string;
  createdAt: string;  
  isRead: boolean;
};
type SendMessageDto = {
  to: string;
  content: string;
};
type ChatListItemDto = {
  userId: string;
  userName: string;
  profilePath: string;
  lastMessage: string;
  lastMessageAt: string; 
  unreadCount: number;
};
