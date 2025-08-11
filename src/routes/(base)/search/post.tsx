import { createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
const SearchPost = () => {
    const allTags : Tag[] = [
        { id: 1, name: "React", bg_color: "#61DAFB", font_color: "#000", tag_type: "f", usage: 1 },
        { id: 2, name: "Node.js", bg_color: "#61DAFB", font_color: "#000", tag_type: "f", usage: 1 },
        { id: 3, name: "TypeScript", bg_color: "#61DAFB", font_color: "#000", tag_type: "l", usage: 1 },
        { id: 4, name: "Python", bg_color: "#61DAFB", font_color: "#000", tag_type: "l", usage: 1 },
        { id: 5, name: "Django", bg_color: "#61DAFB", font_color: "#000", tag_type: "f", usage: 1 },
        { id: 6, name: "Vue", bg_color: "#61DAFB", font_color: "#000", tag_type: "f", usage: 1 },
        { id: 7, name: "Java", bg_color: "#61DAFB", font_color: "#000", tag_type: "l", usage: 1 },
        { id: 8, name: "Spring", bg_color: "#61DAFB", font_color: "#000", tag_type: "f", usage: 1 },
        { id: 9, name: "Next.js", bg_color: "#61DAFB", font_color: "#000", tag_type: "o", usage: 1 },
        { id: 10, name: "Nest.js", bg_color: "#61DAFB", font_color: "#000", tag_type: "o", usage: 1 },
        { id: 11, name: "Docker", bg_color: "#61DAFB", font_color: "#000", tag_type: "f", usage: 1 },
        { id: 12, name: "AWS", bg_color: "#61DAFB", font_color: "#000", tag_type: "f", usage: 1 },
        { id: 13, name: "Heroku", bg_color: "#61DAFB", font_color: "#000", tag_type: "f", usage: 1 },
        { id: 14, name: "Git", bg_color: "#61DAFB", font_color: "#000", tag_type: "f", usage: 1 },
        { id: 15, name: "GitHub", bg_color: "#61DAFB", font_color: "#000", tag_type: "f", usage: 1 },
        { id: 16, name: "Figma", bg_color: "#61DAFB", font_color: "#000", tag_type: "d", usage: 1 },
        { id: 17, name: "Adobe XD", bg_color: "#61DAFB", font_color: "#000", tag_type: "d", usage: 1 },
        { id: 18, name: "Figma", bg_color: "#61DAFB", font_color: "#000", tag_type: "d", usage: 1 },
        { id: 19, name: "Adobe XD", bg_color: "#61DAFB", font_color: "#000", tag_type: "d", usage: 1 },
        { id: 20, name: "Figma", bg_color: "#61DAFB", font_color: "#000", tag_type: "d", usage: 1 },
        { id: 21, name: "Kotlin", bg_color: "#61DAFB", font_color: "#000", tag_type: "l", usage: 1 },
        { id: 22, name: "Android", bg_color: "#61DAFB", font_color: "#000", tag_type: "f", usage: 1 },
        { id: 23, name: "iOS", bg_color: "#61DAFB", font_color: "#000", tag_type: "f", usage: 1 },
    ];
    let dropdownRef: HTMLElement | undefined;
    const [searchQuery, setSearchQuery] = createSignal("");
    const [selectedTags, setSelectedTags] = createSignal<number[]>([]);
    const [selectedCategory, setSelectedCategory] = createSignal<string>("");
    const [activeCategory, setActiveCategory] = createSignal<string>("");
    const [isDropdownOpen, setIsDropdownOpen] = createSignal(false);
    const [activeTag, setActiveTag] = createSignal<string>("");

    const tagTypes = new Map<string, string>([
        ["f", "프레임워크"],
        ["l", "언어"],
        ["o", "기타"],
        ["d", "직군"],
    ]);
    
    const filteredTags = () => {
        if (!activeTag()) return allTags;
        return allTags.filter(tag => tag.tag_type === activeTag());
    };

    const toggleTag = (tagId: number) => {
        setSelectedTags(prev => 
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        );
    };
    const toggleCategory = (category: string) => {
        setSelectedCategory(prev => 
            prev === category ? "" : category
        );
    };
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
          setIsDropdownOpen(false);
        }
      };
    const selectedTagNames = () => 
        allTags
            .filter(tag => selectedTags().includes(tag.id))
            .map(tag => tag.name);

    return (
        <div class="w-full min-h-screen p-6 bg-gray-50">
            <div class="max-w-4xl mx-auto">
                <div class="flex gap-3 items-center mb-6">
                    <h1 class="text-2xl font-bold text-gray-800">게시물 검색</h1>
                    <A href="/search/user" class="text-white bg-primary_color_2 hover:bg-primary_color_3 font-medium px-6 py-2 rounded-lg"> <i class="bi bi-people-fill"></i>유저 검색</A>
                </div>
               
                <div class="relative mb-6">
                    <div class="flex items-center gap-2">
                        <div class="relative flex-1">
                            <input
                                type="text"
                                value={searchQuery()}
                                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                                placeholder="검색어를 입력하세요..."
                                class="w-full px-4 py-3 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary_color_3 focus:border-transparent"
                            />
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen())}
                                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-800 hover:text-gray-500"
                            >
                                <i class="bi bi-tags-fill text-xl"></i>
                            </button>
                        </div>
                        <button onClick={handleClickOutside} class="bg-primary_color_3 text-white px-6 py-3 rounded-lg hover:bg-primary_color_2 transition-colors">
                            검색
                        </button>
                    </div>
                    <Show ref={dropdownRef} when={isDropdownOpen()}>
                        <div class="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                            <div class="flex border-b-2 border-gray-200 overflow-x-auto scrollbar-0">
                                <button 
                                    class={`px-4 py-2 flex-shrink-0${!activeTag() ? 'border-b-2 border-primary_color_3 text-primary_color_3' : 'text-gray-600'}`}
                                    onClick={() => setActiveTag("")}
                                >
                                    전체
                                </button>
                                {Array.from(tagTypes).map(([t, tagType]) => (
                                    <button 
                                        class={`px-4 py-2 flex-shrink-0 ${activeTag() === t ? 'border-b-2 border-primary_color_3 text-primary_color_3' : 'text-gray-600'}`}
                                        onClick={() => setActiveTag(t)}
                                    >
                                        {tagType}
                                    </button>
                                ))}
                            </div>
                            <div class="max-h-60 overflow-y-auto p-3">
                                <div class="flex flex-wrap gap-2">
                                    {filteredTags().map(tag => (
                                        <button
                                            onClick={() => toggleTag(tag.id)}
                                            class={`px-3 py-1 rounded-full text-sm ${
                                                selectedTags().includes(tag.id)
                                                    ? 'bg-primary_color_3 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            </div> <div class="flex border-b-2 border-gray-200 overflow-x-auto scrollbar-0">
                                <button 
                                    class={`px-4 py-2 flex-shrink-0${!activeTag() ? 'border-b-2 border-primary_color_3 text-primary_color_3' : 'text-gray-600'}`}
                                    onClick={() => setActiveTag("")}
                                >
                                    전체
                                </button>
                                {Array.from(tagTypes).map(([t, tagType]) => (
                                    <button 
                                        class={`px-4 py-2 flex-shrink-0 ${activeTag() === t ? 'border-b-2 border-primary_color_3 text-primary_color_3' : 'text-gray-600'}`}
                                        onClick={() => setActiveTag(t)}
                                    >
                                        {tagType}
                                    </button>
                                ))}
                            </div>
                            <div class="max-h-60 overflow-y-auto p-3">
                                <div class="flex flex-wrap gap-2">
                                    {filteredTags().map(tag => (
                                        <button
                                            onClick={() => toggleTag(tag.id)}
                                            class={`px-3 py-1 rounded-full text-sm ${
                                                selectedTags().includes(tag.id)
                                                    ? 'bg-primary_color_3 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Show>
                </div>

                <Show when={selectedCategory().length > 0}>
                    <div class="mb-6">
                        <h3 class="text-sm font-medium text-gray-500 mb-2">선택된 카테고리:</h3>
                        <div class="flex flex-wrap gap-2">
                            <span class={`inline-flex items-center px-3 py-1 rounded-full text-800 text-sm ${selectedCategory() === '프로젝트' ? 'bg-primary_color_3 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                {selectedCategory()}
                                <button 
                                    onClick={() => toggleCategory(selectedCategory())}
                                    class="ml-1.5 text-blue-500 hover:text-blue-700"
                                >
                                    ×
                                </button>
                            </span>
                        </div>
                    </div>
                </Show>
                <Show when={selectedTags().length > 0}>
                    <div class="mb-6">
                        <h3 class="text-sm font-medium text-gray-500 mb-2">선택된 태그:</h3>
                        <div class="flex flex-wrap gap-2">
                            {selectedTagNames().map(tagName => (
                                <span class="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                                    {tagName}
                                    <button 
                                        onClick={() => toggleTag(allTags.find(t => t.name === tagName)?.id!)}
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
                    <p class="text-gray-500 text-center">
                        {searchQuery() || selectedTags().length > 0 
                            ? `'${searchQuery()}' ${selectedTags().length > 0 ? `및 ${selectedTagNames().join(', ')} 태그` : ''}에 대한 검색 결과가 여기에 표시됩니다.`
                            : '검색어를 입력하거나 태그를 선택해 주세요.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SearchPost;