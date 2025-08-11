import { A, useLocation } from "@solidjs/router";
const Sidebar = ({isShow}: {isShow: () => boolean}) => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    return (
        <div class="md:hidden fixed top-10 bg-primary_color_4 left-10 z-50 bg-opacity-50" style={{ display: isShow() ? "block" : "none" }}>
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <A href="/" class={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/") ? "bg-primary_color_3 text-white" : "text-gray-200 hover:bg-primary_color_3/50 hover:text-white"}`}>
            홈
          </A>
          <A href="/search/post" class={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/search/post") ? "bg-primary_color_3 text-white" : "text-gray-200 hover:bg-primary_color_3/50 hover:text-white"}`}>
            검색
          </A>
          <A href="/post/new" class={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/post/new") ? "bg-primary_color_3 text-white" : "text-gray-200 hover:bg-primary_color_3/50 hover:text-white"}`}>
            게시
          </A>
          <A href="/chat" class={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/chat") ? "bg-primary_color_3 text-white" : "text-gray-200 hover:bg-primary_color_3/50 hover:text-white"}`}>
            채팅
          </A>
        </div>
      </div>
    );
}

export default Sidebar;