import { RouteSectionProps } from "@solidjs/router";
import ChatRoomList from "~/components/features/chat/ChatRoomList";
const ChatLayout = (props: RouteSectionProps) => {
    return (
        <div class="flex w-full h-full">
            <ChatRoomList />
            {props.children}
        </div>
    );
}
export default ChatLayout;