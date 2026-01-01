import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import HoverPostItem from "./HoverPostItem";
import { BASE_URL } from "~/stores/store";
const PostItem = ({post, isMoreShow, setIsMoreShow}: {post: Post, isMoreShow: () => number, setIsMoreShow: (show: number) => void}) => {
    const navigate = useNavigate();

    function formatRelativeTime(dateString: string): string {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      const minute = 60;
      const hour = minute * 60;
      const day = hour * 24;
      const week = day * 7;
      const month = day * 30;
      const year = day * 365;
      if (diffInSeconds < minute) return '방금 전';
      if (diffInSeconds < hour) return `${Math.floor(diffInSeconds/minute)}분 전`;
      if (diffInSeconds < day) return `${Math.floor(diffInSeconds/hour)}시간 전`;
      if (diffInSeconds < week) return `${Math.floor(diffInSeconds/day)}일 전`;
      if (diffInSeconds < month) return `${Math.floor(diffInSeconds/week)}주 전`;
      if (diffInSeconds < year) return `${Math.floor(diffInSeconds/month)}개월 전`;
      return `${Math.floor(diffInSeconds/year)}년 전`;
    } 

    return (
        <div class="relative">
            <A href={`/post/${post.id}`} class="bg-white flex flex-col p-3 rounded-lg transition-all border border-gray-100 text-sm hover:border-primary_color_3/30">
                  <div class="flex-1 flex flex-col">
                    <div class="flex justify-between items-start gap-2 mb-2">
                      <h3 class="font-b max-w-1/2 text-gray-900 line-clamp-1 text-md leading-tight">
                        {post.title}
                      </h3>
                      <div class="flex flex-col items-end gap-1">
                        <span class="text-[10px] w-1/2 truncate px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {post.category} 
                        </span>
                        {post.is_finished && (
                          <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
                            마감
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div class="flex items-center gap-1.5 mt-2 mb-1.5 overflow-hidden">
                        {post.author.profile_path && (
                          <img 
                            src={`${BASE_URL}/public/${post.author.profile_path}`} 
                            alt={post.author.name}
                            class="w-5 h-5 rounded-full object-cover flex-shrink-0"
                          />
                        )}
                        <span
                          class="text-primary_color_3 hover:underline font-medium truncate text-xs"
                          onClick={(e) => {e.preventDefault(); navigate(`/user/${post.author.id}`);}}
                        >
                          {post.author.name}
                        </span>
                        <div class="text-yellow-400 whitespace-nowrap text-[10px] ml-auto">
                          {'★'.repeat(Math.floor(post.author.rating))}
                          {'☆'.repeat(5 - Math.floor(post.author.rating))}
                        </div> 
                      </div>
                      
                      <div class="text-gray-500 text-[0.7rem] mt-0.5 flex flex-wrap justify-between">
                        <span>모집: {post.current_recruits}/{post.max_recruits}</span>
                        <span>마감: {new Date(post.deadline).toLocaleDateString('ko-KR').replace(/\./g, '.').replace(/\s/g, '')}</span>
                      </div>  
                      
                      <div class="flex flex-wrap gap-1 mt-2 max-h-16 overflow-y-auto">
                        <For each={post.tags.slice(0, 3)}>
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
                      </div>
                      {post.tags.length > 0 && (
                        <div class="text-[0.7rem] text-gray-400 mt-1">
                          {post.tags.length}개 태그
                        </div>
                      )} 
                    <div class="flex justify-between items-center mt-2 pt-1.5 border-t border-gray-100">
                      <p class="text-gray-400 text-[0.7rem]">{formatRelativeTime(post.created_at)}</p>
                      <button class="text-primary_color_4 hover:underline"  onClick={(e) => {e.preventDefault(); setIsMoreShow(post.id);}}>
                        <i class="bi bi-eye"></i> <span class="ml-1">내용 보기</span>
                      </button>
                    </div>
                  
                  </div>
                </div>
            </A>
            <Show when={isMoreShow() === post.id}>
              <div class="absolute z-50 w-full  top-0 right-0 bg-white rounded-lg shadow-lg border border-gray-200">
                <HoverPostItem post={post} setIsMoreShow={setIsMoreShow} />
              </div>
            </Show>
        </div>
    );
}
export default PostItem;