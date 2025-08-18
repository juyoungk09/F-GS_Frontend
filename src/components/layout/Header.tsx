import { A, useLocation } from "@solidjs/router";
import { Show } from "solid-js";
import { BASE_URL, user } from "~/stores/store";
export default function Header({hamberger, setHamberger}: {hamberger: () => boolean, setHamberger: (hamberger: boolean) => void}) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header class="bg-primary_color_4 truncate sticky top-0 flex justify-center shadow-md w-full z-100">
      <div class="w-screen">
        <div class="flex items-center justify-between h-16 px-4">
          <div class="flex-shrink-0 flex items-center">
            <button class="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-primary_color_3 focus:outline-none" onClick={() => setHamberger(!hamberger())}>
              <span class="sr-only">메인 메뉴 열기</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <A href="/" class="text-2xl font-bold flex items-center text-white hover:text-primary_color_2 transition-colors">
              <img src="/logo.svg" class="w-8 h-8" alt="logo" />
              <span class="ml-2">F&GS</span>
            </A>
          </div>

          <nav class="hidden md:flex space-x-1">
            <A href="/" class={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/") ? "bg-primary_color_3 text-white" : "text-gray-200 hover:bg-primary_color_3/50 hover:text-white"} transition-colors`}>
              홈
            </A>
            <A href="/search/post" class={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/search/post") ? "bg-primary_color_3 text-white" : "text-gray-200 hover:bg-primary_color_3/50 hover:text-white"} transition-colors`}>
              검색
            </A>
            <A href="/post/new" class={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/post") ? "bg-primary_color_3 text-white" : "text-gray-200 hover:bg-primary_color_3/50 hover:text-white"} transition-colors`}>
              게시글 작성
            </A>
            <A href="/chat" class={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/chat") ? "bg-primary_color_3 text-white" : "text-gray-200 hover:bg-primary_color_3/50 hover:text-white"} transition-colors`}>
              채팅 목록
            </A>
          </nav>

          <div class="flex items-center space-x-2">
            <Show
              when={user.id !== 0}
              fallback={
                <>
                  <A href="/user/login" class="px-4 py-2 text-sm rounded-md text-white bg-primary_color_3 hover:bg-primary_color_2 transition-colors">로그인</A>
                  <A href="/user/signup" class="px-4 py-2 text-sm rounded-md text-primary_color_4 bg-white hover:bg-gray-100 transition-colors">회원가입</A>
                </>
              }
            >
              <div class="flex items-center space-x-4">
                <span class="text-sm text-white">{user.name}님</span>
                <A href={`/user/${user.id}`} class="p-1 rounded-full text-gray-200 hover:text-white focus:outline-none">
                  <span class="sr-only">프로필 메뉴</span>
                  <div class="h-8 w-8 rounded-full bg-primary_color_2 flex items-center justify-center text-white">
                    <img src={BASE_URL+"/public/"+user.profile_path} alt="profile" class="w-full h-full rounded-full" />
                  </div>
                </A>
              </div>
            </Show>
            
            
          </div>
        </div>
      </div>
    </header>
  );
}
