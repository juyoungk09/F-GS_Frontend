// src/routes/notification.tsx
import { createSignal, For, Show, onMount } from "solid-js";
import { A } from "@solidjs/router";

const BASE = "https://fg.sunrin.kr";
const USE_DUMMY = true; 

type Tag = {
  id: number | string;
  name: string;
  type?: string;
  color?: string;
  font_color?: string;
};
type Receiver = {
  id: number | string;
  name?: string;
  email?: string;
  profile_path?: string;
  portfolio_path?: string;
  rating?: number;
  student_id?: number;
  created_at?: string;
  self_introduction?: string;
};
type NotificationItem = {
  id: number | string;
  message: string;
  is_read: boolean;
  created_at: string;
  metadata?: Record<string, any>;
  receiver?: Receiver;
  tags?: Tag[];
};

const dummyNotifications: NotificationItem[] = [
  {
    id: 101,
    message: '새 댓글이 달렸습니다: “프로젝트 일정 관련해서 질문드립니다.”',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 17).toISOString(),
    metadata: { link: "/post/12#comment-88" },
    tags: [
      { id: "t1", name: "댓글", color: "#E0E7FF", font_color: "#3730A3" },
      { id: "t2", name: "알림", color: "#F1F5F9", font_color: "#0F172A" },
    ],
  },
  {
    id: 102,
    message: "팀 합류 요청이 승인되었습니다. 채팅방으로 이동해 보세요.",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    metadata: { link: "/chat/room/fgs-frontend" },
    tags: [{ id: "t3", name: "승인", color: "#DCFCE7", font_color: "#14532D" }],
  },
  {
    id: 103,
    message: "모집 글이 마감되었습니다. 결과를 확인해 주세요.",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    metadata: { link: "/post/45" },
    tags: [{ id: "t4", name: "마감", color: "#FFE4E6", font_color: "#881337" }],
  },
  {
    id: 104,
    message: "내일 19:00, 온라인 미팅 일정이 등록됐습니다.",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    metadata: { link: "/calendar/event/104" },
    tags: [
      { id: "t5", name: "일정", color: "#FEF9C3", font_color: "#713F12" },
      { id: "t6", name: "리마인더", color: "#E2E8F0", font_color: "#0F172A" },
    ],
  },
];

function timeAgo(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}초 전`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}일 전`;
  return d.toLocaleString();
}

export default function NotificationPage() {
  const [items, setItems] = createSignal<NotificationItem[] | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [unread, setUnread] = createSignal<number>(0); // ← 미읽음 개수

  const recomputeUnread = () =>
    setUnread(items()?.filter((x) => !x.is_read).length ?? 0);

  async function fetchUnreadCount() {
    if (USE_DUMMY) return recomputeUnread();
    try {
      const res = await fetch(`${BASE}/api/notifications/unread-count`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`(${res.status})`);
      const n = await res.json(); // 숫자
      setUnread(typeof n === "number" ? n : Number(n ?? 0));
    } catch {
      setUnread(0);
    }
  }

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_DUMMY) {
        await new Promise((r) => setTimeout(r, 200));
        setItems(dummyNotifications);
        recomputeUnread();
        return;
      }
      const res = await fetch(`${BASE}/api/notifications/private`, {
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("로그인이 필요합니다 (401)");
        throw new Error(`알림을 불러오지 못했습니다 (${res.status})`);
      }
      const data = (await res.json()) as NotificationItem[];
      setItems(Array.isArray(data) ? data : []);
      await fetchUnreadCount();
    } catch (e: any) {
      setError(e?.message ?? "알 수 없는 오류");
      setItems([]);
      setUnread(0);
    } finally {
      setLoading(false);
    }
  };

  // 읽음 처리(카드 단건)
  async function markAsRead(id: number | string) {
    setItems((xs) =>
      xs?.map((x) => (x.id === id ? { ...x, is_read: true } : x)) ?? null
    );
    if (USE_DUMMY) {
      recomputeUnread();
      return;
    }
    try {
      await fetch(`${BASE}/api/notifications/private/${id}/read`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: true }),
      });
      await fetchUnreadCount();
    } catch {
      // 실패 시 롤백하려면 아래 주석 해제
      // setItems(xs => xs?.map(x => x.id === id ? { ...x, is_read: false } : x) ?? null);
      // await fetchUnreadCount();
    }
  }

  // 모두 읽음
  async function markAllAsRead() {
    setItems((xs) => xs?.map((x) => ({ ...x, is_read: true })) ?? null);
    if (USE_DUMMY) {
      recomputeUnread();
      return;
    }
    try {
      await fetch(`${BASE}/api/notifications/private/read-all`, {
        method: "POST",
        credentials: "include",
      });
      await fetchUnreadCount();
    } catch {
      // 필요 시 롤백 로직
    }
  }

  onMount(() => {
    fetchNotifications();
  });

  return (
    <main class="min-h-screen bg-gray-50">
      <section class="mx-auto max-w-3xl p-6">
        <div class="mb-4 flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">알림</h1>

          <div class="flex items-center gap-2">
            {/* 미읽음 배지 */}
            <span class="rounded-xl bg-primary_color_3 px-3 py-1 text-sm font-medium text-white shadow">
              미읽음 {unread()}
            </span>

            <button
              onClick={markAllAsRead}
              class="text-gray-900 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-gray-100 active:scale-[0.98]"
            >
              모두 읽기
            </button>
            <button
              onClick={fetchNotifications}
              class="text-gray-900 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-gray-100 active:scale-[0.98]"
            >
              새로고침
            </button>
          </div>
        </div>

        <Show when={!loading()} fallback={<SkeletonList />}>
          <Show when={!error()} fallback={<ErrorBox msg={error()!} onRetry={fetchNotifications} />}>
            <Show when={(items()?.length ?? 0) > 0} fallback={<EmptyState />}>
              <ul class="space-y-3">
                <For each={items()!}>
                  {(n) => {
                    const link =
                      n.metadata?.link ??
                      (n.metadata?.post_id && n.metadata?.comment_id
                        ? `/post/${n.metadata.post_id}#comment-${n.metadata.comment_id}`
                        : n.metadata?.post_id
                        ? `/post/${n.metadata.post_id}`
                        : n.metadata?.room_id
                        ? `/chat/room/${n.metadata.room_id}`
                        : n.metadata?.event_id
                        ? `/calendar/event/${n.metadata.event_id}`
                        : null);

                    return (
                      <li
                        class={
                          "rounded-2xl border p-4 shadow-sm transition " +
                          (n.is_read
                            ? "border-gray-200 bg-white"
                            : "border-indigo-200 bg-indigo-50")
                        }
                      >
                        <div class="flex items-start gap-3">
                          <span
                            class={
                              "mt-2 h-2.5 w-2.5 shrink-0 rounded-full " +
                              (n.is_read ? "bg-gray-300" : "bg-indigo-500")
                            }
                            aria-hidden
                          />
                          <div class="min-w-0 flex-1">
                            <p class="whitespace-pre-wrap break-words text-gray-900">
                              {n.message}
                            </p>

                            <Show when={n.tags && n.tags.length > 0}>
                              <div class="mt-2 flex flex-wrap gap-1.5">
                                <For each={n.tags!}>
                                  {(t) => (
                                    <span
                                      class="rounded-full px-2 py-0.5 text-xs"
                                      style={{
                                        "background-color": t.color ?? "#EEF2FF",
                                        color: t.font_color ?? "#3730A3",
                                      }}
                                    >
                                      {t.name}
                                    </span>
                                  )}
                                </For>
                              </div>
                            </Show>

                            <div class="mt-2 flex items-center gap-3 text-xs text-gray-500">
                              <time>{timeAgo(n.created_at)}</time>

                              {/* 읽음으로 표시 */}
                              <Show when={!n.is_read}>
                                <button
                                  onClick={() => markAsRead(n.id)}
                                  class="rounded-md border px-2 py-0.5 text-[11px] hover:bg-gray-100"
                                >
                                  읽음으로 표시
                                </button>
                              </Show>

                              {/* 자세히 보기 (클릭 시 읽음 처리) */}
                              <Show when={link}>
                                <A
                                  href={link!}
                                  onClick={() => {
                                    void markAsRead(n.id);
                                  }}
                                  class="truncate rounded-md border px-2 py-0.5 text-[11px] hover:bg-gray-100"
                                >
                                  자세히 보기
                                </A>
                              </Show>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  }}
                </For>
              </ul>
            </Show>
          </Show>
        </Show>
      </section>
    </main>
  );
}

function SkeletonList() {
  return (
    <ul class="space-y-3">
      <For each={Array.from({ length: 6 })}>
        {() => (
          <li class="animate-pulse rounded-2xl border border-gray-200 bg-white p-4">
            <div class="flex items-start gap-3">
              <span class="mt-2 h-2.5 w-2.5 rounded-full bg-gray-200" />
              <div class="w-full">
                <div class="h-4 w-4/5 rounded bg-gray-200" />
                <div class="mt-2 h-3 w-2/3 rounded bg-gray-200" />
              </div>
            </div>
          </li>
        )}
      </For>
    </ul>
  );
}

function EmptyState() {
  return (
    <div class="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
      <p class="text-sm text-gray-500">알림이 아직 없습니다.</p>
    </div>
  );
}

function ErrorBox(props: { msg: string; onRetry: () => void }) {
  return (
    <div class="rounded-2xl border border-rose-200 bg-rose-50 p-4">
      <p class="text-sm text-rose-700">{props.msg}</p>
      <button
        onClick={props.onRetry}
        class="mt-3 rounded-lg bg-rose-600 px-3 py-1.5 text-sm text-white hover:bg-rose-700"
      >
        다시 시도
      </button>
    </div>
  );
}
