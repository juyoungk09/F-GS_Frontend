import logo from "/logo.svg"
const Mypage = () => {
    return(
        <main class="mx-auto text-gray-700 p-4">
            <div class="flex flex-1 m-15 h-screen gap-20">
                <div class="flex flex-col gap-5">
                    <img class="w-85 h-85 rounded-full border-black border-2"src="/profile.webp" alt="profile"/>
                    <div class="flex">
                        <div class="flex-1">
                            <div class="flex justify-center text-lg">1학년 5반 7번</div>
                            <div class="flex justify-center text-2xl">김우찬</div>
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
                        </div>
                    </div>
                </div>
                <div class="flex flex-1 flex-col gap-5 mr-50 h-screen">
                    <div class="text-2xl">자기소개</div>
                    <div class="flex flex-wrap bg-[#FCFBFC] text-xl rounded-2xl p-5 min-h-60">
                        안녕하세요 디자이너를민민기 팀의 프론트 춘식이 2호 김우찬입니다.
                    </div>
                </div>
            </div>
        </main>
    )
    }
export default Mypage;