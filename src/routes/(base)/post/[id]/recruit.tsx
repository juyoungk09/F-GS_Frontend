import { useParams } from "@solidjs/router";
import { createSignal, onMount, Show, For } from "solid-js";

const BASE = "https://fg.sunrin.kr";
const API_ENDPOINTS = {
  getPost: (id: number) => `${BASE}/api/posts/${id}`,
  getRecruitForm: (postId: number) => `${BASE}/api/posts/${postId}/form`,
  submitAnswers: (formId: number) => `${BASE}/api/posts/private/form/${formId}/answer`,
};

type Question = {
  id: number;
  label: string;
  question_type: "text" | "file";
  required: boolean;
  is_file: boolean;
};

type RecruitForm = {
  id: number;
  post_id: number;
  deadline?: string;
  max_recruits?: number;
  questions: Question[];
};



const PostRecruitForm = () => {
  const params = useParams();

  const [post, setPost] = createSignal<any>(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<Error | null>(null);

  const [formLoading, setFormLoading] = createSignal(false);
  const [formError, setFormError] = createSignal<string | null>(null);
  const [form, setForm] = createSignal<RecruitForm | null>(null);

  // 답변 상태
  const [answers, setAnswers] = createSignal<Record<number, any>>({});
  const [submitLoading, setSubmitLoading] = createSignal(false);

  // 제출 시 필수 미입력 문항 표시
  const [invalidIds, setInvalidIds] = createSignal<Set<number>>(new Set());

  // 숨김 파일 input refs
  const fileInputs: Record<number, HTMLInputElement | undefined> = {};

  const loadForm = async (postId: number) => {
    try {
      setFormLoading(true);
      const response = await fetch(API_ENDPOINTS.getRecruitForm(postId), {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to load form');
      }
      
      const formData = await response.json();
      setForm(formData);
      setInvalidIds(new Set());
      setAnswers({});
    } catch (error) {
      console.error('Error loading form:', error);
      setFormError('폼을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setFormLoading(false);
    }
  };

  // 유효성 체크
  const isFilled = (q: Question, v: any) => {
    if (q.is_file) {
      if (!q.required) return true;
      return v instanceof File;
    }
    return typeof v === "string" && v.trim().length > 0;
  };

  const requiredQuestions = () =>
    form()?.questions.filter((q) => q.required) ?? [];

  const answeredCount = () => {
    const a = answers();
    return requiredQuestions().reduce(
      (cnt, q) => (isFilled(q, a[q.id]) ? cnt + 1 : cnt),
      0
    );
  };

  const progress = () => {
    const total = requiredQuestions().length || 1;
    return Math.min(100, Math.round((answeredCount() / total) * 100));
  };

  // 페이로드 생성
  const buildPayload = () => {
    const f = form()!;
    const a = answers();
    const fd = new FormData();
    fd.append("form_id", String(f.id));
    fd.append("post_id", String(post()!.id));

    const nonFileAnswers = f.questions
      .filter((q) => !q.is_file)
      .map((q) => ({ question_id: q.id, value: a[q.id] }));

    fd.append("answers_json", JSON.stringify(nonFileAnswers));

    for (const q of f.questions) {
      if (!q.is_file) continue;
      const file = a[q.id];
      if (file instanceof File) fd.append(`file_${q.id}`, file);
    }
    return fd;
  };

  // 제출
  const handleSubmit = async () => {
    const f = form();
    if (!f) return;

    const a = answers();
    const missing = new Set<number>();
    for (const q of f.questions) {
      if (!q.required) continue;
      if (!isFilled(q, a[q.id])) missing.add(q.id);
    }
    setInvalidIds(missing);

    if (missing.size > 0) return;

    setSubmitLoading(true);
    try {
      const body = buildPayload();
      const res = await fetch(API_ENDPOINTS.submitAnswers(f.id), {
        method: "POST",
        credentials: "include",
        body,
      });
      if (!res.ok) {
        console.error("Submit failed:", res.status);
        alert("제출 실패");
        return;
      }
      alert("제출 완료!");
    } catch (e) {
      console.error("Submit error:", e);
      alert("제출 에러");
    } finally {
      setSubmitLoading(false);
    }
  };

  const baseInputClass =
    "mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none text-gray-900 transition focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400";

  const qBoxClass = (q: Question) =>
    `rounded-xl p-4 transition ${
      invalidIds().has(q.id)
        ? "border-2 border-red-500 bg-red-50/40"
        : "border border-gray-100 bg-gray-50/70 hover:bg-white hover:shadow-sm hover:border-indigo-200"
    }`;

  const renderInput = (q: Question) => {
    const v = () => answers()[q.id] ?? "";

    if (q.is_file) {
      const file: File | null = answers()[q.id] ?? null;
      return (
        <div class="mt-2">
          <div class="flex items-center gap-2">
            <input
              ref={(el) => (fileInputs[q.id] = el)}
              type="file"
              class="hidden"
              onChange={(e) => {
                const f =
                  (e.currentTarget.files && e.currentTarget.files[0]) || null;
                setAnswers((prev) => ({ ...prev, [q.id]: f }));
                e.currentTarget.value = "";
                if (f && invalidIds().has(q.id)) {
                  const next = new Set(invalidIds());
                  next.delete(q.id);
                  setInvalidIds(next);
                }
              }}
            />
            <button
              type="button"
              class={`px-3 py-2 rounded-xl border ${
                invalidIds().has(q.id) ? "border-red-500" : "border-gray-200 text-gray-900"
              } bg-white hover:bg-gray-50 active:scale-[0.99] transition`}
              onClick={() => fileInputs[q.id]?.click()}
            >
              파일 추가
            </button>

            <Show when={file}>
              <span class="text-sm text-gray-700 max-w-[220px] truncate">
                {file!.name}
              </span>
              <button
                type="button"
                class="text-xs text-red-600 hover:underline"
                onClick={() =>
                  setAnswers((prev) => ({ ...prev, [q.id]: null }))
                }
              >
                X
              </button>
            </Show>
          </div>
        </div>
      );
    }

    // text
    return (
      <input
        type="text"
        class={baseInputClass}
        value={v()}
        onInput={(e) => {
          setAnswers((prev) => ({
            ...prev,
            [q.id]: (e.currentTarget as HTMLInputElement).value,
          }));
          if (invalidIds().has(q.id)) {
            const next = new Set(invalidIds());
            next.delete(q.id);
            setInvalidIds(next);
          }
        }}
      />
    );
  };

  onMount(async () => {
    try {
      setLoading(true);
      const id = parseInt(params.id, 10);
      
      // Fetch post data
      const postResponse = await fetch(API_ENDPOINTS.getPost(id), {
        credentials: 'include',
      });
      
      if (!postResponse.ok) {
        throw new Error('Failed to load post');
      }
      
      const postData = await postResponse.json();
      setPost(postData);
      
      // Load form data
      await loadForm(id);
      
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err : new Error('데이터를 불러오는 중 오류가 발생했습니다.'));
    } finally {
      setLoading(false);
    }
  });

  return (
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Show when={post()}>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Post Details */}
            <div class="lg:col-span-2">
              <div class="bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                <div class="p-8">
                  <div class="flex justify-between items-start">
                    <div>
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mb-4">
                        {post()!.category}
                      </span>
                      <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">
                        {post()!.title}
                      </h1>
                      <div class="mt-2 flex items-center text-sm text-gray-500">
                        <span>작성일: {new Date(post()!.created_at).toLocaleDateString()}</span>
                        <span class="mx-2">•</span>
                        <span>마감일: {form()?.deadline ? new Date(form()!.deadline!).toLocaleDateString() : '상시모집'}</span>
                      </div>
                    </div>
                    <div class="px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm">
                      {post()!.is_finished ? '모집 마감' : '모집 중'}
                    </div>
                  </div>

                  <div class="mt-8 prose prose-indigo prose-lg text-gray-700 max-w-none">
                    <p class="text-lg leading-relaxed">{post()!.content}</p>
                  </div>

                  <div class="mt-8 pt-6 border-t border-gray-100">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">기술 스택</h3>
                    <div class="flex flex-wrap gap-2">
                      <For each={post()!.tags}>
                        {(tag) => (
                          <span
                            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                            style={{
                              backgroundColor: `${tag.color}15`,
                              color: tag.color,
                              border: `1px solid ${tag.color}40`
                            }}
                          >
                            {tag.name}
                          </span>
                        )}
                      </For>
                    </div>
                  </div>

                  <div class="mt-8 pt-6 border-t border-gray-100">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">모집 정보</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="flex items-start">
                        <div class="flex-shrink-0 h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                          <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div class="ml-4">
                          <p class="text-sm font-medium text-gray-500">모집 인원</p>
                          <p class="text-lg font-semibold text-gray-900">{post()!.current_recruits} / {post()!.max_recruits}명</p>
                        </div>
                      </div>
                      <div class="flex items-start">
                        <div class="flex-shrink-0 h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                          <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div class="ml-4">
                          <p class="text-sm font-medium text-gray-500">마감일</p>
                          <p class="text-lg font-semibold text-gray-900">
                            {form()?.deadline ? new Date(form()!.deadline).toLocaleDateString() : '상시모집'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-8 pt-6 border-t border-gray-100">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">작성자 정보</h3>
                    <div class="flex items-center">
                      <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span class="text-indigo-600 font-medium">
                          {post()!.author.name.charAt(0)}
                        </span>
                      </div>
                      <div class="ml-4">
                        <p class="text-sm font-medium text-gray-900">{post()!.author.name}</p>
                        <p class="text-sm text-gray-500">{post()!.author.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Application Form */}
            <div class="lg:col-span-1">
              <div class="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-8 transition-all duration-300 hover:shadow-md">
                <div class="p-8">
                  <div class="text-center mb-8">
                    <h2 class="text-2xl font-bold text-gray-900">지원하기</h2>
                    <p class="mt-2 text-sm text-gray-600">
                      {answeredCount()} / {requiredQuestions().length} 필수 질문에 답변하셨습니다.
                    </p>
                  </div>

                  <div class="mb-6">
                    <div class="flex justify-between text-sm font-medium text-gray-700 mb-1">
                      <span>작성 진행도</span>
                      <span>{progress()}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        class="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${progress()}%` }}
                      ></div>
                    </div>
                  </div>

                  <Show when={form()}>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }} class="space-y-6">
                      <For each={form()!.questions}>
                        {(q) => (
                          <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">
                              {q.label}
                              {q.required && <span class="text-red-500 ml-1">*</span>}
                            </label>
                            {renderInput(q)}
                            {invalidIds().has(q.id) && (
                              <p class="mt-1 text-sm text-red-600">
                                이 필드는 필수입니다.
                              </p>
                            )}
                          </div>
                        )}
                      </For>

                      <div class="pt-2">
                        <button
                          type="submit"
                          disabled={submitLoading() || post()?.is_finished}
                          class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r bg-primary_color_3 hover:bg-primary_color_2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                          {submitLoading() ? (
                            <>
                              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              제출 중...
                            </>
                          ) : post()?.is_finished ? (
                            '모집이 마감되었습니다'
                          ) : (
                            '지원서 제출하기'
                          )}
                        </button>
                        
                        <p class="mt-3 text-xs text-center text-gray-500">
                          제출 후에는 수정이 불가능하니 신중하게 작성해주세요.
                        </p>
                      </div>
                    </form>
                  </Show>

                  <Show when={!form()}>
                    <div class="text-center py-8">
                      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 class="mt-2 text-sm font-medium text-gray-900">지원 폼을 찾을 수 없습니다.</h3>
                      <p class="mt-1 text-sm text-gray-500">관리자에게 문의해주세요.</p>
                    </div>
                  </Show>
                </div>
              </div>
            </div>
          </div>
        </Show>

        <Show when={error()}>
          <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">
                  오류가 발생했습니다: {error()?.message}
                </p>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default PostRecruitForm;
