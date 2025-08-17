import { createSignal, For, Show, onMount, onCleanup } from 'solid-js';
import { useNavigate } from '@solidjs/router';

type Tag = { id: number; name: string };
type NewQuestion = {
  label: string;
  question_type: 'text' | 'textarea' | 'number' | 'file';
  required: boolean;
};

const BASE = 'https://fg.sunrin.kr';

async function readErr(r: Response) {
  try {
    const txt = await r.text();
    return txt || r.statusText;
  } catch {
    return r.statusText;
  }
}

const api = {
  async getTags() {
    const r = await fetch(`${BASE}/api/tags`, { credentials: 'include' });
    if (!r.ok) throw new Error(await readErr(r));
    return r.json();
  },
  async setPostTags(postId: number, tagIds: number[]) {
    const r = await fetch(`${BASE}/api/posts/private/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ post_id: postId, tag_ids: tagIds }),
    });
    if (!r.ok) throw new Error(await readErr(r));
    return r.json();
  },
  async createRecruitForm(payload: {
    post_id: number;
    deadline: string;
    max_recruits: number;
    questions: NewQuestion[];
  }) {
    const r = await fetch(`${BASE}/api/posts/private/form`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error(await readErr(r));
    return r.json();
  },
};

const NewPostPage = () => {
  const [title, setTitle] = createSignal('');
  const [categoryText, setCategoryText] = createSignal('');
  const [content, setContent] = createSignal('');

  const [tags, setTags] = createSignal<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = createSignal<number[]>([]);

  const [deadline, setDeadline] = createSignal('');
  const [maxRecruits, setMaxRecruits] = createSignal(1);
  const [questions, setQuestions] = createSignal<NewQuestion[]>([]);

  // 이미지 첨부
  const [imageFile, setImageFile] = createSignal<File | null>(null);
  const [imagePreview, setImagePreview] = createSignal<string | null>(null);

  const [submitting, setSubmitting] = createSignal(false);
  const navigate = useNavigate();

  onMount(async () => {
    try {
      setTags(await api.getTags());
    } catch (e: any) {
      alert(`태그 불러오기 실패\n${e.message ?? e}`);
    }
  });

  // 미리보기 URL 정리
  onCleanup(() => {
    const url = imagePreview();
    if (url) URL.revokeObjectURL(url);
  });

  const toggleTag = (id: number) => {
    const cur = selectedTagIds();
    setSelectedTagIds(cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]);
  };

  const addQuestion = () =>
    setQuestions([...questions(), { label: '', question_type: 'text', required: false }]);

  const removeQuestion = (idx: number) =>
    setQuestions(questions().filter((_, i) => i !== idx));

  const updateQuestion = (idx: number, patch: Partial<NewQuestion>) =>
    setQuestions(questions().map((q, i) => (i === idx ? { ...q, ...patch } : q)));

  const handleComplete = async (e: Event) => {
    e.preventDefault();
    if (submitting()) return;

    // 기본 유효성
    if (!title().trim() || !content().trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    if (!deadline().trim() || maxRecruits() < 1) {
      alert('마감일과 모집 인원을 확인해주세요.');
      return;
    }

    try {
      setSubmitting(true);

      // 1) 게시글 생성 (FormData: 텍스트 + 이미지)
      const formData = new FormData();
      formData.append('title', title().trim());
      formData.append('content', content().trim());
      formData.append('category', categoryText().trim());
      if (imageFile()) {
        formData.append('image', imageFile()!);
      }

      const postRes = await fetch(`${BASE}/api/posts`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!postRes.ok) throw new Error(await readErr(postRes));
      const post = await postRes.json();
      const pid = post.id;

      // 2) 태그 연결
      const tagIds = selectedTagIds();
      if (tagIds.length > 0) {
        await api.setPostTags(pid, tagIds);
      }

      // 3) 지원폼 생성
      await api.createRecruitForm({
        post_id: pid,
        deadline: deadline(),
        max_recruits: maxRecruits(),
        questions: questions(),
      });

      alert('작성 완료되었습니다.');
      navigate(`/post/${pid}/recruit`);
    } catch (err: any) {
      alert(`작성 실패\n${err.message ?? err}`);
    } finally {
      setSubmitting(false);
    }
  };

  const isTagActive = (id: number) => selectedTagIds().includes(id);

  const canSubmit =
    !!title().trim() &&
    !!content().trim() &&
    !!deadline().trim() &&
    maxRecruits() >= 1;

  return (
    <div class="max-w-6xl mx-auto p-6 bg-gray-100">
      {/* 하나의 흰 배경 카드 안에 두 섹션 배치 */}
      <form onSubmit={handleComplete} class="bg-white rounded-2xl shadow-md p-6 md:p-8">
        <div class="grid grid-cols-1 md:grid-cols-2">
          {/* 좌측: 게시글 작성 */}
          <section class="pr-0 md:pr-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">게시글 작성</h2>
            <div class="space-y-4">
              <input
                class="w-full p-3 rounded-lg  bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="제목"
                value={title()}
                onInput={(e) => setTitle(e.currentTarget.value)}
              />
              <input
                class="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="카테고리(문자 입력)"
                value={categoryText()}
                onInput={(e) => setCategoryText(e.currentTarget.value)}
              />
              <textarea
                class="w-full h-40 p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="내용"
                value={content()}
                onInput={(e) => setContent(e.currentTarget.value)}
              />

              {/* 사진 첨부 */}
              <div>
                <label class="text-sm block mb-1 text-gray-700">사진 첨부</label>
                <input
                  type="file"
                  accept="image/*"
                  class="block w-full text-sm text-gray-700
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-primary_color_3
                         hover:file:bg-blue-100"
                  onChange={(e) => {
                    // 기존 미리보기 URL 정리
                    const prev = imagePreview();
                    if (prev) URL.revokeObjectURL(prev);

                    const file = e.currentTarget.files?.[0] || null;
                    setImageFile(file);
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setImagePreview(url);
                    } else {
                      setImagePreview(null);
                    }
                  }}
                />
                <Show when={imagePreview()}>
                  <img
                    src={imagePreview()!}
                    alt="미리보기"
                    class="mt-3 max-h-48 rounded-lg border border-gray-200 object-contain"
                  />
                </Show>
              </div>

              {/* 태그 */}
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">태그</span>
                  <span class="text-xs text-gray-500">선택 {selectedTagIds().length}개</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <For each={tags()}>
                    {(t) => (
                      <button
                        type="button"
                        class={`px-3 py-1.5 rounded-full text-sm transition ${
                          isTagActive(t.id)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                        }`}
                        onClick={() => toggleTag(t.id)}
                      >
                        {t.name}
                      </button>
                    )}
                  </For>
                </div>
              </div>
            </div>
          </section>

          {/* 우측: 아주 은은한 구분선 + 지원폼 */}
          <section class="mt-8 md:mt-0 pt-8 md:pt-0 md:pl-8 border-t md:border-t-0 md:border-l border-gray-200">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">지원폼 작성</h2>
            <div class="grid grid-cols-2 gap-3">
              <div class="col-span-2">
                <label class="text-sm block mb-1 text-gray-700">마감일</label>
                <input
                  type="date"
                  class="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  value={deadline()}
                  onInput={(e) => setDeadline(e.currentTarget.value)}
                />
              </div>
              <div>
                <label class="text-sm block mb-1 text-gray-700">모집 인원</label>
                <input
                  type="number"
                  min="1"
                  class="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  value={maxRecruits()}
                  onInput={(e) => setMaxRecruits(parseInt(e.currentTarget.value || '1', 10))}
                />
              </div>
              <div class="flex items-end">
                <button
                  type="button"
                  class="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300 w-full shadow-sm"
                  onClick={addQuestion}
                >
                  질문 추가
                </button>
              </div>
            </div>

            <div class="space-y-3 mt-4">
              <For each={questions()}>
                {(q, i) => (
                  <div class="space-y-2 rounded-lg p-4 bg-gray-50 border border-gray-300 shadow-sm">
                    <div class="grid grid-cols-2 gap-2">
                      <input
                        class="p-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400 col-span-2"
                        placeholder="라벨"
                        value={q.label}
                        onInput={(e) => updateQuestion(i(), { label: e.currentTarget.value })}
                      />
                      <select
                        class="p-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400 col-span-2"
                        value={q.question_type}
                        onChange={(e) =>
                          updateQuestion(i(), { question_type: e.currentTarget.value as NewQuestion['question_type'] })
                        }
                      >
                        <option value="text">text</option>
                        <option value="file">file</option>
                      </select>
                      <label class="flex items-center gap-2 col-span-2">
                        <input
                          type="checkbox"
                          checked={q.required}
                          onChange={(e) => updateQuestion(i(), { required: e.currentTarget.checked })}
                        />
                        <span class="text-gray-700">필수</span>
                      </label>
                    </div>
                    <button
                      type="button"
                      class="px-3 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 w-full shadow-sm"
                      onClick={() => removeQuestion(i())}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </For>
              <Show when={questions().length === 0}>
                <div class="text-sm text-gray-500">질문이 없습니다. “질문 추가”로 만들 수 있어요.</div>
              </Show>
            </div>
          </section>
        </div>

        {/* 카드 내부 하단 - 한 번만 보이는 제출 버튼 */}
        <div class="mt-8">
          <button
            type="submit"
            class="bg-primary_color_3 text-white px-4 py-3 rounded-lg w-full shadow-md hover:bg-primary_color_2 transition active:scale-[0.99]"
            disabled={!canSubmit || submitting()}
          >
            작성완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPostPage;
