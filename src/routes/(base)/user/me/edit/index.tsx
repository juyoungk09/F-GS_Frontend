import axios from "axios";
import logo from "/logo.svg"
import { createResource, createSignal, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { For } from "solid-js";
import { createStore } from "solid-js/store";
import { BASE_URL } from "~/stores/store";
const Edit = () => {
    const url = "https://fg.sunrin.kr"
    const [putInfo,setPutInfo] = createStore<any>({
            email: "",
            name : "",
            student_id: 10000,
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
    const [myData,setMyData] = createSignal<User>({} as User)
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
        setPatchFiles("profile",file)
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
        .catch((err) => console.log("불러오기 실패",err))

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
            console.log("태그 실패패",err,tags)
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
                console.log("실패: ",err)
                setInfoChanged(false)
                console.log("내 정보 변경 실패")
            })
        if (profileChanged() === false && profileChanged() === false) alert("포트폴리오, 프로필 사진 변경 실패")
        else if (portfolioChanged() === false) alert("포트폴리오 변경 실패")
        else if (profileChanged() === false) alert("프로필 변경 실패")
        }
        
    return (
        <main class="min-h-screen bg-gray-50 py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
            <div class="max-w-7xl mx-auto">
                <div class="mb-8">
                    <h1 class="text-2xl sm:text-3xl font-bold text-primary_color_4">프로필 수정</h1>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Left Column - Profile Image and Actions */}
                <div class="lg:col-span-1 space-y-4">
                    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div class="flex flex-col items-center space-y-4">
                            <div class="relative group">
                                <img 
                                    class="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-2 border-gray-200 object-cover"
                                    src={preview() ?? `${BASE_URL}/public/${myData().profile_path}`} 
                                    alt="프로필 이미지"
                                />
                                <label 
                                    for="newProfile" 
                                    class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                                >
                                    <span class="bg-white text-primary_color_3 px-3 py-1 rounded-full text-sm font-medium">
                                        변경
                                    </span>
                                </label>
                            </div>
                            
                            <input 
                                id="newProfile" 
                                class="hidden" 
                                type="file" 
                                accept=".jpg, .jpeg, .png, .webp"
                                onChange={(e) => handleFileChange(e)}
                            />
                            
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen())}
                                class="w-full flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition-colors border-2 border-gray-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                                    <path d="M1.293 7.793A1 1 0 0 1 1 7.086V2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l.043-.043z"/>
                                </svg>
                                태그 추가
                            </button>
                            
                            <div class="w-full space-y-2 pt-4">
                                <button 
                                    onClick={changeInfo}
                                    class="w-full flex items-center justify-center gap-2 bg-primary_color_3 hover:bg-primary_color_2 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    변경사항 저장
                                </button>
                                
                                <button 
                                    onClick={() => navigate("../")}
                                    class="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-4 rounded-lg transition-colors"
                                >
                                    <i class="bi bi-arrow-left"></i>
                                    취소
                                </button>
                            </div>
                            <Show when={isDropdownOpen()}>
                                <div class="absolute z-10 mt-2 w-fit top-1/2 bg-white border border-gray-200 rounded-lg shadow-lg">
                                    <div class="flex border-b-2 border-gray-200 overflow-x-auto scrollbar-0">
                                        <button 
                                            class={`px-4 py-2 flex-shrink-0 ${!activeTagType() ? 'border-b-2 border-primary_color_3 text-primary_color_3' : 'text-gray-600'}`}
                                            onClick={() => setActiveTagType(null)}
                                        >
                                            전체
                                        </button>
                                        {Array.from(tagTypes).map(([t, tagType]) => (
                                            <button
                                                class={`px-4 py-2 flex-shrink-0 ${activeTagType() === t ? 'border-b-2 border-primary_color_3 text-primary_color_3' : 'text-gray-600'}`}
                                                onClick={() => setActiveTagType(t)}
                                            >
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
                    </div>
                </div>
                {/* Right Column - Form Fields */}
                <div class="lg:col-span-2 space-y-6">
                    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-1">
                                    <label class="block text-sm font-medium text-gray-700">이름</label>
                                    <input 
                                        class="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_color_3 focus:border-transparent transition-all"
                                        spellcheck="false"
                                        value={putInfo.name} 
                                        onInput={(e) => setPutInfo("name", e.currentTarget.value)}
                                    />
                                </div>
                                
                                <div class="space-y-1">
                                    <label class="block text-sm font-medium text-gray-700">학번</label>
                                    <input 
                                        class="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_color_3 focus:border-transparent transition-all"
                                        spellcheck="false"
                                        value={putInfo.student_id} 
                                        onInput={(e) => setPutInfo("student_id", e.currentTarget.value)}
                                    />
                                </div>
                                
                                <div class="space-y-1">
                                    <label class="block text-sm font-medium text-gray-700">이메일</label>
                                    <input 
                                        type="email"
                                        class="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_color_3 focus:border-transparent transition-all"
                                        spellcheck="false"
                                        value={putInfo.email} 
                                        onInput={(e) => setPutInfo("email", e.currentTarget.value)}
                                    />
                                </div>
                                
                                <div class="space-y-1 flex flex-col justify-end">
                                    <button 
                                        onClick={() => navigate("/user/me/edit/password")}
                                        class="text-primary_color_3 hover:text-primary_color_2 font-medium text-sm flex items-center gap-1 transition-colors self-start"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2h2v2h2v-2h2v-2h-2v-1.5a6 6 0 011.5-10.5A6 6 0 0118 9z" />
                                        </svg>
                                        비밀번호 변경하기
                                    </button>
                                </div>
                            </div>
                            
                            <div class="space-y-1">
                                <label class="block text-sm font-medium text-gray-700">자기소개</label>
                                <textarea 
                                    class="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_color_3 focus:border-transparent transition-all min-h-40"
                                    spellcheck="false"
                                    maxLength={2999}
                                    placeholder="자기소개를 입력해주세요 (최대 3000자)"
                                    value={putInfo.self_introduction} 
                                    onInput={(e) => setPutInfo("self_introduction", e.currentTarget.value)}
                                />
                                <div class="text-right text-sm text-gray-500">
                                    {putInfo.self_introduction?.length || 0} / 3000
                                </div>
                            </div>
                            
                            <div class="space-y-1">
                                <label class="block text-sm font-medium text-gray-700">포트폴리오</label>
                                <div class="mt-1 flex items-center">
                                    <label 
                                        for="newPortfolio" 
                                        class="w-full bg-gradient-to-r from-primary_color_3 to-primary_color_2 text-white p-4 rounded-lg hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-between"
                                    >
                                        <span class="font-medium">포트폴리오 업로드</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </label>
                                    <input 
                                        id="newPortfolio" 
                                        type="file" 
                                        class="hidden"
                                        onChange={(e) => setPatchFiles("portfolio", e.target.files?.[0] || null)}
                                    />
                                </div>
                                {myData().portfolio_path && (
                                    <p class="mt-2 text-sm text-gray-600">
                                        현재 파일: <span class="font-medium">{myData().portfolio_path}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </main>
    )
}
export default Edit;