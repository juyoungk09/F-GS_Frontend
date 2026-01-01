import { useParams } from "@solidjs/router";
import { createMemo, createResource, createSignal, For, Show, createEffect, onMount } from "solid-js";
import { io, Socket } from "socket.io-client";
import { user, setUser } from "~/stores/store";
import Loading from "~/components/layout/Loading";
import { useNavigate } from "@solidjs/router";
import axios from "axios";
import { BASE_URL } from "~/stores/store";

const Chat = () => {

  const navigate = useNavigate();
  if(!user.id) navigate("/"); 
  const params = useParams();
  const userId = createMemo(() => params.user_id);
  const [otherUser, {refetch : otherUserRefetch}] = createResource<UserInform>(async () => {
    const response = await axios.get(`${BASE_URL}/users/i/${userId()}`, { withCredentials: true });
    return response.data;
  });
  const [socket, setSocket] = createSignal<Socket | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [pullMessages, {refetch : pullMessagesRefetch}] = createResource<ChatMessage[]>(async () => {
    const response = await axios.get(`https://fg.sunrin.kr/ws/messages/user/${userId()}`, { withCredentials: true });
    console.log( "Error",response.data)
    if(response.data.length === 0){
        navigate("/")
    }
    setMessages(response.data);
    return (await response.data) as ChatMessage[];
});
  const [messages, setMessages] = createSignal<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = createSignal('');
  createEffect( async () => {
    userId();
    if (!user.id) {
      navigate('/login');
      return;
    }
    otherUserRefetch();
    pullMessagesRefetch();
    console.log(user.id); // undefined
    // Initialize socket with proper URL and options
    const socket = io('wss://fg.sunrin.kr', {
      path: '/ws/socket',
      transports: ['websocket'],
      query: { userId: user.id.toString() },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socket.on('connect', () => {
      console.log('Connected to chat server');
      setIsLoading(false);
      socket.emit('join', user?.id?.toString());
    });

    socket.on('connect_error', (error) => {
      console.error('Connection Error:', error);
      setIsLoading(false);
    });

    socket.on('message', (message: ChatMessage) => {
      console.log('New message from server:', message);
      setMessages(prev => [...prev, message]);
    });

    setSocket(socket);

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  });
  
  const handleSendMessage = () => {
    if (!newMessage().trim()) return;
    const message: ChatMessage = {
      id: Date.now(),
      from: user.id?.toString()!,
      to: userId(),
      message: newMessage(),
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setNewMessage('');
    socket()?.emit('message', message);
  };

  let chatRef: HTMLDivElement | undefined;

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
            src={BASE_URL+"/public/"+otherUser()?.profile_path} 
            alt={otherUser()?.name} 
            class="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h1 class="font-semibold text-gray-900">{otherUser()?.name}</h1>
            <p class="text-xs text-gray-500">{userId()}</p>
          </div>
        </div>
      </header>

      <div ref={chatRef} class="flex-1 overflow-y-auto p-4 space-y-4">
        <For each={messages()}>
            {(message) => (
              <div class={`flex ${message.from === user.id?.toString() ? 'justify-end' : 'justify-start'}`}>
                <div 
                  class={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.from === user.id?.toString()
                      ? 'bg-primary_color_3 text-white rounded-tr-none' 
                      : 'bg-white text-primary_color_3 border border-gray-200 t rounded-tl-none'
                  }`}
                >
                  <p class="text-sm whitespace-pre-wrap overflow-wrap break-words" >{message.message}</p>
                  <p class={`text-xs mt-1 wh ${message.from === user.id?.toString() ? 'text-primary_color_1' : 'text-gray-400'} text-right`}>
                    {/* {message.createdAt} */}
                    {new Date(message.createdAt).toLocaleDateString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )}
          </For>
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