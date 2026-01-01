
import { A } from "@solidjs/router";
const Chat = () => {
    return (
        <div class="flex flex-col w-full h-[calc(100vh-64px)] bg-gray-50 items-center justify-center p-4">
            <div class="text-center max-w-md w-full">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="bi bi-chat-dots text-2xl text-blue-500"></i>
                </div>
                <h2 class="text-xl font-semibold text-gray-800 mb-2">채팅을 시작해보세요</h2>
                <p class="text-gray-500 mb-6">대화를 시작하려면 왼쪽에서 채팅방을 선택하거나 새로 만드세요.</p>
              
            </div>
            </div>
        </div>
    );
}
export default Chat;