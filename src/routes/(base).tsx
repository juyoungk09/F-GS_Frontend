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
import { BASE_URL } from "~/stores/store";
export default function Layout(props: RouteSectionProps) { 
    const navigate = useNavigate();
    const location = useLocation();
    const [hamberger, setHamberger] = createSignal(false);
    createEffect(
      async() => {
         try {
            const response = await axios.get(`${BASE_URL}/users/private/me`, { withCredentials: true });
            const userData = response.data;
            console.log("5. 사용자 데이터 받음:", userData);
            setUser(userData);
          } catch (error) {
            console.error("사용자 데이터 가져오기 오류:", error);
          }
          const publicPaths = ["/", "/post/:id", "/search/post", "/search/user"];
          const isPublic = publicPaths.some(path => location.pathname.startsWith(path));
            if (!isPublic) {
            navigate("/login");
          }
        }
    );
    
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