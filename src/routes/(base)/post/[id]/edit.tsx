import { useParams, useNavigate } from "@solidjs/router";
import { createSignal, onMount, Show, onCleanup } from "solid-js";

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
    const r = await fetch(`${BASE}/api/posts/${id}`, { credentials: "include" });
    if (!r.ok) throw new Error(await readErr(r));
    return r.json();
  },
  async updatePostJSON(id: number, payload: any) {
    const r = await fetch(`${BASE}/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error(await readErr(r));
    return r.json();
  },
  async updatePostFormData(id: number, fd: FormData) {
    const r = await fetch(`${BASE}/api/posts/${id}`, {
      method: "PUT",
      credentials: "include",
      body: fd,
    });
    if (!r.ok) throw new Error(await readErr(r));
    return r.json();
  },
};

// ✅ 더미 데이터
const dummyPost = (id: number) => ({
  id,
  title: `타이틀`,
  category: "카테고리",
  content: "더미 데이터",
  image_url: "https://picsum.photos/seed/post-" + id + "/640/360",
});

const EditPost = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<Error | null>(null);
  const [usingDummy, setUsingDummy] = createSignal(false);

  // 폼 필드
  const [title, setTitle] = createSignal("");
  const [category, setCategory] = createSignal("");
  const [content, setContent] = createSignal("");

  // 이미지 상태
  const [existingImageUrl, setExistingImageUrl] = createSignal<string | null>(null);
  const [newImageFile, setNewImageFile] = createSignal<File | null>(null);
  const [newImagePreview, setNewImagePreview] = createSignal<string | null>(null);
  const [removeImage, setRemoveImage] = createSignal(false);

  onCleanup(() => {
    const u = newImagePreview();
    if (u) URL.revokeObjectURL(u);
  });

  onMount(async () => {
    const id = Number.parseInt(params.id, 10);
    if (Number.isNaN(id)) {
      setError(new Error("잘못된 게시글 ID입니다."));
      setLoading(false);
      return;
    }
    try {
      const data = await api.getPost(id);
      setTitle(data.title ?? "");
      setCategory(data.category ?? "");
      setContent(data.content ?? "");
      setExistingImageUrl(data.image_url ? data.image_url : null); // 빈 문자열도 null 처리
    } catch {
      const d = dummyPost(id);
      setTitle(d.title);
      setCategory(d.category);
      setContent(d.content);
      setExistingImageUrl(d.image_url);
      setUsingDummy(true);
      setError(null);
      console.warn("API 실패 → 더미데이터로 편집 화면 표시");
    } finally {
      setLoading(false);
    }
  });

  const onPickNewImage = (file: File | null) => {
    const prev = newImagePreview();
    if (prev) URL.revokeObjectURL(prev);

    setNewImageFile(file);
    if (file) {
      setNewImagePreview(URL.createObjectURL(file));
      setRemoveImage(false);
      setExistingImageUrl(null);
    } else {
      setNewImagePreview(null);
    }
  };

  const openFileDialog = () => {
    (document.getElementById("edit-image-input") as HTMLInputElement | null)?.click();
  };

  const handleDeleteImage = () => {
    const prev = newImagePreview();
    if (prev) URL.revokeObjectURL(prev);
    setNewImageFile(null);
    setNewImagePreview(null);
    setExistingImageUrl(null);
    setRemoveImage(true);
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const id = Number.parseInt(params.id, 10);

    const basePayload = {
      title: title().trim(),
      category: category().trim(),
      content: content(),
    };
    if (!basePayload.title) return alert("제목을 입력하세요.");
    if (!basePayload.category) return alert("카테고리를 입력하세요.");

    if (usingDummy()) {
      alert(
        `더미 모드: ${newImageFile() ? "이미지 교체 포함, " : ""}${
          removeImage() ? "이미지 삭제 포함, " : ""
        }수정 사항을 시뮬레이션합니다.\n상세 페이지로 이동합니다.`
      );
      navigate(`/post/${id}`);
      return;
    }

    const hasImageChange = !!newImageFile() || removeImage();

    try {
      if (hasImageChange) {
        const fd = new FormData();
        fd.append("title", basePayload.title);
        fd.append("category", basePayload.category);
        fd.append("content", basePayload.content);

        if (newImageFile()) {
          fd.append("image", newImageFile()!);
        } else if (removeImage()) {
          fd.append("image_delete", "true");
        }

        await api.updatePostFormData(id, fd);
      } else {
        await api.updatePostJSON(id, basePayload);
      }

      alert("수정 완료!");
      navigate(`/post/${id}`);
    } catch (err) {
      console.error(err);
      alert("게시글 수정 실패");
    }
  };

  return (
    <div class="flex flex-col min-h-screen bg-white">
      <main class="flex-grow w-full">
        <div class="w-full px-4 py-8">
          {/* 중앙 정렬을 보장하는 래퍼 */}
          <div class="w-full max-w-3xl mx-auto">
            <Show when={loading()}>
              <div class="flex items-center justify-center h-64">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D336B]" />
                <p class="ml-4 text-gray-500">불러오는 중...</p>
              </div>
            </Show>

            <Show when={!loading() && error()}>
              <div class="mx-auto max-w-2xl bg-white rounded-xl p-6 border text-center">
                <p class="text-red-600 font-medium">오류: {error()!.message}</p>
              </div>
            </Show>

            <Show when={!loading() && !error()}>
              {/* 카드 자체도 가운데, 폭 제한 */}
              <article class="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 shadow p-6">
                {/* ✅ 1열 고정: 오른쪽 빈 칼럼 때문에 쏠리던 문제 해결 */}
                <div class="grid grid-cols-1 gap-8">
                  <section>
                    <h2 class="text-2xl font-bold text-[#2D336B] mb-4">게시글 수정</h2>

                    <form class="space-y-4" onSubmit={handleSubmit}>
                      <div>
                        <input
                          type="text"
                          placeholder="제목"
                          value={title()}
                          onInput={(e) => setTitle(e.currentTarget.value)}
                          class="w-full rounded-xl border border-gray-300 bg-white text-black p-3 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="카테고리"
                          value={category()}
                          onInput={(e) => setCategory(e.currentTarget.value)}
                          class="w-full rounded-xl border border-gray-300 bg-white text-black p-3 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                        />
                      </div>
                      <div>
                        <textarea
                          placeholder="내용"
                          value={content()}
                          onInput={(e) => setContent(e.currentTarget.value)}
                          class="w-full h-44 rounded-xl border border-gray-300 bg-white text-black p-3 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                        />
                      </div>

                      {/* 이미지 영역 */}
                      <div class="pt-2">
                        <div class="mb-2 text-sm font-semibold text-black">사진 첨부</div>

                        <Show when={newImagePreview()}>
                          <div class="w-full max-w-md">
                            <div class="aspect-video w-full overflow-hidden rounded-xl border bg-gray-50">
                              <img
                                src={newImagePreview()!}
                                alt="새 이미지 미리보기"
                                class="h-full w-full object-cover"
                              />
                            </div>

                            <div class="mt-3 flex flex-wrap gap-2">
                              <input
                                id="edit-image-input"
                                type="file"
                                accept="image/*"
                                class="hidden"
                                onChange={(e) => {
                                  const file = e.currentTarget.files?.[0] ?? null;
                                  onPickNewImage(file);
                                  e.currentTarget.value = "";
                                }}
                              />
                              <button
                                type="button"
                                class="rounded-lg border border-gray-300 px-3 py-2 text-sm text-black hover:bg-gray-50"
                                onClick={openFileDialog}
                              >
                                이미지 교체
                              </button>
                              <button
                                type="button"
                                class="rounded-lg border border-red-300 px-3 py-2 text-sm text-black hover:bg-red-50"
                                onClick={handleDeleteImage}
                              >
                                이미지 삭제
                              </button>
                            </div>
                          </div>
                        </Show>

                        <Show when={!newImagePreview() && existingImageUrl()}>
                          <div class="w-full max-w-md">
                            <div class="aspect-video w-full overflow-hidden rounded-xl border bg-gray-50">
                              <img
                                src={existingImageUrl()!}
                                alt="기존 이미지"
                                class="h-full w-full object-cover"
                              />
                            </div>

                            <div class="mt-3 flex flex-wrap gap-2">
                              <input
                                id="edit-image-input"
                                type="file"
                                accept="image/*"
                                class="hidden"
                                onChange={(e) => {
                                  const file = e.currentTarget.files?.[0] ?? null;
                                  onPickNewImage(file);
                                  e.currentTarget.value = "";
                                }}
                              />
                              <button
                                type="button"
                                class="rounded-lg border border-gray-300 px-3 py-2 text-sm text-black hover:bg-gray-50"
                                onClick={openFileDialog}
                              >
                                이미지 교체
                              </button>
                              <button
                                type="button"
                                class="rounded-lg border border-red-300 px-3 py-2 text-sm text-black hover:bg-red-50"
                                onClick={handleDeleteImage}
                              >
                                이미지 삭제
                              </button>
                            </div>
                          </div>
                        </Show>

                        <Show when={!newImagePreview() && !existingImageUrl()}>
                          <div class="rounded-xl border border-gray-100 bg-gray-50/70 p-4 max-w-md">
                            <div class="flex items-center gap-3">
                              <input
                                id="edit-image-input"
                                type="file"
                                accept="image/*"
                                class="hidden"
                                onChange={(e) => {
                                  const f = e.currentTarget.files?.[0] ?? null;
                                  onPickNewImage(f);
                                  e.currentTarget.value = "";
                                }}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  (document.getElementById("edit-image-input") as HTMLInputElement)?.click()
                                }
                                class="rounded-lg bg-indigo-100 px-3 py-1.5 text-sm text-black hover:bg-indigo-200 active:scale-[0.99]"
                              >
                                파일 선택
                              </button>

                              <span class="text-sm text-black">
                                {newImageFile() ? newImageFile()!.name : "선택된 파일 없음"}
                              </span>
                            </div>
                          </div>
                        </Show>
                      </div>

                      <button
                        type="submit"
                        class="w-full rounded-xl bg-[#6B79C7] px-4 py-3 text-white shadow hover:bg-[#5f6db7] active:scale-[0.99]"
                      >
                        수정 완료
                      </button>
                    </form>
                  </section>
                </div>
              </article>
            </Show>
          </div>
        </div>
      </main>


    </div>
  );
};

export default EditPost;
