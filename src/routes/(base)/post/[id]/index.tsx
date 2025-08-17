import { useParams, useNavigate } from "@solidjs/router";
import { createSignal, onMount, Show, For } from "solid-js";

const BASE = "https://fg.sunrin.kr";

async function readErr(r: Response) {
  try {
    const txt = await r.text();
    return txt || r.statusText;
  } catch {
    return r.statusText;
  }
}

const api = {
  async getPost(id: number) {
    const r = await fetch(`${BASE}/api/posts/${id}/detail`, { credentials: "include" });
    console.log(r.status);
    if (!r.ok) throw new Error(await readErr(r));
    return r.json();
  },
};

const dummyPost = (id: number) => ({
  id : 1,
  title: "제목",
  category: "카테고리",
  content: "내용 내용 내용",
  created_at: new Date().toISOString(),
  tags: [
    { id: 1, name: "SolidJS" },
    { id: 2, name: "Tailwind" },
  ],
  recruiters: [
    { id: 101, name: "김민기", email: "이메일" },
    { id: 102, name: "김민기", email: "이메일" },
  ],
  author: { name: "김민기", email: "이메일" },
});

const PostDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [post, setPost] = createSignal<any>(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<Error | null>(null);

  onMount(async () => {
    const id = Number.parseInt(params.id, 10);
    if (Number.isNaN(id)) {
      setError(new Error("잘못된 게시글 ID입니다."));
      setLoading(false);
      return;
    }
    try {
      const data = await api.getPost(id);
      const normalized = {
        ...data,
        tags: Array.isArray(data?.tags) ? data.tags : [],
        recruiters: Array.isArray(data?.recruiters) ? data.recruiters : [],
        author: data?.author ?? { name: "알 수 없음", email: "" },
      };
      setPost(normalized);
    } catch {
      console.warn("API 실패 → 더미데이터 사용");
      setPost(dummyPost(id));
    } finally {
      setLoading(false);
    }
  });

  return (
    <div class="flex flex-col min-h-screen bg-white">
      <main class="flex-grow w-full text-gray-800">
        <div class="w-full px-4 py-8">
          <div class="w-full max-w-3xl mx-auto">
            <Show when={loading()}>
              <div class="flex items-center justify-center h-64">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D336B]" />
                <p class="ml-4 text-gray-500">로딩 중...</p>
              </div>
            </Show>

            <Show when={error()}>
              <div class="text-center p-8">
                <p class="text-red-600">오류: {error()!.message}</p>
              </div>
            </Show>

            <Show when={post()}>
              <article class="bg-white rounded-xl shadow-lg p-6 border border-gray-200 whitespace-normal break-words text-gray-800">
                <div class="flex items-center justify-between mb-4">
                  <h1 class="text-3xl font-bold text-[#2D336B]">{post()!.title}</h1>
                  <div class="flex gap-2">
                    <button
                      class="px-4 py-2 bg-[#2D336B] text-white rounded-lg hover:bg-[#7886C7] transition-colors"
                      onClick={() => navigate(`/post/${params.id}/edit`)}
                    >
                      수정하기
                    </button>
                    <button
                      class="px-4 py-2 bg-[#2D336B] text-white rounded-lg hover:bg-[#7886C7] transition-colors"
                      onClick={() => navigate(`/post/${params.id}/recruit`)}
                    >
                      지원폼 작성
                    </button>
                  </div>
                </div>

                <p class="text-sm text-gray-600 mb-2">
                  카테고리: <span class="text-[#7886C7]">{post()!.category ?? "-"}</span> | 작성일:{" "}
                  {post()!.created_at ? new Date(post()!.created_at).toLocaleString() : "-"}
                </p>

                <div class="mb-6 leading-relaxed whitespace-pre-line text-gray-800">
                  {post()!.content ?? ""}
                </div>

                <section class="mb-4">
                  <h2 class="text-xl font-semibold mb-2 text-[#2D336B]">태그</h2>
                  <div class="flex flex-wrap gap-2">
                    <For each={post()!.tags ?? []}>
                      {(tag: any) => (
                        <span class="px-2 py-1 text-sm rounded bg-gray-200 text-gray-700">
                          {tag.name}
                        </span>
                      )}
                    </For>
                    <Show when={(post()!.tags ?? []).length === 0}>
                      <span class="text-sm text-gray-500">태그 없음</span>
                    </Show>
                  </div>
                </section>

                <section class="mb-4">
                  <h2 class="text-xl font-semibold mb-2 text-[#2D336B]">모집 중인 참가자</h2>
                  <ul class="list-disc list-inside space-y-1">
                    <For each={post()!.recruiters ?? []}>
                      {(r: any) => (
                        <li class="text-gray-800">
                          {r.name} <span class="text-sm text-gray-600">({r.email})</span>
                        </li>
                      )}
                    </For>
                    <Show when={(post()!.recruiters ?? []).length === 0}>
                      <li class="text-sm text-gray-500">표시할 인원 없음</li>
                    </Show>
                  </ul>
                </section>

                <div class="flex justify-between items-center">
                  <p class="text-gray-700">
                    작성자:{" "}
                    <span class="text-[#7886C7]">{post()!.author?.name ?? "알 수 없음"}</span>{" "}
                    ({post()!.author?.email ?? ""})
                  </p>
                </div>
              </article>
            </Show>
          </div>
        </div>
      </main>

      <footer class="bg-gray-100 text-center p-4 text-sm text-gray-500">
        © 2025 MySite. All rights reserved.
      </footer>
    </div>
  );
};

export default PostDetail;
