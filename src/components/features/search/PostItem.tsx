import { A} from "@solidjs/router";
import { For } from "solid-js";
import { useNavigate } from "@solidjs/router";
const PostItem = ({post}: {post: Post}) => {
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
        <A href={`/post/${post.id}`} class="bg-white aspect-square flex flex-col p-3 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 text-sm hover:border-primary_color_3/30">
                  <div class="flex-1 flex flex-col">
                    <div class="flex justify-between items-start gap-2 mb-2">
                      <h3 class="font-semibold text-gray-900 line-clamp-2 text-sm leading-tight">
                        {post.title}
                      </h3>
                      <div class="flex flex-col items-end gap-1">
                        <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 whitespace-nowrap">
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
                            src={post.author.profile_path} 
                            alt={post.author.name}
                            class="w-5 h-5 rounded-full object-cover flex-shrink-0"
                          />
                        )}
                        <span
                          class="text-primary_color_2 hover:underline font-medium truncate text-xs"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/user/${post.author.id}`);
                          }}
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
                      
                      <div class="flex flex-wrap gap-1 mt-2">
                       <For each={post.tags}>
                        {(tag) => (
                          <span 
                            class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                            style={{ 'background-color': `${tag.bg_color}20`, color: tag.font_color, 'max-width': '100px' }}
                            title={tag.name}
                              >
                            {tag.name}
                          </span>
                        )}
                      </For> 
                    </div> 
                    <div class="flex justify-between items-center mt-2 pt-1.5 border-t border-gray-100">
                      <p class="text-gray-400 text-[0.7rem]">{formatRelativeTime(post.created_at)}</p>
                    </div>
                  </div>
                </div>
                </A>
    );
}
export default PostItem;