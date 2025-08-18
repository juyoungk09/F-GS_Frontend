import { useNavigate, useLocation, RouteSectionProps } from "@solidjs/router";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import Sidebar from "~/components/layout/Sidebar";
import { createMemo, createSignal, createEffect } from "solid-js";
import { Show } from "solid-js/web";
import { Suspense } from "solid-js";
import Loading from "~/components/layout/Loading";
import { user, setUser } from "~/stores/store";
import axios from "axios";
export default function Layout(props: RouteSectionProps) { 
    const navigate = useNavigate();
    const location = useLocation();
    const [hamberger, setHamberger] = createSignal(false);
    function getCookieClient(name: string): string | null {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()!.split(';').shift()!;
      return null;
    }
    createEffect(async () => {
      try {
        console.log("1. 인증 시작");
        const token = getCookieClient("access_token");
        const allCookies = document.cookie;
        console.log("2. 토큰:", token); 
        console.log("3. 모든 쿠키:", allCookies); 
        
        if (token) {
          console.log("4. 토큰 있음: 사용자 데이터 가져오기");
          try {
            const response = await axios.get("https://fg.sunrin.kr/api/users/private/me", { withCredentials: true });
            const userData = response.data;
            console.log("5. 사용자 데이터 받음:", userData);
            setUser(userData);
          } catch (error) {
            console.error("사용자 데이터 가져오기 오류:", error);
          }
        } else {
          console.log("6. 토큰 없음");
          const publicPaths = ["/", "/post/:id", "/search/post", "/search/user"];
          const isPublic = publicPaths.some(path => location.pathname.startsWith(path));
          console.log("7. 공개 페이지 여부:", isPublic);
          console.log("8. 현재 경로 pathname:", location.pathname);
            if (!isPublic) {
            console.log("9. 로그인되지 않음 && 공개페이지가 아님");
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("인증 오류:", error);
      }
      console.log("10. 인증 완료");
    });
    
  return (
    <div class="flex box-border relative flex-row w-full h-full" >
      <Sidebar isShow={hamberger} setHamberger={setHamberger} />
      <Show when={hamberger()}>
        <div class="fixed inset-0 w-full h-full bg-black opacity-50 z-125" onClick={() => setHamberger(false)}></div>
      </Show>
      <div class="flex flex-col w-full h-full ">
          <Header hamberger={hamberger} setHamberger={setHamberger} />
          {/* <Suspense fallback={<Loading />}> */}
            <div class="flex-1 w-full">
              
              {props.children}
            </div>
          {/* </Suspense> */}
          <Footer />
      </div>
    </div>
  );
}