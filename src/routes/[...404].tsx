import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <div class="min-h-screen bg-primary_color_4 flex flex-col justify-center items-center p-4">
      <div class="text-center max-w-2xl mx-auto p-8 rounded-xl shadow-2xl bg-white">
        <div class="text-9xl font-bold text-primary_color_4 mb-4">404</div>
        <h1 class="text-4xl font-bold text-primary_color_4 mb-6">페이지를 찾을 수 없습니다</h1>
        <div class="relative w-full h-1 bg-gradient-to-r from-primary_color_2 to-primary_color_3 mx-auto my-8 rounded-full">
          {/* <div class="absolute -top-2 -right-2 w-4 h-4 bg-primary_color_3 rounded-full animate-ping"></div> */}
        </div>
        <p class="text-gray-600 mb-8 text-lg">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          <br />
          주소를 다시 한번 확인해 주시기 바랍니다.
        </p>
        <div class="space-x-4">
          <A href="/" class="inline-block px-6 py-3 bg-primary_color_4 text-white rounded-lg hover:bg-primary_color_3 transition-colors duration-300 font-medium shadow-md hover:shadow-lg">
            홈으로 가기
          </A>
        </div>
        <div class="mt-8 text-sm text-gray-400">
          <p>문제가 계속되면 관리자에게 문의해 주세요.</p>
        </div>
      </div>
    </div>
  );
}
