import { createResource } from "solid-js";
import axios from "axios";
import { BASE_URL } from "~/stores/store";
import { useParams } from "@solidjs/router";
import PostItem from "~/components/features/search/PostItem";
import { For } from "solid-js";
import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
const UserPosts = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [posts] = createResource<Post[]>(async () => {
        const response = await axios.get(`${BASE_URL}/private/${params.user_id}?page=1`, { withCredentials: true });
        console.log( "Error",response.data)
        if(response.data.length === 0){
            navigate("/")
        }
        return (await response.data) as Post[];
    });
    const [isMoreShow, setIsMoreShow] = createSignal<number>(0);
    return(
        <main class="min-h-screen bg-gray-50">
            <h2 class="text-primary_color_4 text-xl font-semibold mb-4">{params.user_id}의 게시글</h2>
            <For each={posts()}>{post => <PostItem post={post} isMoreShow={isMoreShow} setIsMoreShow={setIsMoreShow} />}</For>
        </main>
    )
}
export default UserPosts