import { useParams, useNavigate, A } from "@solidjs/router";
import { createSignal, Show, For, createResource } from "solid-js";
import { BASE_URL, user } from "~/stores/store";
import axios from "axios";


const PostDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [error, setError] = createSignal<Error | null>(null);

  
  const [postDetail] = createResource<Post>(
    async () => {
      const r = await fetch(`${BASE_URL}/posts/${params.id}/detail`, { credentials: "include" });
      console.log(r.status);
      return r.json();
    },
  );
  const [volunteers] = createResource<UserInform[]>(
    async () => {
      const r = await axios.get(`${BASE_URL}/posts/${params.id}/volunteers`, { withCredentials: true });
      return r.data;
    },
  );
  return (
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <main class="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Show when={error()}>
          <div class="mb-6 p-4 bg-red-50 border-l-4 border-red-500">
            <p class="text-red-700">오류: {error()!.message}</p>
          </div>
        </Show>

        <Show when={postDetail()}>
          <article class="bg-white border-2 border-gray-100 rounded-lg overflow-hidden">
            <div class="p-6 border-b-2 border-gray-100">
              <div class="flex flex-col space-y-4">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900">
                  {postDetail()!.title}
                </h1>
                <Show when={postDetail()?.author.id === user.id}>
                  <div class="flex flex-col sm:flex-row gap-3">
                    
                    <button
                      onClick={() => navigate(`/post/${params.id}/edit`)}
                      class="px-4 py-2 bg-[#6B79C7] text-white rounded-md hover:bg-[#5f6db7] transition-colors"
                  >
                    수정하기
                  </button>
                </div>
              </Show>
                  <button
                    onClick={() => navigate(`/post/${params.id}/recruit`)}
                    class="px-4 py-2 bg-[#6B79C7] text-white rounded-md hover:bg-[#5f6db7] transition-colors"
                  >
                    지원폼 작성
                  </button>
            </div>

              <div class="mt-4 flex flex-wrap items-center text-sm text-gray-600 space-x-4">
                <div class="flex items-center">
                  <span class="font-medium text-gray-700">카테고리:</span>
                  <span class="ml-1 text-primary-color-2">{postDetail()!.category || '없음'}</span>
                </div>
                <span class="text-gray-300">|</span>
                <div class="flex items-center">
                  <span class="font-medium text-gray-700">작성일:</span>
                  <span class="ml-1">
                    {postDetail()!.created_at ? new Date(postDetail()!.created_at).toLocaleString() : "-"}
                  </span>
                </div>
              </div>
            </div>

            <div class="p-6">
              <div class="prose max-w-none text-gray-700 whitespace-pre-line">
                {postDetail()!.content || '내용이 없습니다.'}
              </div>

              <section class="mt-8">
                <h2 class="text-xl font-semibold mb-3 text-gray-800 border-b-2 border-gray-100 pb-2">태그</h2>
                <div class="flex flex-wrap gap-2">
                  <For each={postDetail()!.tags ?? []}>
                    {(tag: any) => (
                      <span 
                        class="px-3 py-1 text-sm rounded-full"
                        style={{
                          'background-color': tag.bg_color || '#f3f4f6',
                          color: tag.font_color || '#374151',
                          'border': `2px solid ${tag.bg_color ? `${tag.bg_color}80` : '#e5e7eb'}`
                        }}
                      >
                        {tag.name}
                      </span>
                    )}
                  </For>
                  <Show when={(postDetail()?.tags ?? []).length === 0}>
                    <span class="text-sm text-gray-400">등록된 태그가 없습니다.</span>
                  </Show>
                </div>
              </section>

              <section class="mt-8">
                <h2 class="text-xl font-semibold mb-3 text-gray-800 border-b-2 border-gray-100 pb-2">지원된 참가자</h2>
                <div class="bg-gray-50 rounded-lg p-4">
                  <ul class="space-y-3">
                    <For each={postDetail()?.recruiters ?? []}>
                      {(r: any) => (
                        <li class="flex items-center p-2 hover:bg-gray-100 rounded transition-colors">
                          <A 
                            href={`/user/${r.id}`}
                            class="flex-1 text-blue-400 hover:text-blue-600 transition-colors"
                          ><img class="rounded-full border-1 border-gray-200 w-10 h-10 object-cover" src={BASE_URL + "/public/" + r.profile_path || '?'} alt="" />
                            <span class="font-medium">{r.name}</span>
                            <span class="ml-2 text-sm text-gray-500">{r.email}</span>
                          </A>
                        </li>
                      )}
                    </For>
                    <Show when={(postDetail()?.recruiters ?? []).length === 0}>
                      <li class="text-center py-4 text-gray-400">
                        아직 지원자가 없습니다.
                      </li>
                    </Show>
                  </ul>
                </div>
              </section>
              <Show when={postDetail()?.author.id === user.id}>
                    <div class="mt-8">
                    <h2 class="text-xl font-semibold mb-3 text-gray-800 border-b-2 border-gray-100 pb-2">지원한 참가자</h2>
                <div class="bg-gray-50 rounded-lg p-4">
                  <ul class="space-y-3">
                    <For each={volunteers() ?? []}>
                      {(r: any) => (
                        <li class="flex items-center p-2 hover:bg-gray-100 rounded transition-colors">
                          <A 
                            href={`/post/${params.id}/${r.id}`}
                            class="flex-1 text-[#6B79C7] gap-2 hover:text-[#6B79C7] flex items-center transition-colors"
                          > 
                          <img class="rounded-full border-1 border-gray-200 w-10 h-10 object-cover" src={BASE_URL + "/public/" + r.profile_path || '?'} alt="" />
                            <span class="font-medium text-[#6B79C7]">{r.name}</span>
                            <span class="ml-2 text-sm text-gray-500">{r.email}</span>
                          </A>
                        </li>
                      )}
                    </For>
                    <Show when={(volunteers() ?? []).length === 0}>
                      <li class="text-center py-4 text-gray-400">
                        아직 지원한 사람이 없습니다.
                      </li>
                    </Show>
                  </ul>
                  </div>
                </div>
              </Show>
              <div class="mt-8 pt-6 border-t-2 border-gray-100">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <img class="rounded-full border-1 border-gray-200 w-10 h-10 object-cover" src={BASE_URL + "/public/" + postDetail()?.author?.profile_path || '?'} alt="" />
                  </div>
                  <div class="ml-4">
                    <p class="text-sm text-gray-700">
                      작성자:{" "}
                      <A 
                        href={`/user/${postDetail()?.author.id}`}
                        class="text-[#6B79C7] hover:underline"
                      >
                        {postDetail()?.author.name ?? "알 수 없음"}
                      </A>
                    </p>
                    <p class="text-xs text-gray-500">
                      {postDetail()?.author.email || ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </Show>
      </main>
    </div>
  );
};

export default PostDetail;
