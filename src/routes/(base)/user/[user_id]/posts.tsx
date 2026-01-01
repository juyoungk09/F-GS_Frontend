import { createResource } from "solid-js";
import axios from "axios";
import { BASE_URL } from "~/stores/store";
import { useParams } from "@solidjs/router";
import PostItem from "~/components/features/search/PostItem";
import { For, Show } from "solid-js";
import { createSignal } from "solid-js";
import { createMemo } from "solid-js";
import { useNavigate } from "@solidjs/router";
const UserPosts = () => {
    const params = useParams();
    const userD = createMemo(() => {
        return params.user_id
    })
    const navigate = useNavigate();
    const [userInfo] = createResource<User>(async () => {
        const response = await axios.get(`${BASE_URL}/users/i/${userD()}`, { withCredentials: true });
        console.log("userInfo",response.data)
        return response.data;
    });
    const [posts] = createResource<Post[]>(async () => {
        const response = await axios.get(`${BASE_URL}/posts/${userD()}?page=1`, { withCredentials: true });
        console.log( "Error",response.data)
        if(response.data === null){
            navigate("404")
        }
        return (await response.data.data) as Post[];
    });
    const [isMoreShow, setIsMoreShow] = createSignal<number>(0);
    const [currentPage, setCurrentPage] = createSignal<number>(1);
    return(
        <main class="min-h-screen bg-gray-50 p-4 md:p-8">
        <div class="max-w-6xl mx-auto">
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h1 class="text-2xl font-bold text-primary_color_4 mb-2">
                    {userInfo()?.name}의 게시글
                </h1>
                <div class="w-20 h-1 bg-primary_color_3 rounded-full mb-4"></div>
                
                <Show when={!posts.loading && posts()?.length === 0}>
                    <div class="text-center py-12">
                        <p class="text-gray-500">작성된 게시글이 없습니다.</p>
                    </div>
                </Show>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <For each={posts()}>
                        {post => (
                            <PostItem 
                                post={post} 
                                isMoreShow={isMoreShow} 
                                setIsMoreShow={setIsMoreShow} 
                            />
                        )}
                    </For>
                </div>

                <Show when={posts() && posts()!.length > 10}>
                    <div class="mt-8 flex justify-center">
                        <button
                            onClick={() => setCurrentPage(p => p + 1)}
                            class="px-6 py-2 bg-primary_color_3 text-white rounded-lg hover:bg-primary_color_2 transition-colors"
                        >
                            더보기
                        </button>
                    </div>
                </Show>
            </div>
        </div>
    </main>
    )
}
export default UserPosts