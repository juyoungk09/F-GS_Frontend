import axios from "axios";
import logo from "/logo.svg"
import { createResource, createSignal, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { For } from "solid-js";
import { createStore } from "solid-js/store";
const Edit = () => {
    const url = "https://fg.sunrin.kr"
    const [putInfo,setPutInfo] = createStore({
            email: "",
            name : "",
            student_id: "",
            self_introduction: "",
            old_email: "",
        })
    const [patchFiles,setPatchFiles] = createStore({
            portfolio: null as File | null,
            profile: null as File | null
    })
    const [allTags] = createResource<Tag[]>(async () => {
        const response = await fetch(`${url}/api/posts/tags`);
        return (await response.json()) as Tag[];
    });
    let inputRef: HTMLTextAreaElement | undefined;
    const [searchQuery, setSearchQuery] = createSignal("");
    const [selectedTags, setSelectedTags] = createSignal<Tag[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = createSignal(false); 
    const [activeTagType, setActiveTagType] = createSignal<string | null>(null);  // tag_type

    const tagTypes = new Map<string, string>([
        ["f", "프레임워크"],
        ["l", "언어"],
        ["o", "기타"],
        ["d", "직군"],
    ]);
    const autoResize = () => {
        if (!inputRef) return;
        inputRef.style.height = "auto"; // 높이 초기화
        inputRef.style.height = inputRef.scrollHeight + "px"; // 내용만큼 높이
        };
    const filteredTags = () => {
        const tags = allTags();
        if (!tags) return [];
        if (!activeTagType()) return tags;
        return tags.filter(tag => tag.tag_type === activeTagType());
    };
    const toggleTag = (tag: Tag) => { // 태그 선택 / 취소
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(selectedTag => selectedTag.id !== tag.id) : [...prev, tag]);
        console.log(selectedTags())
    };

    const navigate = useNavigate()
    const [myData,setMyData] = createSignal("")
    const [preview, setPreview] = createSignal<string | null>(null);
    const [infoChanged,setInfoChanged] = createSignal(true)
    const [portfolioChanged,setPortfolioChanged] = createSignal(true)
    const [profileChanged,setProfileChanged] = createSignal(true)
    const handleFileChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
        const url = URL.createObjectURL(file);
        setPreview(url);
        setPatchFiles("profile",e.target.files[0])
        }
    };

    axios.get(`${url}/api/users/private/me`,{withCredentials: true})
        .then((res) => {
            console.log("불러오기 성공!",res)
            const data = res.data
            setMyData(data)
            setPutInfo("name",`${data.name}`)
            setPutInfo("student_id",`${data.student_id}`)
            setPutInfo("email",`${data.email}`)
            setPutInfo("old_email",`${data.email}`)
            setPutInfo("self_introduction",`${data.self_introduction}`)
        })
        .catch((err) => console.log("병신",err))

        function changeInfo(){
            const user = {
                email: putInfo.email,
                name: putInfo.name,
                old_email: putInfo.old_email,
                self_introduction: putInfo.self_introduction,
                student_id: Number(putInfo.student_id)
            }
            console.log(user)
            if(patchFiles.portfolio !== null){
                const formPortfolio = new FormData()
                formPortfolio.append("portfolio",patchFiles.portfolio)
                axios.patch(`${url}/api/users/private/portfolio`,formPortfolio,{
                    withCredentials: true
                })
                .then((res) => {
                    console.log("포트폴리오 변경 성공!",res)
                    setPortfolioChanged(true)
                })
                .catch((err) => {
                    console.log("포트폴리오 변경 실패",err)
                    setPortfolioChanged(false)
                })    
            }
            if (patchFiles.profile !== null){
                const formProfile = new FormData()
                formProfile.append("profile",patchFiles.profile)
                axios.patch(`${url}/api/users/private/profile`,formProfile,{
                    withCredentials: true
                })
                .then((res) => {
                    console.log("프사 변경 성공!",res)
                    setProfileChanged(true)
                })
                .catch((err) => {
                    console.log("프사 변경 실패",err)
                    setProfileChanged(false)
                })
            }
        const tags = {
            tag_ids: selectedTags().map((e)=>e.id)
        }
        // tags.tag_ids = [selectedTags()];

        axios.post(`${url}/api/users/private/tags`,tags,{
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
        })
        .then((res=>{
            console.log("태그 변경 성공!",res,tags)
        }))
        .catch((err) => {
            console.log("태그 병신",err,tags)
        })

        axios.put(`${url}/api/users/private/me`,user,{
                withCredentials: true,
                headers: { "Content-Type": "application/json" }
            })
            .then((res) => {
                console.log("수정 성공!",res)
                setInfoChanged(true)
                navigate("/user/me")
            })
            .catch((err) => {
                console.log("병신",err)
                setInfoChanged(false)
                console.log("내 정보 변경 실패")
            })
        if (profileChanged() === false && profileChanged() === false) alert("포트폴리오, 프로필 사진 변경 실패")
        else if (portfolioChanged() === false) alert("포트폴리오 변경 실패")
        else if (profileChanged() === false) alert("프로필 변경 실패")
        }
        
    return(
        <main class="mx-auto flex-col text-gray-900 p-4">
            <div class="p-5 px-15 rounded-4xl m-5 bg-primary_color_3 mx-15 text-5xl font-bold w-fit">Profile Edit</div>
            <div class="flex flex-1 m-15 min-h-screen gap-50">
                <div class="flex flex-col items-center gap-5 flex-wrap relative">
                    <img class="w-70 h-70 rounded-full  bg-white border-gray-800 border-1"
                    src={preview() ? preview() : `${url}/api/public/${myData().profile_path}`} alt="profile"/>
                    <label for="newProfile" class="hover:cursor-pointer hover:underline text-blue-800">프로필 사진 수정</label>
                    <button class="text-gray-800 hover:text-gray-500 w-20 flex-row"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen())}>
                        <div>태그 추가</div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tags-fill" viewBox="0 0 16 16">
                            <path d="M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                            <path d="M1.293 7.793A1 1 0 0 1 1 7.086V2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l.043-.043z"/>
                        </svg>
                    </button>
                    <input id="newProfile" class="hidden" type="file" accept=".jpg, .jpeg, .png, .webp"
                    onChange={(e)=>{handleFileChange(e)}}></input>
                    <div class="reltive">
                        <Show when={isDropdownOpen()}>
                            <div class="absolute z-10 mt-2 w-fit bg-white border border-gray-200 rounded-lg shadow-lg">
                                <div class="flex border-b-2 border-gray-200 overflow-x-auto scrollbar-0">
                                    <button 
                                        class={`px-4 py-2 flex-shrink-0 ${!activeTagType() ? 'border-b-2 border-primary_color_3 text-primary_color_3' : 'text-gray-600'}`}
                                        onClick={() => setActiveTagType(null)}>
                                        전체
                                    </button>
                                    {Array.from(tagTypes).map(([t, tagType]) => (
                                        <button
                                            class={`px-4 py-2 flex-shrink-0 ${activeTagType() === t ? 'border-b-2 border-primary_color_3 text-primary_color_3' : 'text-gray-600'}`}
                                            onClick={() => setActiveTagType(t)}>
                                            {tagType}
                                        </button>
                                    ))}
                                </div>
                                <div class="max-h-60 overflow-y-auto p-3">
                                    <div class="flex flex-wrap gap-2">
                                        {filteredTags().map(tag => (
                                            <button
                                                onClick={() => toggleTag(tag)}
                                                class={`px-3 py-1 rounded-full text-sm`}
                                                style={{ 'background-color': `${ selectedTags().includes(tag) ? '#7886C7' : tag.bg_color}`, color: `${selectedTags().includes(tag) ? 'white' : tag.font_color}` }}
                                            >
                                                {tag.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Show>
                    </div>
                    
                    <Show when={selectedTags().length > 0}>
                    <div class="mb-6">
                        <h3 class="text-sm font-medium text-gray-500 mb-2">선택된 태그:</h3>
                        <div class="flex flex-wrap gap-2">
                            {selectedTags().map(tag => (
                                <span class="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                                    {tag.name}
                                    <button 
                                        onClick={() => toggleTag(tag)}
                                        class="ml-1.5 text-blue-500 hover:text-blue-700"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </Show>
                    <div class="flex w-fit">
                        <div class="flex-1 flex flex-col">
                            <button class="w-70 bg-primary_color_3 text-white p-2 rounded-xl mt-6 hover:bg-primary_color_2 transition-colors"
                            onClick={changeInfo}>
                                수정 저장
                            </button>
                            <button class="bg-red-700 text-white p-2 rounded-xl mt-10 hover:bg-red-400 transition-colors"
                            onclick={()=>navigate("/user/me")}>
                                수정 취소
                            </button>
                        </div>
                    </div>
                </div>
                <div class="flex flex-1 flex-col gap-10 mr-50">
                    <div class="flex flex-col gap-3">
                        <div class="text-lg font-bold">이름</div>
                        <input class="flex-none bg-[#FCFBFC] text-xl rounded-xl px-4 w-100 h-10" spellcheck="false"
                        value={putInfo.name} onInput={(e) => setPutInfo("name",e.currentTarget.value)}>
                        </input>
                    </div>
                    <div class="flex flex-col gap-3">
                        <div class="text-lg font-bold">학번</div>
                        <input class="flex-none bg-[#FCFBFC] text-xl rounded-xl px-4 w-100 h-10" spellcheck="false"
                        value={putInfo.student_id} onInput={(e) => setPutInfo("student_id",e.currentTarget.value)}>
                        </input>
                    </div>
                   <div class="flex flex-col gap-3">
                        <div class="text-lg font-bold">이메일</div>
                        <input class="flex-none bg-[#FCFBFC] text-xl rounded-xl px-4 w-100 h-10" spellcheck="false"
                        value={putInfo.email} onInput={(e) => setPutInfo("email",e.currentTarget.value)}>
                        </input>
                    </div>
                    <div class="flex flex-col gap-3">
                        <button class="hover:cursor-pointer hover:bg-gray-100 hover:text-gray-800 transition-colors bg-[#FCFBFC] text-lg rounded-xl px-4 w-50 h-10"
                        onClick={() => navigate("/user/me/edit/password")}>비밀번호 변경</button>
                    </div>
                    <div class="flex flex-col gap-3">
                        <div class="text-lg font-bold">자기소개</div>
                        <textarea class="flex flex-wrap bg-[#FCFBFC] text-xl rounded-xl p-5 min-h-60 resize-none" spellcheck="false"
                        maxLength={2999}
                        value={putInfo.self_introduction} onInput={(e) => setPutInfo("self_introduction",e.currentTarget.value)}>
                        </textarea>
                    </div>
                    <div class="flex flex-col gap-3">
                        <div class="text-lg font-bold">포트폴리오</div>
                        <label for="newPortfolio" class="bg-gradient-to-r from-primary_color_3 to-primary_color_2 text-white p-4 rounded-xl hover:cursor-pointer transition-all duration-300 flex items-center justify-between group">
                            <div>포트폴리오 변경하기</div>
                            <div>현재 포트폴리오: {myData().portfolio_path ? myData().portfolio_path : "없음"}</div>
                        </label>
                        <input id="newPortfolio" type="file" class="hidden"
                        onChange={(e)=>{setPatchFiles("portfolio",e.target.files[0])
                            }}> 
                        </input>
                    </div>
                </div>
            </div>
        </main>
    )
}
export default Edit;