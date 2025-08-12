import logo from "/logo.svg"
const Mypage = () => {
    return(
        <main class="mx-auto flex-col text-gray-700 p-4">
            <div class="p-5 px-15 rounded-4xl m-5 bg-primary_color_3 mx-15 text-5xl font-bold w-fit">About Me</div>
            <div class="flex flex-1 m-15 min-h-screen gap-20">
                <div class="flex flex-col gap-5">
                    <img class="w-70 h-70 rounded-full border-black border-2"src="/profile.webp" alt="profile"/>
                    <div class="flex">
                        <div class="flex-1 flex flex-col">
                            <div class="flex flex-col gap-2">
                                <div class="flex justify-center text-lg font-semibold">1학년 5반 7번</div>
                                <div class="flex justify-center text-2xl font-extrabold">김우찬</div>
                            </div>
                            <div class="flex flex-wrap justify-center gap-1 mt-2">
                                {/* <For each={post.tags}>
                                    {(tag) => (
                                        <span 
                                            class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                                            style={{ 'background-color': ${tag.bg_color}20, color: tag.font_color, 'max-width': '100px' }}
                                            title={tag.name}
                                            >
                                            {tag.name}
                                        </span>
                                )}
                            </For>  */}
                                <span 
                                    class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[20px] font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                                    title="python">
                                    python
                                </span>
                                <span 
                                    class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[20px] font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                                    title="python">
                                    React
                                </span>
                            </div>
                            <button class="bg-primary_color_3 text-white p-2 rounded-xl my-6 hover:bg-primary_color_2 transition-colors">
                                프로필 수정
                            </button>
                        </div>
                    </div>
                </div>
                <div class="flex flex-1 flex-col gap-20 mr-50">
                    <div class="flex flex-col gap-5">
                        <div class="text-lg font-bold">자기소개</div>
                        <div class="flex flex-wrap bg-[#FCFBFC] text-xl rounded-xl p-5 min-h-60">
                            안녕하세요 디자이너를민민기 팀의 프론트 춘식이 2호 김우찬입니다.
                        </div>
                    </div>
                    <div class="flex flex-col gap-5">
                        <div class="text-lg font-bold">포트폴리오</div>
                        <div class="hover:cursor-pointer">포트폴리오 이름!</div>
                    </div>
                </div>
            </div>
        </main>
    )
    }
export default Mypage;