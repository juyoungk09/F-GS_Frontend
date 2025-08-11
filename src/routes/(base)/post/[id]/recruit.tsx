import { useParams, useNavigate } from "@solidjs/router";
import { createSignal, onMount, Show, For } from "solid-js";

const BASE = "https://1a4df77629fb.ngrok-free.app";
const API_ENDPOINTS = {
  submitAnswers: (formId: number) => `${BASE}/api/posts/private/form/${formId}/answers`,
};

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

type Question = {
  id: number;
  label: string;
  question_type: "text"  | "file";
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

/** ✅ 지원폼 더미데이터 */
const dummyForms: RecruitForm[] = [
  {
    id: 101,
    post_id: 1,
    deadline: "2025-08-20T23:59:59Z",
    max_recruits: 3,
    questions: [
      { id: 1, label: "자기소개.", question_type: "text", required: true, is_file: false },
      { id: 2, label: "이메일 주소를 입력해 주세요.", question_type: "text", required: true, is_file: false },
      { id: 3, label: "연락 가능한 전화번호를 입력해 주세요.", question_type: "text", required: true, is_file: false },
      { id: 4, label: "포트폴리오 파일을 업로드해 주세요.", question_type: "file", required: false, is_file: true },
    ],
  },
];

const PostDetail = () => {
  const params = useParams();
  const navigate = useNavigate();

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

  const loadDummyForm = (postId: number) => {
    setFormError(null);
    const found = dummyForms.find((f) => f.post_id === postId) || null;
    setForm(found);
    setInvalidIds(new Set());
    setAnswers({}); // 폼 로드시만 초기화
  };

  // 유효성 체크
  const isFilled = (q: Question, v: any) => {
    if (q.is_file) {
      if (!q.required) return true;
      return v instanceof File;
    }
    return typeof v === "string" && v.trim().length > 0;
  };

  const requiredQuestions = () => (form()?.questions.filter(q => q.required) ?? []);
  const answeredCount = () => {
    const a = answers();
    return requiredQuestions().reduce((cnt, q) => (isFilled(q, a[q.id]) ? cnt + 1 : cnt), 0);
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
        return;
      }
      alert("제출 완료!");
    } catch (e) {
      console.error("Submit error:", e);
    } finally {
      setSubmitLoading(false);
    }
  };

  const baseInputClass =
    "mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none text-gray-900 transition " +
    "focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400";

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
                const f = (e.currentTarget.files && e.currentTarget.files[0]) || null;
                setAnswers(prev => ({ ...prev, [q.id]: f }));
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
              class={`px-3 py-2 rounded-xl border ${invalidIds().has(q.id) ? "border-red-500" : "border-gray-200"} bg-white hover:bg-gray-50 active:scale-[0.99] transition`}
              onClick={() => fileInputs[q.id]?.click()}
            >
              파일 추가
            </button>

            <Show when={file}>
              <span class="text-sm text-gray-700 max-w-[220px] truncate">{file!.name}</span>
              <button
                type="button"
                class="text-xs text-red-600 hover:underline"
                onClick={() => setAnswers(prev => ({ ...prev, [q.id]: null }))}
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
          setAnswers(prev => ({ ...prev, [q.id]: (e.currentTarget as HTMLInputElement).value }));
          if (invalidIds().has(q.id)) {
            const next = new Set(invalidIds());
            next.delete(q.id);
            setInvalidIds(next);
          }
        }}
      />
    );
  };

  onMount(() => {
    const id = parseInt(params.id, 10);
    const found = dummyPosts.find((p) => p.id === id);
    if (found) {
      setPost(found);
      loadDummyForm(found.id);
    } else {
      setError(new Error("해당 게시글을 찾을 수 없습니다."));
    }
    setLoading(false);
  });

  return (
    <div class="w-full">
      <div class="flex flex-col">
        <div class="flex-grow">
          <div class="px-4 py-8">
            <Show when={post()}>
              <div class="mx-auto flex w-full max-w-[1400px] flex-col gap-6 lg:flex-row">
                {/* 게시글 */}
                <article class="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-lg lg:w-[48%]">
                  <h1 class="text-3xl font-bold text-[#2D336B]">{post()!.title}</h1>
                  <p class="mb-2 text-sm text-gray-500">
                    카테고리: <span class="text-[#7886C7]">{post()!.category}</span> · 작성일:{" "}
                    {new Date(post()!.created_at).toLocaleString()}
                  </p>
                  <p class="mb-6 text-gray-800">{post()!.content}</p>
                  <h2 class="text-xl font-semibold text-[#2D336B]">태그</h2>
                  <div class="flex flex-wrap gap-2 mb-4">
                    <For each={post()!.tags}>
                      {(tag) => (
                        <span class="rounded-full px-3 py-1 text-xs font-medium text-white" style={{ "background-color": tag.color }}>
                          {tag.name}
                        </span>
                      )}
                    </For>
                  </div>
                  <h2 class="text-xl font-semibold text-[#2D336B]">모집 중인 참가자</h2>
                  <ul class="list-disc list-inside">
                    <For each={post()!.recruiters}>
                      {(r) => <li>{r.name} ({r.email})</li>}
                    </For>
                  </ul>
                  <p class="mt-4 text-gray-600">
                    작성자: <span class="text-[#7886C7]">{post()!.author.name}</span> ({post()!.author.email})
                  </p>
                </article>

                {/* 지원폼 */}
                <article class="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-lg lg:w-[48%]">
                  <div class="mb-3 flex items-center justify-between">
                    <div>
                      <h1 class="text-3xl font-bold text-[#2D336B]">지원폼</h1>
                      <p class="mt-1 text-xs text-gray-500">
                        {answeredCount()} / {requiredQuestions().length} 문항 작성됨
                      </p>
                    </div>
                    <button
                      class="rounded-xl border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={() => {
                        if (!post()) return;
                        setFormLoading(true);
                        setTimeout(() => {
                          loadDummyForm(post().id);
                          setFormLoading(false);
                        }, 200);
                      }}
                    >
                      새로고침
                    </button>
                  </div>

                  <div class="mb-5 h-2 w-full rounded-full bg-gray-100">
                    <div
                      class="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-[width] duration-200"
                      style={{ width: `${progress()}%` }}
                    />
                  </div>

                  <Show when={form()}>
                    <div class="mb-4 text-sm text-gray-600">
                      폼 ID: {form()!.id} · 마감일: {form()!.deadline ? new Date(form()!.deadline!).toLocaleDateString() : "미설정"} · 모집인원: {form()!.max_recruits ?? "-"}
                    </div>

                    <div class="space-y-3">
                      <For each={form()!.questions}>
                        {(q) => (
                          <div class={qBoxClass(q)}>
                            <div class="mb-2 text-[15px] font-semibold text-[#2D336B]">{q.label}</div>
                            {renderInput(q)}
                          </div>
                        )}
                      </For>
                    </div>

                    <div class="mt-6">
                      <button
                        class="w-full rounded-xl bg-primary_color_3 from-[#2D336B] to-[#1f2553] px-4 py-3 text-white shadow hover:bg-primary_color_2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={submitLoading()}
                        onClick={handleSubmit}
                      >
                        {submitLoading() ? "제출 중..." : "제출"}
                      </button>
                    </div>
                  </Show>
                </article>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
