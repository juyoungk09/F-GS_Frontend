import { createResource, For, Show } from 'solid-js';
import { useParams, A } from '@solidjs/router';
import { BASE_URL } from '~/stores/store';

interface QuestionAnswer {
  answer: string;
  form_answer_id: number;
  target_question: {
    id: number;
    is_file: boolean;
    label: string;
    question_type: string;
    required: boolean;
  };
}

interface ApplicantData {
  id: number;
  form_id: number;
  answerer: {
    id: number;
    name: string;
    email: string;
    student_id: number;
    profile_path: string;
    portfolio_path: string | null;
    self_introduction: string | null;
    rating: number;
    created_at: string;
    tags: Tag[];
  };
  question_answers: QuestionAnswer[];
}

export default function ApplicantDetail() {
  const params = useParams();
  const [applicant] = createResource<ApplicantData>(async () => {
    const response = await fetch(
      `${BASE_URL}/posts/${params.id}/applications/${params.user_id}`,
      { credentials: 'include' }
    );
    return await response.json();
  });

  return (
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <div class="bg-white rounded-lg shadow-md p-6">
        <Show when={applicant()} fallback={<div class="text-center py-8">로딩 중...</div>}>
          <div class="flex flex-col md:flex-row gap-6">
            {/* Left Column - Profile */}
            <div class="md:w-1/3 space-y-4">
              <div class="flex flex-col items-center">
                <img
                  src={applicant()!.answerer.profile_path ?? '/default-profile.png'}
                  alt={applicant()?.answerer.name}
                  class="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                />
                <h1 class="text-2xl font-bold mt-4">{applicant()?.answerer.name}</h1>
                <p class="text-gray-600">학번: {applicant()?.answerer.student_id}</p>
                
                {applicant()?.answerer.portfolio_path && (
                  <a
                    href={applicant()!.answerer.portfolio_path ?? ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="mt-2 text-blue-600 hover:underline"
                  >
                    포트폴리오 보기
                  </a>
                )}
              </div>

              <div class="mt-6">
                <h2 class="text-lg font-semibold mb-2">기술 스택</h2>
                <div class="flex flex-wrap gap-2">
                  <For each={applicant()?.answerer.tags || []}>
                    {(tag) => (
                      <span
                        class="px-2 py-1 rounded text-sm"
                        style={{
                          'background-color': tag.bg_color || '#e5e7eb',
                          color: tag.font_color || '#111827'
                        }}
                      >
                        {tag.name}
                      </span>
                    )}
                  </For>
                </div>
              </div>

              <div class="mt-6">
                <h2 class="text-lg font-semibold mb-2">자기소개</h2>
                <p class="text-gray-700 whitespace-pre-line">
                  {applicant()?.answerer.self_introduction || '자기소개가 없습니다.'}
                </p>
              </div>
            </div>

            {/* Right Column - Application Details */}
            <div class="md:w-2/3 space-y-6">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h2 class="text-xl font-bold mb-4">지원 내용</h2>
                
                <For each={applicant()?.question_answers || []}>
                  {(qa) => (
                    <div class="mb-6">
                      <h3 class="font-semibold text-gray-800 mb-1">
                        {qa.target_question.label}
                        {qa.target_question.required && (
                          <span class="text-red-500 ml-1">*</span>
                        )}
                      </h3>
                      
                      {qa.target_question.is_file ? (
                        <a
                          href={qa.answer}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-blue-600 hover:underline"
                        >
                          첨부 파일 보기
                        </a>
                      ) : (
                        <p class="whitespace-pre-line bg-white p-3 rounded border border-gray-200">
                          {qa.answer || '답변이 없습니다.'}
                        </p>
                      )}
                    </div>
                  )}
                </For>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => window.history.back()}
                  class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  뒤로 가기
                </button>
                <A
                  href={`/post/${params.id}`}
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  모집글 보기
                </A>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}