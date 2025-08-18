import { createResource, createSignal, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { BASE_URL } from "~/stores/store";
import UserItem from "~/components/features/user/UserItem";
const SearchPost = () => {
    const [allTags] = createResource<Tag[]>(async () => {
      const response = await fetch(`${BASE_URL}/posts/tags`);
      return (await response.json()) as Tag[];
    });
    let inputRef: HTMLTextAreaElement | undefined;
    const [searchQuery, setSearchQuery] = createSignal("");
    const [selectedTags, setSelectedTags] = createSignal<Tag[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = createSignal(false); 
    const [activeTagType, setActiveTagType] = createSignal<string | null>(null);  // tag_type
    const [users, setUsers] = createSignal<User[]>([]);
    const [currentPage, setCurrentPage] = createSignal(1);
    const [totalPages, setTotalPages] = createSignal(1);
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
    };
    const selectedTagNames = (): string[]  => { // 선택된 태그 id에 맞춰춰 이름들 
        const tags = filteredTags();
        if (!tags) return [];
        return tags.filter(tag => selectedTags().includes(tag))
            .map(tag => tag.name);
    };
    const handleSearch = async () => {
        const tags = selectedTagNames();
        const query = searchQuery();
        const url = `http://localhost:3000/search/user?query=${query}&tags=${tags.join(",")}`;
        window.history.pushState({}, "", url);
        await fetch(BASE_URL + "/search/user" + `?page=${currentPage()}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "input": query,
                "tags": selectedTags().map(tag => tag.id),
                "page": currentPage(),
            }),
        }).then(response => response.json()).then(data => {
            console.log(data);
            setUsers(data.data);
            setTotalPages(data.totalPages);
        }).catch(error => {
            console.error(error);
        });
    };
    const handlePageChange = (newPage: number) => {
        if (newPage !== currentPage()) {
            setCurrentPage(newPage);
            console.log(newPage);
            handleSearch();
        }
    };
    return (
        <div class="w-full min-h-screen p-6 bg-gray-50">
            <div class="max-w-4xl mx-auto">
                <div class="flex w-full justify-between items-center mb-6">
                    <h1 class="text-2xl font-bold text-gray-800">유저 검색</h1>
                    <A href="/search/post" class="text-white bg-primary_color_3 hover:bg-primary_color_2 font-medium px-6 py-2 rounded-lg"> <i class="bi bi-people-fill"></i>게시글 검색</A>
                </div>
               
                <div class="relative mb-6">
                    <div class="flex md:flex-row flex-col items-start gap-2">
                        <div class="relative w-full flex-1">
                            <textarea   
                                value={searchQuery()}
                                onInput={(e) => {
                                    autoResize();
                                    setSearchQuery(e.currentTarget.value)
                                }}
                                placeholder="찾는 사람의 실력 / 성격을 입력하세요"
                                class="w-full resize-none transition-all overflow-y-auto max-h-48 px-4 py-3 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary_color_3 focus:border-transparent"
                                ref={inputRef}
                            />
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen())}
                                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-800 hover:text-gray-500"
                            >
                                <i class="bi bi-tags-fill text-xl"></i>
                            </button>
                        </div>
                        <button onClick={handleSearch} class="bg-primary_color_3 md:w-auto w-full text-white px-6 py-3 rounded-lg hover:bg-primary_color_2 transition-colors">
                            <i class="bi bi-search"></i>
                        </button>
                    </div>
                    <Show when={isDropdownOpen()}>
                        <div class="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
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
                <div class="bg-white rounded-lg shadow p-6">
                    <Show when={users().length === 0}>
                        <p class="text-gray-500 text-center">
                            {searchQuery() || selectedTags().length > 0 
                                ? `'${searchQuery()}' ${selectedTags().length > 0 ? `및 ${selectedTagNames().join(', ')} 태그` : ''}에 대한 검색 결과가 여기에 표시됩니다.`
                                : '검색어를 입력하거나 태그를 선택해 주세요.'}
                        </p>
                    </Show>
                    <Show when={users().length > 0}>
                        <div class="mt-4">
                            <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                                <For each={users()}>
                                    {(user) => (
                                        <UserItem user={user} />
                                    )}
                                </For>
                            </div>
                        </div>
                    </Show>
                    <Show when={totalPages() > 1}>
                        <div class="mt-4 w-full flex justify-center">
                            <For each={Array.from({ length: totalPages() }, (_, i) => i + 1)}>
                                {(page) => (
                                    <button 
                                        onClick={() => handlePageChange(page)}
                                        class={`px-2 py-1 rounded ${page === currentPage() ? 'bg-primary_color_3 text-white' : 'text-gray-600'}`}
                                    >
                                        {page}
                                    </button>
                                )}
                            </For>
                        </div>
                    </Show>
                </div>
            </div>
        </div>
    );
};

export default SearchPost;