import { A , createAsync, query} from "@solidjs/router";
import { For, Show, createResource } from "solid-js";
import PostItem from "~/components/features/search/PostItem";
import axios from "axios";

function fetchPosts(): Promise<Post[]> {
  const dummyPosts: Post[] = [
    {
      id: 9,
      title: '데이터 분석가 모집',
      content: '데이터 분석 및 시각화가 가능한 분석가를 모집합니다.',
      category: '데이터',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      updated_at: new Date().toISOString(),
      deadline: '2025-10-31T23:59:59',
      is_finished: false,
      max_recruits: 1,
      current_recruits: 0,
      author: {
        id: 105,
        name: '정데이터',
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
        { id: 12, name: 'Pandas', bg_color: '#150458', font_color: '#000', tag_type: '라이브러리', usage: 1 },
        { id: 13, name: 'Tableau', bg_color: '#E97627', font_color: '#000', tag_type: '도구', usage: 1 },
      ],
      recruiters: []
    }
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyPosts);
    }, 1000);
  });
}


export default function Home() {
  const [posts] = createResource<Post[]>(fetchPosts);
  const [PopularTags] = createResource<Tag[]>(async () => {
    const response = await fetch("http://100.95.6.45:3000/api/posts/tags/top10");
    return (await response.json()) as Tag[];
  });
  return (
    <div class="min-h-screen bg-gray-50">

      <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div class="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 class="text-primary_color_4 text-2xl font-semibold mb-4">원하는 프로젝트를 찾아보세요</h2>
          <div class="flex flex-col sm:flex-row gap-4">
            <input type="text" placeholder="검색어를 입력해주세요" class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-primary_color_3 focus:ring-2 focus:ring-primary_color_3" />
            <button class="bg-primary_color_3 text-white px-6 py-2 rounded-md hover:bg-primary_color_2/100 transition-colors">
              검색
            </button>
          </div>
        </div>
        <div>
          <h2 class="text-primary_color_4 text-xl font-semibold mb-4">인기 태그</h2>
            <For each={PopularTags()} fallback={<p>태그가 없습니다.</p>}>
              {(tag: Tag) => (
                <span class="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">{tag.name}</span>
              )}
            </For>
        </div>
        <div class="space-y-4">
          <h2 class="text-primary_color_4 text-xl font-semibold mb-4">새 게시글</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <For each={posts() ?? []} fallback={<p class="col-span-full text-center">게시물이 없습니다.</p>}>
                {(post) => (
                  <PostItem post={post} />
                )}
              </For>
            </div>
        </div>
      </main>

    </div>
  );
}
