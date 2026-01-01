import { createSignal, createResource, For, Show, createEffect } from 'solid-js';
import { A, useNavigate } from '@solidjs/router';
import { BASE_URL } from '~/stores/store';
import axios from 'axios';
import { user } from '~/stores/store';

interface User {
  id: number;
  name: string;
  profile_path: string;
  student_id: number;
}

const FindUser = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = createSignal('');
  const [selectedUserId, setSelectedUserId] = createSignal<number | null>(null);

  const [users, setUsers] = createSignal<User[]>([]);
  createEffect(() => {
    if(searchQuery()) {
      const response = axios.get(`${BASE_URL}/users/s/${searchQuery()}`);
      response.then((res) => {
        setUsers(res.data);
      });
    }
  });

  const handleStartChat = (userId: number) => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div class="bg-white w-full h-[calc(100vh-64px)] overflow-y-auto p-4">
      <div class="mb-4">
        <input
          type="text"
          placeholder="친구 검색"
          class="w-full p-2 border border-gray-300 text-lg text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-primary_color_3"
          value={searchQuery()}
          onInput={(e) => setSearchQuery(e.currentTarget.value)}
        />
      </div>

      <div class="space-y-2 max-h-96 overflow-y-auto">
        <Show
          when={users().length !== 0}
          
        >
          <For each={users()}>
            {(user) => (
              <div
                class={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedUserId() === user.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedUserId(user.id)}
              >
                <img
                  src={`${BASE_URL}/public/${user.profile_path}`}
                  alt={user.name}
                  class="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div class="flex-1">
                  <div class="font-medium text-gray-900">{user.name}</div>
                  <div class="text-sm text-gray-500">
                    {Math.floor(user.student_id / 10000)}학년 {Math.floor((user.student_id / 100) % 10)}반{' '}
                    {user.student_id % 100}번
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartChat(user.id);
                  }}
                  class="px-3 py-1 bg-primary_color_3 text-white text-sm rounded-md hover:bg-primary_color_2 transition-colors"
                >
                  채팅하기
                </button>
              </div>
            )}
          </For>
          <Show when={users()?.length === 0}>
            <div class="text-center py-6 text-gray-500">
              {searchQuery() ? '검색 결과가 없습니다.' : '검색어를 입력해주세요.'}
            </div>
          </Show>
        </Show>
      </div>
    </div>
  );
};

export default FindUser;