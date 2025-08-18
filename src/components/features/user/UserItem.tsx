import { A } from "@solidjs/router";
import { Show, For } from "solid-js";
import { BASE_URL } from "~/stores/store";
export default function UserItem({user}: {user: User}) {

  return (
    <A 
      href={`/user/${user.name}`}
      class="block w-full hover:opacity-90 transition-opacity"
    >
          <div class="flex items-start p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div class="flex-shrink-0 mr-4">
        <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <Show when={user.profile_path} fallback={
            <span class="text-2xl text-gray-500">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </span>
          }>
            <img 
              src={BASE_URL + '/public/' + user.profile_path} 
              alt={user.name || 'User profile'}
              class="w-full h-full object-cover"
            />
          </Show>
        </div>
      </div>
      
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 truncate">
            {user.name || '이름 없음'}
          </h3>
        </div>

          <p class="text-sm text-gray-500 truncate">
            {user.email}
          </p>

        <div class="mt-2 flex flex-wrap gap-1">
          <Show when={user.tags && user.tags.length > 0}>
            <For each={user.tags.slice(0, 3)}>
              {(tag) => (
                <div>
                  <span 
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-[0.7rem] font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{'background-color': `${tag.bg_color}`, 'color': tag.font_color}}
                    title={tag.name}
                  >
                    {tag.name}
                    </span>
                </div>
              )}
            </For>
            {user.tags.length > 3 && (
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[0.7rem] font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                +{user.tags.length - 3}
              </span>
            )}
          </Show>
        </div>
      </div>
    </div>
    </A>
  );
}
