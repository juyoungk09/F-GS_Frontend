import { A } from "@solidjs/router";

const Footer = () => {
  return (
    <footer class="w-full truncate bg-primary_color_4 text-white">
      <div class="container mx-auto px-4 py-8">
        <div class="w-full grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="mb-6 md:mb-0">
            <h3 class="text-xl font-bold mb-4 text-primary_color_2">F&GS</h3>
            <p class="text-sm text-gray-300">
              선린인터넷고등학교
              <br />
              F&GS 프로젝트
            </p>
          </div>

          <div>
            <h4 class="text-lg font-semibold mb-4">빠른 링크</h4>
            <ul class="space-y-2">
              <li><A href="/" class="text-gray-300 hover:text-white transition-colors">홈</A></li>
              <li><A href="/post" class="text-gray-300 hover:text-white transition-colors">게시판</A></li>
              <li><A href="/notification" class="text-gray-300 hover:text-white transition-colors">공지사항</A></li>
            </ul>
          </div>

          <div>
            <h4 class="text-lg font-semibold mb-4">연락처</h4>
            <ul class="space-y-2 text-sm text-gray-300">
              <li class="flex items-center">
                <svg class="w-4 h-4 bg-  mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                25s100@sunrint.hs.kr
              </li> 
              <li class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                서울특별시 용산구 원효로97길 33-4
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-12 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} FGSunrin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;