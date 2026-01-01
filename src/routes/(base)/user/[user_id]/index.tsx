import axios from "axios";
import logo from "/logo.svg"
import { createResource, createSignal } from "solid-js";
import { A, useNavigate, useParams } from "@solidjs/router";
import { For, Show } from "solid-js";
import { BASE_URL } from "~/stores/store";
import { user } from "~/stores/store";
const Mypage = () => {  
    const params = useParams();
    const navigate = useNavigate()
    const [myTags, setMyTags] = createSignal<Tag[]>([]);
    const [userData] = createResource<User>(async () => {
        const res = await axios.get(`${BASE_URL}/users/i/${params.user_id}`,{withCredentials: true})
        console.log("Error",res.data)
        if(res.data === null){
            navigate("/")
        }
        setMyTags(res.data.tags);
        return res.data
    })
    const handleDownload = async () => {
        if(!userData()) return;
        try {
            const res = await axios.get(
            `${BASE_URL}/public/${userData()?.portfolio_path}`,
            { responseType: "blob" }
            );

            const blob = res.data;
            const downloadUrl = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = `${userData()?.name}의 포트폴리오`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("파일 다운로드 실패:", error);
        }
        };

    return(
        <main class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <Show when={userData()}>
            <div class="max-w-7xl mx-auto ">
                <div class="bg-white rounded-2xl shadow-sm p-6 mb-8 flex justify-between items-center ">
                    <div>
                        <h1 class="text-3xl font-bold text-primary_color_4">프로필</h1>
                        <div class="text-yellow-400 whitespace-nowrap text-[12px]">
                              {'★'.repeat(Math.floor(userData()?.rating ?? 0))}
                              {'☆'.repeat(5 - Math.floor(userData()?.rating ?? 0))}
                            </div> 
                    </div>
                    <div class="flex gap-2">
                        <A class="hover:underline text-primary_color_3 font-medium bg-amber-100 px-2 py-1 rounded-full" href={`/user/${userData()?.id}/reviews`}>리뷰</A>
                        {user?.id !== userData()?.id && <A class="hover:underline text-primary_color_3 font-medium bg-amber-100 px-2 py-1 rounded-full" href={`/user/${userData()?.id}/posts`}>게시글</A>}
                    </div>
                </div>
                
                <div class="flex flex-col lg:flex-row gap-8">
                <div class="w-full lg:w-1/3">
                    <div class="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
                        <div class="flex flex-col items-center">
                            <div class="relative mb-6 group">
                                <img 
                                    class="w-40 h-40 rounded-full border-4 border-dashed object-cover" 
                                    src={`${BASE_URL}/public/${userData()?.profile_path}`} 
                                    alt={userData()?.name}
                                />
                            </div>
                            
                            <h2 class="text-2xl font-bold text-gray-900">{userData()?.name}</h2>
                            <p class="text-gray-600 mb-4">
                                {Math.floor((userData()?.student_id ?? 0) / 10000)}학년 {Math.floor(((userData()?.student_id ?? 0) / 100) % 10)}반 {Math.floor((userData()?.student_id ?? 0) % 100)}번
                            </p>
                            
                            <div class="flex flex-wrap justify-center gap-2 my-4">
                                <For each={myTags()}>
                                    {(tag) => (
                                        <span 
                                            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis hover:scale-105 transition-transform"
                                            style={{ 'background-color': `${tag.bg_color}`, color: tag.font_color }}
                                            title={tag.name}
                                        >
                                            {tag.name}
                                        </span>
                                    )}
                                </For>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex-1 space-y-8">
                    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div class="px-6 py-4 border-b border-gray-100">
                            <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary_color_3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                자기소개
                            </h2>
                        </div>
                        <div class="p-6">
                            <div class="whitespace-pre-line h-1/2 overflow-auto  max-w-none  text-gray-600">
                                {userData()?.self_introduction || (
                                    <p class="text-gray-400 italic">자기소개가 작성되지 않았습니다.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div class="px-6 py-4 border-b border-gray-100">
                            <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary_color_3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                포트폴리오
                            </h2>
                        </div>
                        <Show when={userData()?.portfolio_path !== ""} fallback={<p class="p-6 text-center text-gray-400">포트폴리오가 없습니다.</p>}>
                        <div class="p-6">
                            <div class="group relative">
                                <button 
                                    onClick={handleDownload}
                                    class="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary_color_3 to-primary_color_2 text-white hover:from-primary_color_2 hover:to-primary_color_3"
                                >
                                    <div class="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        <span class="text-lg font-semibold">{userData()?.name}의 포트폴리오</span>
                                    </div>
                                    <span class="text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                                        클릭하여 다운로드
                                    </span>
                                </button>
                                <div class="mt-2 text-sm text-gray-500 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    파일을 다운로드하려면 클릭하세요
                                </div>
                            </div>
                        </div>
                        </Show>
                    </div>
                </div>
            </div>
            </div>
            </Show>
        </main>
    )
}

export default Mypage;