import { createResource, createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import { BASE_URL } from "~/stores/store";
const SearchPost = () => {
    const [allTags] = createResource<Tag[]>(async () => {
      const response = await fetch(`${BASE_URL}/posts/tags`);
      return (await response.json()) as Tag[];
    });
    const [allCategories] = createResource<Category[]>(async () => {
      const response = await fetch(`${BASE_URL}/posts/festivals`);
      return (await response.json()) as Category[];
    });
    const [allPosts] = createResource<Post[]>(async () => {
      const response = await fetch(`${BASE_URL}/search/post?category=${selectedCategories().join(",")}&tags=${selectedTags().join(",")}`);
      return (await response.json()) as Post[];
    });
    let dropdownRef: HTMLElement | undefined;
    const [searchQuery, setSearchQuery] = createSignal("");
    const [selectedTags, setSelectedTags] = createSignal<Tag[]>([]);
    const [selectedCategories, setSelectedCategories] = createSignal<Category[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = createSignal(false); 
    const [activeTagType, setActiveTagType] = createSignal<string | null>(null);  // tag_type

    const tagTypes = new Map<string, string>([
        ["f", "프레임워크"],
        ["l", "언어"],
        ["o", "기타"],
        ["d", "직군"],
    ]);
    
    const filteredTags = () => {
        const tags = allTags();
        if (!tags) return [];
        if (!activeTagType()) return tags;
        return tags.filter(tag => tag.tag_type === activeTagType());
    };
    const filteredCategories = () => {
        const categories = allCategories();
        if (!categories) return [];
        return categories;
    };
    const toggleTag = (tag: Tag) => { // 태그 선택 / 취소
          setSelectedTags(prev => prev.includes(tag) ? prev.filter(selectedTag => selectedTag.id !== tag.id) : [...prev, tag]);
    };
    const toggleCategory = (category: Category) => { // 카테고리 선택 / 취소
        setSelectedCategories(prev => 
            prev.includes(category) ? prev.filter(selectedCategory => selectedCategory.id !== category.id) : [...prev, category]
        );
    };
    const selectedTagNames = (): string[]  => { // 선택된 태그 id에 맞춰춰 이름들 
        const tags = filteredTags();
        if (!tags) return [];
        return tags.filter(tag => selectedTags().includes(tag))
            .map(tag => tag.name);
    };
    const handleSearch = async () => {
        const tags = selectedTagNames();
        const categories = selectedCategories();
        const query = searchQuery();
        const url = `${BASE_URL}/posts/search?query=${query}&category=${categories.join(",")}&tags=${tags.join(",")}`;
        window.location.href = url;
        await fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
        
    };
    return (
        <div class="w-full min-h-screen p-6 bg-gray-50">
            <div class="max-w-4xl mx-auto">
                <div class="flex w-full justify-between items-center mb-6">
                    <h1 class="text-2xl font-bold text-gray-800">게시물 검색</h1>
                    <A href="/search/user" class="text-white bg-primary_color_3 hover:bg-primary_color_2 font-medium px-6 py-2 rounded-lg"> <i class="bi bi-people-fill"></i>유저 찾기</A>
                </div>
               
                <div class="relative mb-6">
                    <div class="flex md:flex-row flex-col items-center gap-2">
                        <div class="relative w-full flex-1">
                            <input
                                type="text"
                                value={searchQuery()}
                                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                                placeholder="검색어를 입력하세요..."
                                class="w-full px-4 py-3 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary_color_3 focus:border-transparent"
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
                            <div class="max-h-60 overflow-y-auto p-3">
                                <div class="flex flex-wrap gap-2">
                                    {filteredCategories().map(category => (
                                        <button
                                            onClick={() => toggleCategory(category)}
                                            class={`px-3 py-1 rounded-full text-sm ${
                                                selectedCategories().includes(category)
                                                    ? 'bg-primary_color_3 text-white'
                                                    : `bg-gray-200 text-gray-600 hover:bg-gray-100`
                                            }`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Show>
                </div>

                <Show when={selectedCategories().length > 0}>
                    <div class="mb-6">
                        <h3 class="text-sm font-medium text-gray-500 mb-2">선택된 카테고리:</h3>
                        <div class="flex flex-wrap gap-2">
                            {selectedCategories().map(category => (
                            <span class={`inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm`}>
                                {category.name}
                                <button 
                                    onClick={() => toggleCategory(category)}
                                    class="ml-1.5 text-blue-500 hover:text-blue-700"
                                >
                                    ×
                                </button>
                            </span>
                            ))}
                        </div>
                    </div>
                </Show>
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