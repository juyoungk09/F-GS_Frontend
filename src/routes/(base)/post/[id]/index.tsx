import { useParams, useNavigate } from "@solidjs/router";
import { createSignal, onMount, Show, For } from "solid-js";

// 테스트용 더미 데이터 정의
const dummyPosts = [
  {
    id: 1,
    title: "Frontend Developer Recruitment",
    category: "Development",
    content:
      "We are looking for a skilled frontend developer to build responsive web applications using SolidJS and Tailwind.",
    created_at: "2025-07-31T09:00:00Z",
    author: {
      name: "KIM Mingi",
      email: "hotcream0000@gmail.com",
      created_at: "2025-07-30T10:15:00Z",
      id: 101,
      portfolio_path: "/portfolio/mingi",
      profile_path: "/profile/mingi",
      rating: 4.5,
      self_introduction:
        "Computer science student passionate about frontend development.",
      student_id: 20250101,
    },
    current_recruits: 1,
    max_recruits: 3,
    recruiters: [
      {
        id: 201,
        name: "KIM MIngi",
        email: "hotcream0000@gmail.com",
        created_at: "2025-07-31T09:30:00Z",
        portfolio_path: "/portfolio/mingi",
        profile_path: "/profile/mingi",
        rating: 4.2,
        self_introduction: "Full-stack engineer leading the recruiting team.",
        student_id: 20250011,
      },
    ],
    tags: [
      { id: 1, name: "SolidJS", color: "#38BDF8", tag_type: "skill", usage: 12 },
      { id: 2, name: "Tailwind", color: "#06B6D4", tag_type: "tool", usage: 8 },
    ],
    deadline: "2025-08-15T23:59:59Z",
    is_finished: false,
    updated_at: "2025-08-01T11:00:00Z",
  },

];

const PostDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [post, setPost] = createSignal<any>(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<Error | null>(null);


  onMount(() => {
    const id = parseInt(params.id, 10);
    const found = dummyPosts.find((p) => p.id === id);
    if (found) {
      setPost(found);
    } else {
      setError(new Error("해당 게시글을 찾을 수 없습니다."));
    }
    setLoading(false);
  });

  return (
    <div class="w-full">
      <div class="h-auto flex flex-col">
        <div class="flex-grow">
          <div class="px-4 py-8">
            {/* 로딩 상태 표시 */}
            <Show when={loading()}>
              <div class="flex items-center justify-center h-64">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D336B]" />
                <p class="ml-4 text-gray-500">로딩 중...</p>
              </div>
            </Show>

            <Show when={error()}>
              <div class="text-center p-8">
                <div class="text-red-500 mb-2">
                  <svg
                    class="w-12 h-12 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p class="text-[#2D336B]">오류: {error()!.message}</p>
              </div>
            </Show>

            <Show when={post()}>
              <article
                class="
                  bg-white
                  rounded-xl
                  shadow-lg
                  p-6
                  border border-gray-200
                  h-100vh
                  overflow-hidden
                  whitespace-normal
                  break-words
                "
              >
                <div class="flex items-center justify-between mb-4">
                  <h1 class="text-3xl font-bold text-[#2D336B]">
                    {post()!.title}
                  </h1>
                  <button class="px-4 py-2 bg-[#2D336B] text-white rounded-lg hover:bg-[#7886C7] transition-colors"
                    onClick={() => navigate(`/post/${params.id}/recruit`) as void}>
                    지원폼 작성
                  </button>
                </div>
                <p class="text-sm text-gray-500 mb-2">
                  카테고리:{" "}
                  <span class="text-[#7886C7]">{post()!.category}</span> | 작성일:{" "}
                  {new Date(post()!.created_at).toLocaleString()}
                </p>
                <div class="mb-6 leading-relaxed whitespace-pre-line">
                  {post()!.content}
                </div>
                <section class="mb-4">
                  <h2 class="text-xl font-semibold mb-2 text-[#2D336B]">태그</h2>
                  <div class="flex flex-wrap gap-2">
                    <For each={post()!.tags}>
                      {(tag) => (
                        <span class="px-2 py-1 text-sm rounded bg-gray-200 text-gray-700">
                          {tag.name}
                        </span>
                      )}
                    </For>
                  </div>
                </section>
                <section class="mb-4">
                  <h2 class="text-xl font-semibold mb-2 text-[#2D336B]">
                    모집 중인 참가자
                  </h2>
                  <ul class="list-disc list-inside space-y-1">
                    <For each={post()!.recruiters}>
                      {(recruiter) => (
                        <li>
                          {recruiter.name} (
                          <span class="text-sm text-gray-600">
                            {recruiter.email}
                          </span>
                          )
                        </li>
                      )}
                    </For>
                  </ul>
                </section>
                <div class="flex justify-between items-center">
                  <p class="text-gray-600">
                    작성자:{" "}
                    <span class="text-[#7886C7]">{post()!.author.name}</span> (
                    {post()!.author.email})
                  </p>
                </div>
              </article>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
