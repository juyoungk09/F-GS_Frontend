import { A } from "@solidjs/router";
const ChatRoomItem = ({ room, activeRoomId, setActiveRoomId }: { room: any, activeRoomId: () => string | null, setActiveRoomId: (id: string) => void }) => {
    
    return (
        <A href={`/chat/${room.id}`} class={`block rounded-lg p-4 border-b border-gray-100 transition-colors cursor-pointer ${
          activeRoomId() == room.id ? 'bg-primary_color_2' : ''
        }`} onClick={() => setActiveRoomId(room.id)}>
        <div class="flex items-start">
          <img src={room.avatar} alt={room.name} class="w-12 h-12 rounded-full object-cover mr-3" />
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline">
              <h3 class="font-bold text-black truncate">{room.name}</h3>
              <span class="text-xs text-gray-500 whitespace-nowrap ml-2">{room.time}</span>
            </div>
            <p class="text-sm text-black truncate">{room.lastMessage}</p>
          </div>
          {room.unread > 0 && (
            <span class="ml-2 bg-primary_color_3 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {room.unread}
            </span>
          )}
        </div>
      </A>
    );
}
export default ChatRoomItem;