import { A } from "@solidjs/router";
const NotFound = () => {
    return (
        <div class="flex bg-gray-50 items-center justify-center h-screen">
            <div class="text-center">
                <h1 class="text-5xl text-primary_color_4 font-bold mb-4">404</h1>
                <p class="text-gray-600 mb-4">페이지를 찾을 수 없습니다.</p>
                <A href="/" class="text-primary_color_4 rounded-full bg-primary_color_3 px-6 py-2 hover:bg-primary_color_2/100 transition-colors">홈으로 돌아가기</A>
            </div>
        </div>
    );
}
export default NotFound;