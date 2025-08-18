import { A , createAsync, query} from "@solidjs/router";
import { For, Show, createResource, createSignal } from "solid-js";
import PostItem from "~/components/features/search/PostItem";
import axios from "axios";
function fetchPosts(): Promise<Post[]> {
  const dummyPosts: Post[] = [
    {
      id: 27,
      title: '데이터 분AAAAAAAAAAAA석ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㄴ가 모집',
      content: `
      안드로이드 앱 / 서버 개발자를 찾습니다.
      자격 조건은 다음과 같습니다.

      안드로이드 앱
      -Jetpack Compose를 사용하여 앱을 개발할 수 있습니다.
      -Kotlin을 사용하여 앱을 개발할 수 있습니다.
      -React Native를 사용하여 앱을 개발할 수 있습니다.
      -Flutter를 사용하여 앱을 개발할 수 있습니다.
      -Swift를 사용하여 앱을 개발할 수 있습니다.
      -Kotlin을 사용하여 앱을 개발할 수 있습니다.
      
      서버 개발
       -Spring Boot : Kotlin으로 ~까지 해보거나 뭘머시머시기 대충 구현해보았습니다.
       -MySQL을 사용하여 데이터베이스를 구축할 수 있습니다.
       -Ko를 사용하여 서버를 개발할 수 있습니다.
       -AWS를 사용하여 서버를 구축할 수 있습니다.
       -Docker를 사용하여 서버를 구축할 수 있습니다.
       

      `,
      
      category: '데이터',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      updated_at: new Date().toISOString(),
      deadline: '2025-10-31T23:59:59',
      is_finished: false,
      max_recruits: 1,
      current_recruits: 0,
      author: {
        id: 105,
        name: '정데AAAAAAA이터',
        profile_path: 'https://randomuser.me/api/portraits/men/5.jpg',
        rating: 4.3,
        created_at: new Date().toISOString(),
        email: 'test@gmail.com',
        portfolio_path: 'https://randomuser.me/api/portraits/men/5.jpg',
        self_introduction: '안녕하세요',
        student_id: 105
      },
      tags: [
        { id: 11, name: 'Python', bg_color: '#3776AB', font_color: '#00FFFF', tag_type: '프로그래밍언어', usage: 1 },
        { id: 12, name: 'Pandas', bg_color: '#150458', font_color: '#2f0000', tag_type: '라이브러리', usage: 1 },
        { id: 13, name: 'Tableau', bg_color: '#E97627', font_color: '#2f0000', tag_type: '도구', usage: 1 },
      ],
      recruiters: []
    }
  ];

  return new Promise((resolve) => {
    // setTimeout(() => {
      resolve(dummyPosts);
    // }, 1000);
  });
}


export default function Home() {
  const [newPosts] = createResource<Post[]>
    (async () => {
      const response = await axios.get("https://fg.sunrin.kr/api/posts?page=1", { withCredentials: true });
      return (await response.data) as Post[];
  });
  const [popularPosts] = createResource<Post[]>(async () => {
    const response = await axios.get("https://fg.sunrin.kr/api/posts/hot", { withCredentials: true });  
    return (await response.data) as Post[];
  });
  const [isMoreShow, setIsMoreShow] = createSignal<number>(0);
  const [PopularTags] = createResource<Tag[]>(async () => {
    const response = await axios.get("https://fg.sunrin.kr/api/posts/tags/top10", { withCredentials: true });
    return (await response.data) as Tag[];
  });
  return (
    <div class="min-h-screen w-full bg-gray-50">
      <main class="w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div class="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 class="text-primary_color_4 text-2xl font-semibold mb-4">원하는 프로젝트를 찾아보세요</h2>
          <div class="flex flex-col sm:flex-row gap-4">
            <input type="text" placeholder="검색어를 입력해주세요" class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-primary_color_3 focus:ring-2 focus:ring-primary_color_3" />
            <button class="bg-primary_color_3 text-white px-6 py-2 rounded-md hover:bg-primary_color_2/100 transition-colors">
              검색
            </button>
          </div>
        </div>
        <div class="flex flex-wrap bg-white p-4 w-full justify-center items-center animate-none transition-all duration-initial ease-in-out gap-8"> 
          <h2 class="text-primary_color_4 text-md font-semibold">인기 태그</h2>
          <For each={PopularTags() ?? []} fallback={<p>게시물이 없습니다.</p>}>
            {(tag) => (
              <span 
                class="inline-flex animate-pulse items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                style={{ 'background-color': `${tag.bg_color}`, color: tag.font_color, 'max-width': '100px' }}
                title={tag.name}
                  >
                {tag.name}
              </span>
            )}
          </For> 
        </div>
        <div class="space-y-4">
          <h2 class="text-primary_color_4 text-xl font-semibold mb-4">새 게시글</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <For each={newPosts() ?? []} fallback={<p class="col-span-full text-center">게시물이 없습니다.</p>}>
                {(post) => (
                  <PostItem post={post} isMoreShow={isMoreShow} setIsMoreShow={setIsMoreShow} />
                )}
              </For>
            </div>
        </div>
        <div class="space-y-4">
          <h2 class="text-primary_color_4 text-xl font-semibold mb-4">인기 게시글</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <For each={popularPosts() ?? []} fallback={<p class="col-span-full text-center">게시물이 없습니다.</p>}>
                {(post) => (
                  <PostItem post={post} isMoreShow={isMoreShow} setIsMoreShow={setIsMoreShow} />
                )}
              </For>
            </div>
        </div>
      </main>

    </div>
  );
}
