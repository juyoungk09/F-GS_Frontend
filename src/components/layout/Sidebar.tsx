import { A, useLocation } from "@solidjs/router";
import { createEffect, For } from "solid-js";
import { Show } from "solid-js/web";
import { BASE_URL } from "~/stores/store";
import { createResource } from "solid-js";
import axios from "axios";
import { user } from "~/stores/store";
const Sidebar = ({ isShow, setHamberger }: { isShow: () => boolean, setHamberger: (value: boolean) => void }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [myPosts] = createResource<Post[]>(async () => {
    if(!user.id) return null;
    const response = await axios.get(`${BASE_URL}/posts/${user.id}`, { withCredentials: true });
    console.log(response.data);
    return response.data.data;
  });
  return (
    <div 
      class={`fixed top-0 left-0 h-full w-64 bg-primary_color_4 bg-opacity-100
        transition-transform duration-200 ease-in-out z-150
        ${isShow() ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div class="h-full w-full flex flex-col  p-4 pt-16 items-start justify-start overflow-y-auto">   
        <h2> 빠른 링크</h2>
        <nav class="space-y-2 border-gray-200 mb-4 w-full">
          <NavItem href="/" isActive={isActive("/")} icon="house">
            홈
          </NavItem>
          <NavItem href="/search/post" isActive={isActive("/search/post")} icon="search">
            검색
          </NavItem>
          <NavItem href="/post/new" isActive={isActive("/post/new")} icon="plus">
            게시
          </NavItem>
          <NavItem href="/chat" isActive={isActive("/chat")} icon="chat-dots">
            채팅
          </NavItem>
        </nav>
        <Show when={myPosts()}>
          <h2 class="text-lg font-semibold mb-2">내가 쓴 게시글</h2>
          <div class="flex-1 h-full flex-col items-center gap-2 overflow-y-auto w-full justify-start mb-4">
           <For each={myPosts()}> 
             {(post) => (
              <A href={`/post/${post.id}`} onClick={() => setHamberger(false)} class="flex items-center gap-2 px-4 py-2 border-b-1 border-gray-200 text-base font-medium transition-colors hover:bg-primary_color_3/50 hover:text-white">
                <i class="bi bi-file-text"></i>
                {post.title}
              </A>
             )}
           </For>
          </div>
        </Show>     
     
      </div>
    </div>
  );
};

const NavItem = ({ href, isActive, children, icon }: { href: string; isActive: boolean; children: string; icon: string; }) => (
  <A href={href} class={`flex items-center px-4 py-2 rounded-md text-base gap-2 font-medium transition-colors ${
    isActive 
      ? `bg-primary_color_3 text-white` 
      : `text-gray-200 hover:bg-primary_color_3/50 hover:text-white`
    }`}>
    <i class={`bi bi-${icon}`}></i>
    {children}
  </A>
);

export default Sidebar;