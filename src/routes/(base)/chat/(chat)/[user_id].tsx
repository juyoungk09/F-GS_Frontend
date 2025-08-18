import { useParams } from "@solidjs/router";
import { createMemo, createResource, createSignal, For, Show, createEffect, onMount } from "solid-js";
import { io } from "socket.io-client";
import { user, setUser } from "~/stores/store";
import Loading from "~/components/layout/Loading";

const Chat = () => {
  const [messages, setMessages] = createSignal<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = createSignal('');
  if (!user.id) return <Loading? />;
  const socket = io('http://localhost:3001/', {
    query: {"userId" : user.id.toString()},
  });  
  onMount(() => {
    socket.emit('join', user.id.toString());
  });
  const fetchChat = async (userId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: userId,
          name: userId === user.id.toString() ? '프로젝트 A 팀' : '개인 채팅방',
          avatar: "https://randomuser.me/api/portraits/men/1.jpg"
        });
      }, 300);
    });
  };
  
  socket.on('connect', () => {
    console.log('connected to chat gateway');
  });
  const params = useParams();
  const userId = createMemo(() => params.user_id);
  // const myId = createMemo(() => user.id);
  // const [chat, {refetch, mutate}] = createResource<string, ChatRoom>(userId(), fetchChat);

  const loadMessages = () => {
    const mockMessages: ChatMessage[] = [
      { id: 1, from:   'other', to: 'me', message: '안녕하세요! 프로젝트는 잘 진행되고 있나요?', createdAt: '10:30', isRead: false },
      { id: 2, from: 'me', to: 'other', message: '네, 거의 다 완성되었어요!', createdAt: '10:32', isRead: false },
      { id: 3, from: 'me', to: 'other', message: '오늘 중으로 완성본 보내드릴게요~', createdAt: '10:32', isRead: false },
    ];
    setMessages(mockMessages);
  };

  const handleSendMessage = () => {
    if (!newMessage().trim()) return;
    const message: ChatMessage = {
      id: Date.now(),
      from: 'me',
      to: 'other',
      message: newMessage(),
      createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };
    setMessages([...messages(), message]);
    setNewMessage('');
    
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const reply: ChatMessage = {
          id: Date.now() + 1,
          from: 'other',
          to: 'me',
          message: '네, 알겠습니다!',
          createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          isRead: false
        };
        setMessages(prev => [...prev, reply]);
      }, 1000);
    }
  };

  let chatRef: HTMLDivElement | undefined;
  createMemo(() => {
    if (userId()) {
      loadMessages();
    }
  });
  createEffect(() => {
    messages(); 
    if (chatRef) {
      chatRef.scrollTop = chatRef.scrollHeight;
    }
  });
  return (
    <div class="flex flex-col w-full h-[calc(100vh-64px)] overflow-y-auto bg-gray-50">
      <header class="bg-white shadow-sm p-4 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <img 
            src={"https://randomuser.me/api/portraits/men/1.jpg"} 
            alt={userId()} 
            class="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h1 class="font-semibold text-gray-900">{userId()}</h1>
            <p class="text-xs text-gray-500">{userId()}</p>
          </div>
        </div>
      </header>

      <div ref={chatRef} class="flex-1 overflow-y-auto p-4 space-y-4">
        <Show when={!chat.loading} fallback={<Loading />}>
          <For each={messages()}>
            {(message) => (
              <div class={`flex ${message.from === myId() ? 'justify-end' : 'justify-start'}`}>
                <div 
                  class={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.from === myId()
                      ? 'bg-primary_color_3 text-white rounded-tr-none' 
                      : 'bg-white text-primary_color_3 border border-gray-200 t rounded-tl-none'
                  }`}
                >
                  <p class="text-sm whitespace-pre-wrap overflow-wrap break-words" >{message.message}</p>
                  <p class={`text-xs mt-1 wh ${message.from === myId() ? 'text-primary_color_1' : 'text-gray-400'} text-right`}>
                    {message.createdAt}
                  </p>
                </div>
              </div>
            )}
          </For>
        </Show>
      </div>

      {/* 입력 */}
      <div class="bg-white border-t border-gray-200 p-4">
        <div class="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage()}
            onInput={(e) => setNewMessage(e.currentTarget.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="메시지를 입력하세요..."
            class="flex-1 p-2 border text-xs border-gray-300 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary_color_3 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            class="p-2 text-primary_color_3 hover:text-blue-700"
            disabled={!newMessage().trim()}
          >
            <i class="bi bi-send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;