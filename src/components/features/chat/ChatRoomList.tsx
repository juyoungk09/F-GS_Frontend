import { For, createSignal } from 'solid-js';
import ChatRoomItem from './ChatRoomItem';
import { useParams } from '@solidjs/router';

const mockChatRooms: ChatListItem[] = [
  {
    userId: '1',
    userName: '프로젝트 A assssssssssssssssssssssssssssssss팀',
    lastMessage: '내일 회의 일정assssssssssssssssssssssssssssssssssssss 확인해주세요',
    lastMessageAt: '12   :30',
    unreadCount: 3,
    profilePath: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    userId: '2',
    userName: '디자인 팀',
    lastMessage: '새로운 와이어프레임 올렸어요',
    lastMessageAt: '10:15',
    unreadCount: 0,
    profilePath: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    userId: '3',
    userName: '개발팀 전체',
    lastMessage: '오늘의 스크럼 회의록입니다',
    lastMessageAt: '어제',
    unreadCount: 7,
    profilePath: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    userId: '4',
    userName: '기획 회의',
    lastMessage: '요구사항 정리본 공유드립니다',
    lastMessageAt: '월',
    unreadCount: 0,
    profilePath: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    userId: '5',
    userName: '디자인 팀',
    lastMessage: '새로운 와이어프레임 올렸어요',
    lastMessageAt: '10:15',
    unreadCount: 0,
    profilePath: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
];

const ChatRoomList = () => {
    const fetchPosts = () : Array<ChatListItem> => {return mockChatRooms};
    const [rooms] = createSignal<Array<ChatListItem>>(fetchPosts());
    const [searchQuery, setSearchQuery] = createSignal<string>('');
    const params = useParams(); 
    const [activeRoomId, setActiveRoomId] = createSignal<string | null>(params.user_id);
    const filteredRooms = () => { // 실시간 검색
      const query = searchQuery().toLowerCase();
      return rooms().filter(room => 
        room.userName.toLowerCase().includes(query) || 
        room.lastMessage.toLowerCase().includes(query)
      );
  };
  return (
    <div class=" w-32 sm:w-64 md:w-80 border-r overflow-y-auto border-gray-200 bg-white h-[calc(100vh-64px)] flex flex-col">
        <div class="p-4 hidden sm:block border-b border-gray-200">
            <h1 class="text-xl font-bold text-gray-800">채팅</h1>
            <div class="mt-3 relative">
            <input type="search" placeholder="채팅방 검색" class="w-full p-2 pl-10 rounded-lg border text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary_color_3 focus:border-transparent" value={searchQuery()} onInput={(e) => setSearchQuery(e.currentTarget.value)} />
            <i class="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
        </div>
        <div class="flex-1 shrink-0 min-h-64 overflow-y-auto">
          <For each={filteredRooms()}>
            {(room) => (<ChatRoomItem room={room} activeRoomId={activeRoomId} setActiveRoomId={setActiveRoomId} /> )}
          </For>
      </div>
      <div class="p-4 border-t hidden sm:block border-gray-200">
        <button class="w-full text-xs whitespace-pre-line overflow-wrap break-words bg-primary_color_3 hover:bg-primary_color_2 text-white py-2 px-4 rounded-lg transition-colors">
          새 채팅 시작하기
        </button>
      </div>
    </div>
  );
};
export default ChatRoomList;