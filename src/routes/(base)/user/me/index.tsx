import axios from "axios";
import logo from "/logo.svg"
import { createResource, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { For } from "solid-js";
const Mypage = () => {
    const url = "https://fg.sunrin.kr"
    const navigate = useNavigate()
    const [myTags] = createResource(async () => {
    const res = await axios.get(`${url}/api/users/private/tags`, {
        withCredentials: true
    });
    return res.data;
    });
    const [myData,setMyData] = createSignal("")
    const handleLogout = () => {
        axios.post(`${url}/api/users/logout`,{withCredentials: true})
        .then((res) => {
            console.log("로그아웃 성공!",res)
            navigate("/")
        })
        .catch((err) => console.log("병신",err))
    }
    const getMyInfo = () => {
        axios.get(`${url}/api/users/private/me`,{withCredentials: true})
        .then((res) => console.log("불러오기 성공!",res))
        .catch((err) => console.log("병신",err))
    }
    axios.get(`${url}/api/users/private/me`,{withCredentials: true})
        .then((res) => {
            console.log("불러오기 성공!",res)
            const data = res.data
            setMyData(data)
        })
        .catch((err) => console.log("병신",err))
            const handleDownload = async () => {
        try {
            const res = await axios.get(
            `${url}/api/public/${myData().portfolio_path}`,
            { responseType: "blob" }
            );

            const blob = res.data;
            const downloadUrl = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = `${myData().name}의 포트폴리오`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("파일 다운로드 실패:", error);
        }
        };

    return(
        <main class="mx-auto flex-col text-gray-900 p-4">
            <div class="p-5 px-15 rounded-4xl m-5 bg-primary_color_3 mx-15 text-5xl font-bold w-fit">About Me</div>
            <div class="flex flex-1 m-15 min-h-screen gap-20">
                <div class="flex flex-col gap-5">
                    <img class="w-70 h-70 rounded-full bg-white border-gray-800 border-1" src={`${url}/api/public/${myData().profile_path}`} alt="profile"/>
                    <div class="flex">
                        <div class="flex-1 flex flex-col">
                            <div class="flex flex-col gap-2">
                                <div class="flex justify-center text-lg font-semibold">
                                    {Math.floor(myData().student_id/10000)}학년 {Math.floor(myData().student_id/100)%10}반 {myData().student_id%100}번
                                </div>
                                <div class="flex justify-center text-2xl font-extrabold">{myData().name}</div>
                            </div>
                            <div class="flex flex-wrap justify-center gap-1 mt-2">
                                <For each={myTags()}>
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
                            </div >
                            <button class="bg-primary_color_3 text-white p-2 rounded-xl mt-6 hover:bg-primary_color_2 transition-colors"
                            onClick={() => navigate("./edit")}>
                                프로필 수정
                            </button>
                            <button class="bg-red-700 text-white p-2 rounded-xl mt-10 hover:bg-red-400 transition-colors"
                            onclick={()=>handleLogout()}>
                                로그아웃
                            </button>
                        </div>
                    </div>
                </div>
                <div class="flex flex-1 flex-col gap-20 mr-50">
                    <div class="flex flex-col gap-5">
                        <div class="text-lg font-bold">자기소개</div>
                        <div class="flex flex-wrap bg-[#FCFBFC] text-xl rounded-xl p-5 min-h-60 whitespace-pre-wrap ">
                            {myData().self_introduction}
                        </div>
                    </div>
                    <div class="flex flex-col gap-5">
                        <div class="text-lg font-bold">포트폴리오</div>
                        <a onClick={handleDownload}
                            class="bg-gradient-to-r from-primary_color_3 to-primary_color_2 text-white p-4 rounded-xl hover:cursor-pointer transition-all duration-300 flex items-center justify-between group"
                            >
                            <div class="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
                                </svg>
                                <span class="text-lg font-semibold">{myData().name}의 포트폴리오</span>
                            </div>
                            <div class="text-sm transition-opacity">
                                클릭하여 다운로드
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Mypage;