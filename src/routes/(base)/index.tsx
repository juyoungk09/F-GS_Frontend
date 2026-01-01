import { For, createResource, createSignal } from "solid-js";
import PostItem from "~/components/features/search/PostItem";
import axios from "axios";
import { BASE_URL } from "~/stores/store";

export default function Home() {
  const [newPosts] = createResource<Post[]>
    (async () => {
      const response = await axios.get(`${BASE_URL}/posts?page=1`, { withCredentials: true });
      return (await response.data) as Post[];
  });
  const [popularPosts] = createResource<Post[]>(async () => {
    const response = await axios.get(`${BASE_URL}/posts/hot`, { withCredentials: true });  
    return (await response.data) as Post[];
  });
  const [isMoreShow, setIsMoreShow] = createSignal<number>(0);
  const [PopularTags] = createResource<Tag[]>(async () => {
    const response = await axios.get(`${BASE_URL}/posts/tags/top10`, { withCredentials: true });
    return (await response.data) as Tag[];
  });
  return (
    <div class="min-h-screen w-full bg-gray-50">
      <main class="w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div class="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 class="text-primary_color_4 text-2xl font-semibold mb-4">원하는 프로젝트를 찾아보세요</h2>
          <div class="flex flex-wrap bg-white p-4 w-full justify-center items-center animate-none transition-all duration-initial ease-in-out gap-8"> 
          <h2 class="text-primary_color_4 text-md font-semibold">인기 태그</h2>
          <For each={PopularTags()}>
            {(tag) => (
              <span 
                class="inline-flex animate-pulse items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                style={{ 'background-color': `${tag.bg_color}`, color: tag.font_color, 'max-width': '100px' }} title={tag.name}>
                {tag.name}
              </span>
            )}
          </For> 
        </div>
        </div>
       
        <div class="space-y-4">
          <h2 class="text-primary_color_4 text-xl font-semibold mb-4">새 게시글</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <For each={newPosts()} >
                {(post) => (
                  <PostItem post={post} isMoreShow={isMoreShow} setIsMoreShow={setIsMoreShow} />
                )}
              </For>
              {newPosts()?.length === 0 && <p class="col-span-full text-xl text-gray-500 text-center">게시물이 없습니다.</p>}
            </div>
        </div>
        <div class="space-y-4">
          <h2 class="text-primary_color_4 text-xl font-semibold mb-4">인기 게시글</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <For each={popularPosts()}>
                {(post) => (
                  <PostItem post={post} isMoreShow={isMoreShow} setIsMoreShow={setIsMoreShow} />
                )}
              </For>
              {popularPosts()?.length === 0 && <p class="col-span-full text-xl text-gray-500 text-center">게시물이 없습니다.</p>}
            </div>
        </div>
      </main>

    </div>
  );
}
