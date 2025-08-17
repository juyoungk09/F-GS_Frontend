import { createSignal, createResource, For, Show, onCleanup } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { useNavigate } from '@solidjs/router';

type NewQuestion = {
  label: string;
  question_type: 'text' | 'file';
  required: boolean;
};

const BASE= 'https://fg.sunrin.kr/api/';

async function readErr(r: Response) {
  try {
    const txt = await r.text();
    return txt || r.statusText;
  } catch {
    return r.statusText;
  }
}

const api = {
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
const [allTags] = createResource<Tag[]>(async () => {
      const response = await fetch(`${BASE}/posts/tags`);
      return (await response.json()) as Tag[];
    });
  
    const [selectedTags, setSelectedTags] = createSignal<Tag[]>([]);
    const [activeTagType, setActiveTagType] = createSignal<string | null>(null);

    const tagTypes = new Map<string, string>([
        ["f", "프레임워크"],
        ["l", "언어"],
        ["o", "기타"],
        ["d", "직군"],
    ]);

    const filteredTags = () => {
        const tags = allTags();
        if (!tags) return [];
        if (!activeTagType()) return tags;
        return tags.filter(tag => tag.tag_type === activeTagType());
    };

    const toggleTag = (tag: Tag) => { // 태그 선택 / 취소
          setSelectedTags(prev => prev.includes(tag) ? prev.filter(selectedTag => selectedTag.id !== tag.id) : [...prev, tag]);
    };


    const [isDropdownOpen, setIsDropdownOpen] = createSignal(false);


  const [title, setTitle] = createSignal('');
  const [categoryText, setCategoryText] = createSignal('');
  const [content, setContent] = createSignal('');

  const [selectedTagIds, setSelectedTagIds] = createSignal<number[]>([]);
  const [deadline, setDeadline] = createSignal('');
  const [maxRecruits, setMaxRecruits] = createSignal(1);

  const [questions, setQuestions] = createStore<NewQuestion[]>([]);

  const [imageFile, setImageFile] = createSignal<File | null>(null);
  const [imagePreview, setImagePreview] = createSignal<string | null>(null);

  const [submitting, setSubmitting] = createSignal(false);
  const navigate = useNavigate();

  onCleanup(() => {
    const url = imagePreview();
    if (url) URL.revokeObjectURL(url);
  });

  const addQuestion = () =>
    setQuestions(
      produce((qs) => {
        qs.push({ label: '', question_type: 'text', required: false });
      }),
    );

  const removeQuestion = (idx: number) =>
    setQuestions(
      produce((qs) => {
        qs.splice(idx, 1);
      }),
    );

  const updateQuestion = (idx: number, patch: Partial<NewQuestion>) =>
    setQuestions(
      produce((qs) => {
        Object.assign(qs[idx], patch);
      }),
    );

  const handleComplete = async (e: Event) => {
    e.preventDefault();
    if (submitting()) return;

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

      const formData = new FormData();
      formData.append('title', title().trim());
      formData.append('content', content().trim());
      formData.append('category', categoryText().trim());
      if (imageFile()) formData.append('image', imageFile()!);

      const postRes = await fetch(`${BASE}/api/posts`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!postRes.ok) throw new Error(await readErr(postRes));
      const post = await postRes.json();
      const pid = post.id;

      const tagIds = selectedTagIds();
      if (tagIds.length > 0) {
        await api.setPostTags(pid, tagIds);
      }

      const qsPayload: NewQuestion[] = questions.map((q) => ({
        label: q.label,
        question_type: q.question_type,
        required: q.required,
      }));

      await api.createRecruitForm({
        post_id: pid,
        deadline: deadline(),
        max_recruits: maxRecruits(),
        questions: qsPayload,
      });

      alert('작성 완료되었습니다.');
      navigate(`/post/${pid}/recruit`);
    } catch (err: any) {
      alert(`작성 실패\n${err.message ?? err}`);
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit =
    !!title().trim() && !!content().trim() && !!deadline().trim() && maxRecruits() >= 1;

  return (
    <div class="min-h-screen bg-white flex flex-col">
      <main class="flex-1">
        <div class="max-w-6xl mx-auto p-6">
          <form onSubmit={handleComplete} class="bg-white rounded-2xl shadow-md p-6 md:p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* 좌측: 게시글 작성 + (이동) 마감/모집 */}
              <section class="pr-0 md:pr-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">게시글 작성</h2>

                <div class="space-y-4">
                  <input
                    class="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-black"
                    placeholder="제목"
                    value={title()}
                    onInput={(e) => setTitle(e.currentTarget.value)}
                  />
                  <input
                    class="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-black"
                    placeholder="카테고리"
                    value={categoryText()}
                    onInput={(e) => setCategoryText(e.currentTarget.value)}
                  />
                  <textarea
                    class="w-full h-40 p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-black"
                    placeholder="내용"
                    value={content()}
                    onInput={(e) => setContent(e.currentTarget.value)}
                  />

                  {/* (이동) 마감일 & 모집 인원 */}
                  <div class="grid grid-cols-2 gap-3">
                    <div class="col-span-2">
                      <label class="text-sm block mb-1 text-gray-700">마감일</label>
                      <input
                        type="date"
                        class="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-black"
                        value={deadline()}
                        onInput={(e) => setDeadline(e.currentTarget.value)}
                      />
                    </div>
                    <div>
                      <label class="text-sm block mb-1 text-gray-700">모집 인원</label>
                      <input
                        type="number"
                        min="1"
                        class="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-black"
                        value={maxRecruits()}
                        onInput={(e) =>
                          setMaxRecruits(parseInt(e.currentTarget.value || '1', 10))
                        }
                      />
                    </div>
                  </div>

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
                    
                    <button 
                    type='button'
                  class="text-gray-900 bg-primary_color_2 rounded-lg "
                  onClick={(e) => {
                    e.preventDefault(); 
                      setIsDropdownOpen(!isDropdownOpen());
                        }}>
                    태그
                  </button>
                  
                  <Show when={selectedTags().length > 0}>
                    <div class="mb-6">
                        <h3 class="text-sm font-medium text-gray-500 mb-2">선택된 태그:</h3>
                        <div class="flex flex-wrap gap-2">
                            {selectedTags().map(tag => (
                                <span class="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                                    {tag.name}
                                    <button 
                                        onClick={() => toggleTag(tag)}
                                        class="ml-1.5 text-blue-500 hover:text-blue-700"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </Show>

                  <Show when={isDropdownOpen()}>
                        <div class="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                            <div class="flex border-b-2 border-gray-200 overflow-x-auto scrollbar-0">
                                <button 
                                    type='button'
                                    class={`px-4 py-2 flex-shrink-0 ${!activeTagType() ? 'border-b-2 border-primary_color_3 text-primary_color_3' : 'text-gray-600'}`}
                                    onClick={() => setActiveTagType(null)}
                                >
                                    전체
                                </button>
                                {Array.from(tagTypes).map(([t, tagType]) => (
                                    <button 
                                        type='button'
                                        class={`px-4 py-2 flex-shrink-0 ${activeTagType() === t ? 'border-b-2 border-primary_color_3 text-primary_color_3' : 'text-gray-600'}`}
                                        onClick={() => setActiveTagType(t)}
                                    >
                                        {tagType}
                                    </button>
                                ))}
                            </div>
                            <div class="max-h-60 overflow-y-auto p-3">
                                <div class="flex flex-wrap gap-2">
                                    {filteredTags().map(tag => (
                                        <button
                                            type='button'
                                            onClick={() => toggleTag(tag)}
                                            class={`px-3 py-1 rounded-full text-sm`}
                                            style={{ 'background-color': `${ selectedTags().includes(tag) ? '#7886C7' : tag.bg_color}`, color: `${selectedTags().includes(tag) ? 'white' : tag.font_color}` }}
                                        >
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Show>
                </div>
              </section>

              {/* 우측: 질문 목록 + (아래) 질문 추가 버튼만 */}
              <section class="mt-8 md:mt-0 pt-8 md:pt-0 md:pl-8 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">지원폼 작성</h2>

                {/* 질문 리스트가 위에 쌓이도록 먼저 배치 */}
                <div class="space-y-3 mb-4">
                  <For each={questions}>
                    {(q, i) => (
                      <div class="space-y-2 rounded-lg p-4 bg-gray-50 border border-gray-300 shadow-sm">
                        <div class="grid grid-cols-2 gap-2">
                          <input
                            class="p-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400 col-span-2 text-black"
                            placeholder="질문 라벨"
                            value={q.label ?? ''}
                            onCompositionStart={(e) => ((e.currentTarget as any)._composing = true)}
                            onCompositionEnd={(e) => {
                              (e.currentTarget as any)._composing = false;
                              updateQuestion(i(), { label: e.currentTarget.value });
                            }}
                            onInput={(e) => {
                              const el = e.currentTarget as any;
                              if (el._composing) return;
                              updateQuestion(i(), { label: e.currentTarget.value });
                            }}
                          />
                          <select
                            class="p-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400 col-span-2 text-black"
                            value={q.question_type}
                            onChange={(e) =>
                              updateQuestion(i(), {
                                question_type: e.currentTarget
                                  .value as NewQuestion['question_type'],
                              })
                            }
                          >
                            <option value="text">text</option>
                            <option value="file">file</option>
                          </select>
                          <label class="flex items-center gap-2 col-span-2">
                            <input
                              type="checkbox"
                              checked={q.required}
                              onChange={(e) =>
                                updateQuestion(i(), { required: e.currentTarget.checked })
                              }
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

                  <Show when={questions.length === 0}>
                    <div class="text-sm text-gray-500">
                      질문이 없습니다. 아래의 “질문 추가” 버튼을 눌러 만들어 보세요.
                    </div>
                  </Show>
                </div>

                {/* 아래쪽에 고정되는 추가 버튼 */}
                <button
                  type="button"
                  class="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300 w-full shadow-sm"
                  onClick={addQuestion}
                >
                  질문 추가
                </button>
              </section>
            </div>

            {/* 제출 버튼 */}
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
      </main>
    </div>
  );
};

export default NewPostPage;
