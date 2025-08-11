const Loading = () => {
    return (
        <div class="flex flex-col bg-gray-50 items-center justify-center h-screen">
            <div class="animate-spin rounded-full h-32 w-32 border-b-3 border-primary_color_3"></div>
            <div class="text-primary_color_4 text-2xl font-bold mt-4">Loading...</div>
        </div>
    );
}
export default Loading;