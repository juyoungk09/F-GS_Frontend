import { Show } from "solid-js";

interface HoverPostItemProps {
  post: Post;
  setIsMoreShow: (show: number) => void;
}

const HoverPostItem = ({ post, setIsMoreShow }: HoverPostItemProps) => {
  return (
    <div class="w-full bg-white p-4 rounded-lg shadow-lg">
      <div class="flex justify-between border-b-2 border-gray-200 items-center mb-3">
      <h3 class="text-md font-semibold text-gray-700 mb-1">모집 내용</h3>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsMoreShow(0);
          }}
          class="text-gray-400 hover:text-gray-600"
          aria-label="닫기"
        >
          ✕
        </button>
      </div>

      <div class="h-[15rem] overflow-y-auto">
        <p class="text-gray-700 w-full whitespace-pre-line text-sm">{post.content}</p>
      </div>
    </div>

  );
};
export default HoverPostItem;