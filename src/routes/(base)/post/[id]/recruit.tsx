// 라우터와 SolidJS의 핵심 기능을 가져옵니다.
import { useParams } from "@solidjs/router";
import { createSignal, onMount, Show, For } from "solid-js";
import { BASE_URL } from "~/stores/store";
// API 기본 URL을 상수로 정의합니다.

// API 엔드포인트들을 객체로 관리합니다.
const API_ENDPOINTS = {
  // 특정 폼 ID에 대한 답변 제출 엔드포인트를 생성하는 함수
  submitAnswers: (formId: number) =>
    `${BASE_URL}/posts/private/form/${formId}/answer`,
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

// 질문 유형을 정의하는 타입
// - id: 질문 고유 식별자
// - label: 질문 내용
// - question_type: 질문 유형 (텍스트 또는 파일)
// - required: 필수 여부
// - is_file: 파일 업로드 여부
// - description: 질문에 대한 추가 설명 (선택사항)
type Question = {
  id: number;
  label: string;
  question_type: "text" | "file";
  required: boolean;
  is_file: boolean;
  description?: string;
};

// 모집 폼 유형을 정의하는 타입
// - id: 폼 고유 식별자
// - post_id: 연결된 게시글 ID
// - deadline: 모집 마감일 (선택사항)
// - max_recruits: 최대 모집 인원 (선택사항)
// - questions: 질문 목록
type RecruitForm = {
  id: number;
  post_id: number;
  deadline?: string;
  max_recruits?: number;
  questions: Question[];
};

const dummyForms: RecruitForm[] = [
  {
    id: 101,
    post_id: 1,
    deadline: "2025-08-20T23:59:59Z",
    max_recruits: 3,
    questions: [
      {
        id: 1,
        label: "자기소개.",
        question_type: "text",
        required: true,
        is_file: false,
      },
      {
        id: 2,
        label: "이메일 주소를 입력해 주세요.",
        question_type: "text",
        required: true,
        is_file: false,
      },
      {
        id: 3,
        label: "연락 가능한 전화번호를 입력해 주세요.",
        question_type: "text",
        required: true,
        is_file: false,
      },
      {
        id: 4,
        label: "포트폴리오 파일을 업로드해 주세요.",
        question_type: "file",
        required: false,
        is_file: true,
      },
    ],
  },
];

// 모집 폼 컴포넌트
const PostRecruitForm = () => {
  // URL 파라미터를 가져옵니다.
  const params = useParams();

  // 게시글 관련 상태
  const [post, setPost] = createSignal<any>(null); // 현재 게시글 데이터
  const [error, setError] = createSignal<Error | null>(null); // 에러 상태

  // 폼 관련 상태
  const [formError, setFormError] = createSignal<string | null>(null); // 폼 에러 메시지
  const [form, setForm] = createSignal<RecruitForm | null>(null); // 폼 데이터

  // 답변 관련 상태
  const [answers, setAnswers] = createSignal<Record<number, any>>({}); // 사용자 답변 저장
  const [submitLoading, setSubmitLoading] = createSignal(false); // 제출 중 상태

  // 유효성 검사 관련
  const [invalidIds, setInvalidIds] = createSignal<Set<number>>(new Set()); // 유효하지 않은 필드 ID 집합

  // 파일 입력을 위한 참조 객체
  // 각 질문 ID에 해당하는 파일 입력 요소를 저장합니다.
  const fileInputs: Record<number, HTMLInputElement | undefined> = {};

  // 더미 폼 데이터를 로드하는 함수
  const loadDummyForm = (postId: number) => {
    setFormError(null); // 에러 상태 초기화
    
    // postId에 해당하는 폼을 더미 데이터에서 찾습니다.
    const found = dummyForms.find((f) => f.post_id === postId) || null;
    setForm(found); // 찾은 폼 데이터 설정
    
    // 유효성 검사 상태 초기화
    setInvalidIds(new Set<number>());
    
    // 답변 상태 초기화 (새 폼 로드 시 기존 답변 제거)
    setAnswers({});
  };

  // 필드가 유효하게 채워졌는지 확인하는 함수
  const isFilled = (q: Question, v: any) => {
    // 파일 타입인 경우
    if (q.is_file) {
      // 필수가 아닌 경우 항상 유효
      if (!q.required) return true;
      // File 객체인지 확인
      return v instanceof File;
    }
    // 텍스트 타입인 경우 빈 문자열이 아닌지 확인
    return typeof v === "string" && v.trim().length > 0;
  };

  // 필수 질문 목록을 반환하는 함수
  const requiredQuestions = () =>
    form()?.questions.filter((q) => q.required) ?? [];

  // 완료된 필수 질문 수를 계산하는 함수
  const answeredCount = () => {
    const a = answers(); // 현재 답변 상태 가져오기
    // 필수 질문 중 유효하게 답변된 질문 수 계산
    return requiredQuestions().reduce(
      (cnt, q) => (isFilled(q, a[q.id]) ? cnt + 1 : cnt),
      0 // 초기값 0
    );
  };

  // 진행률을 계산하는 함수 (0~100%)
  const progress = () => {
    const total = requiredQuestions().length || 1; // 0으로 나누기 방지
    return Math.min(100, Math.round((answeredCount() / total) * 100));
  };

  // 서버로 전송할 데이터를 생성하는 함수
  const buildPayload = () => {
    const f = form()!; // 현재 폼 데이터
    const a = answers(); // 사용자 답변 데이터
    
    // FormData 객체 생성 (파일 업로드를 위해 사용)
    const fd = new FormData();
    
    // 기본 정보 추가
    fd.append("form_id", String(f.id)); // 폼 ID
    fd.append("post_id", String(post()!.id)); // 게시글 ID

    // 파일이 아닌 답변들만 필터링하여 JSON 형태로 변환
    const nonFileAnswers = f.questions
      .filter((q) => !q.is_file) // 파일 타입이 아닌 질문만 필터링
      .map((q) => ({
        question_id: q.id, // 질문 ID
        value: a[q.id] ?? '' // 답변 값 (없으면 빈 문자열)
      }));

    // JSON 문자열로 변환하여 추가
    fd.append("answers_json", JSON.stringify(nonFileAnswers));

    // 파일 타입 질문 처리
    for (const q of f.questions) {
      if (!q.is_file) continue; // 파일 타입이 아니면 건너뜀
      
      const file = a[q.id]; // 파일 객체 가져오기
      if (file instanceof File) {
        // 파일이 유효한 File 객체인 경우에만 추가
        // 파일명을 `file_질문ID` 형식으로 설정
        fd.append(`file_${q.id}`, file);
      }
    }
    
    return fd; // 완성된 FormData 반환
  };

  // 폼 제출 처리 함수
  const handleSubmit = async () => {
    const f = form();
    if (!f) return; // 폼이 없으면 종료

    const a = answers(); // 현재 답변 가져오기
    const missing = new Set<number>(); // 누락된 필수 항목 ID 저장용 Set
    
    // 필수 질문 검사
    for (const q of f.questions) {
      if (!q.required) continue; // 필수가 아니면 건너뜀
      if (!isFilled(q, a[q.id])) {
        missing.add(q.id); // 필수 항목이 비어있으면 추가
      }
    }
    
    setInvalidIds(missing); // 유효하지 않은 필드 ID 설정 (UI에 표시용)

    if (missing.size > 0) {
      // 필수 항목이 누락된 경우 제출 중지
      return;
    }

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
  const baseInputClass = "mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none text-gray-900 transition focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400";

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
            <input ref={(el) => (fileInputs[q.id] = el)} type="file" class="hidden" onChange={(e) => {
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
      <input type="text" class={baseInputClass} value={v()} onInput={(e) => {
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

  return (
    <div class="flex flex-col min-h-screen bg-white">
      <main class="flex-grow">
        <div class="px-4 py-8">
          <Show when={post()}>
            <div class="mx-auto flex w-full max-w-[1400px] flex-col gap-6 lg:flex-row">
              {/* 게시글 */}
              <article class="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-lg lg:w-[48%]">
                <h1 class="text-3xl font-bold text-[#2D336B]">
                  {post()!.title}
                </h1>
                <p class="mb-2 text-sm text-gray-500">
                  카테고리:{" "}
                  <span class="text-[#7886C7]">{post()!.category}</span> ·
                  작성일: {new Date(post()!.created_at).toLocaleString()}
                </p>
                <div class="mb-4 text-sm text-gray-600">
                     마감일:{" "}
                    {form()!.deadline
                      ? new Date(form()!.deadline!).toLocaleDateString()
                      : "미설정"}{" "}
                    · 모집인원: {form()!.max_recruits ?? "-"}
                  </div>
                <p class="mb-6 text-gray-800">{post()!.content}</p>
                
                <h2 class="text-xl font-semibold text-[#2D336B]">태그</h2>
                <div class="flex flex-wrap gap-2 mb-4">
                  <For each={post()!.tags}>
                    {(tag) => (
                      <span
                        class="rounded-full px-3 py-1 text-xs font-medium text-white"
                        style={{ "background-color": tag.color }}
                      >
                        {tag.name}
                      </span>
                    )}
                  </For>
                </div>
                <h2 class="text-xl font-semibold text-[#2D336B]">
                  모집 중인 참가자
                </h2>
                <ul class="list-disc list-inside text-gray-600">
                  <For each={post()!.recruiters}>
                    {(r) => <li>{r.name} ({r.email})</li>}
                  </For>
                </ul>
                <p class="mt-4 text-gray-600">
                  작성자:{" "}
                  <span class="text-[#7886C7]">{post()!.author.name}</span> (
                  {post()!.author.email})
                </p>
              </article>

              {/* 지원폼 */}
              <article class="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-lg lg:w-[48%]">
                <div class="mb-3 flex items-center justify-between">
                  <div>
                    <h1 class="text-3xl font-bold text-[#2D336B]">지원폼</h1>
                    <p class="mt-1 text-xs text-gray-500">
                      {answeredCount()} / {requiredQuestions().length} 문항
                      작성됨
                    </p>
                  </div>
                  <button
                    class="rounded-xl border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 text-gray-900"
                    onClick={() => {
                      if (!post()) return;
                      setTimeout(() => {
                        loadDummyForm(post().id);
                      }, 200);
                    }}
                  >
                    {submitLoading() ? "로딩..." : "새로고침"}
                  </button>
                </div>

                <div class="mb-5 h-2 w-full rounded-full bg-gray-100">
                  <div
                    class="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-[width] duration-200"
                    style={{ width: `${progress()}%` }}
                  />
                </div>

                <Show when={form()}>
                

                  <div class="space-y-3">
                    <For each={form()!.questions}>
                      {(q) => (
                        <div class={qBoxClass(q)}>
                          <div class="mb-2 text-[15px] font-semibold text-[#2D336B]">
                            {q.label}
                            {q.required && (
                              <span class="ml-1 text-xs text-red-500">*</span>
                            )}
                          </div>
                          {renderInput(q)}
                        </div>
                      )}
                    </For>
                  </div>

                  <div class="mt-6">
                    <button
                      class="w-full rounded-xl bg-[#2D336B] px-4 py-3 text-white shadow hover:bg-[#7886C7] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={submitLoading()}
                      onClick={handleSubmit}
                    >
                      {submitLoading() ? "제출 중..." : "제출"}
                    </button>
                  </div>
                </Show>

                <Show when={!form()}>
                  <p class="text-sm text-gray-500">
                    폼을 찾을 수 없습니다.
                  </p>
                </Show>
              </article>
            </div>
          </Show>

          <Show when={error()}>
            <div class="text-center p-8">
              <p class="text-red-500">오류: {error()!.message}</p>
            </div>
          </Show>
        </div>
      </main>

    </div>
  );
};

export default PostRecruitForm;
