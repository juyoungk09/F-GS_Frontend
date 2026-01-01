import { createSignal, createResource, For, Show, onMount } from "solid-js";
import { A } from "@solidjs/router";
import { BASE_URL } from "~/stores/store";
import axios from "axios";

interface ChatNotification {
  id: number;
  message: string;
  is_read: boolean;
  type: string;
  created_at: string;
  metadata: {
    sender_id: number;
    name: string;
    profile_path: string;
    post_id: number;
  };
}

interface ReviewNotification {
  id: number;
  message: string;
  is_read: boolean;
  type: string;
  created_at: string;
  metadata: {
    user_id: number;
    name: string;
    profile_path: string;
    review_id: number;
  };
}

interface AcceptNotification {
  id: number;
  message: string;
  is_read: boolean;
  type: string;
  created_at: string;
  metadata: {
    post_id: number;
    title: string;
  };
}
interface DenyNotification {
  id: number;
  message: string;
  is_read: boolean;
  type: string;
  created_at: string;
  metadata: {
    post_id: number;
    title: string;
  };
}
interface RecruitNotification {
  id: number;
  message: string;
  is_read: boolean;
  type: string;
  created_at: string;
  metadata: {
    post_id: number;
    title: string;
  };
}
type NotificationItem = ChatNotification | ReviewNotification | AcceptNotification | DenyNotification | RecruitNotification;

const NotificationPage = () => {
  const [notifications,{ refetch: notificationsRefetch } ] = createResource<NotificationItem[]>(async () => {
    console.log("notifications");
    const response = await fetch(`${BASE_URL}/notifications/private`,
       {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
       });  
    return (await response.json()) as NotificationItem[];
  });
  const [unreadCount, { refetch: unreadCountRefetch } ] = createResource<number>(async () => {
    console.log("unreadCount");
    const response = await  fetch(`${BASE_URL}/notifications/private/unread-count`, 
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });
    return (await response.json()) as number;
  });
  // 모두 읽음  

  async function readNotification(id: number) {
    const response = await fetch(`${BASE_URL}/notifications/private/${id}/read`, 
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });
      return response.json(); 
  }
  async function markAsRead(id: number) {
    await readNotification(id);
    refetch();
  }
  async function markAllAsRead() {
    notifications()?.map((n) => readNotification(n.id));
    refetch();
    console.log("markAllAsRead");
  }
  async function refetch() {
    await notificationsRefetch();
    await unreadCountRefetch();
    console.log("refetch");
  }
  return (
    <main class="min-h-screen bg-gray-50">
      <section class="mx-auto max-w-3xl p-6">
        <div class="mb-4 flex items-center justify-between">
          <h1 class="text-2xl font-bold text-primary_color_4">알림</h1>
          
          <div class="flex items-center gap-2">
            <span class="rounded-xl bg-primary_color_3 px-3 py-1 text-sm font-medium text-white shadow">{unreadCount()}</span>
            <button onClick={() => markAllAsRead()} class="text-gray-900 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-gray-100 active:scale-[0.98]"> 모두 읽기</button>
            <button onClick={refetch} class="text-gray-900 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-gray-100 active:scale-[0.98]"> 새로고침</button>
          </div>
        </div>
        <ul class="space-y-3">
          <Show when={notifications()?.length} fallback={<EmptyState />}>
            <For each={notifications()}>
            {(notification) => (
              <li class="group relative overflow-hidden rounded-sm border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md">
                <div class="flex items-start gap-3">
                  <div class={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${!notification.is_read ? 'bg-primary_color_3' : 'bg-transparent'}`} />
                  
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-primary_color_3 break-words">
                      {notification.message}
                    </p>
                    <div class="mt-1.5 flex items-center justify-between">
                      <span class="text-xs text-primary_color_3">
                        {new Date(notification.created_at).toLocaleString('ko-KR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {!notification.is_read && (
                        <button onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                        }} class="text-xs text-primary_color_3 hover:text-primary_color_2 transition-colors"> 읽음 표시</button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            )}
          </For>
          </Show>
                </ul>
      </section>
    </main>
  );
}

// function SkeletonList() {
//   return (
//     <ul class="space-y-3">
//       <For each={Array.from({ length: 6 })}>
//         {() => (
//           <li class="animate-pulse rounded-2xl border border-gray-200 bg-white p-4">
//             <div class="flex items-start gap-3">
//               <span class="mt-2 h-2.5 w-2.5 rounded-full bg-gray-200" />
//               <div class="w-full">
//                 <div class="h-4 w-4/5 rounded bg-gray-200" />
//                 <div class="mt-2 h-3 w-2/3 rounded bg-gray-200" />
//               </div>
//             </div>
//           </li>
//         )}
//       </For>
//     </ul>
//   );
// }  SSR 써서 

const EmptyState = () => {
  return (
    <div class="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
      <p class="text-sm text-gray-500">알림이 아직 없습니다.</p>
    </div>
  );
}

// function ErrorBox(props: { msg: string; onRetry: () => void }) {
//   return (
//     <div class="rounded-2xl border border-rose-200 bg-rose-50 p-4">
//       <p class="text-sm text-rose-700">{props.msg}</p>
//       <button
//         onClick={props.onRetry}
//         class="mt-3 rounded-lg bg-rose-600 px-3 py-1.5 text-sm text-white hover:bg-rose-700"
//       >
//         다시 시도
//       </button>
//     </div>
//   );
// }
export default NotificationPage;