import { RouteSectionProps } from "@solidjs/router";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import Sidebar from "~/components/layout/Sidebar";
import { createSignal } from "solid-js";
import { Show } from "solid-js/web";
import { Suspense } from "solid-js";
import Loading from "~/components/layout/Loading";
export default function Layout(props: RouteSectionProps) { 
    const [hamberger, setHamberger] = createSignal(false);
  return (
    <div class="flex relative flex-row w-full h-full" >
      <Sidebar isShow={hamberger} />
      <Show when={hamberger()}>
        <div class="fixed inset-0 w-full h-full bg-black opacity-50 z-4" onClick={() => setHamberger(false)}></div>
      </Show>
      <div class="flex flex-col w-full h-full ">
          <Header hamberger={hamberger} setHamberger={setHamberger} />
          {/* <Suspense fallback={<Loading />}> */}
            <div class="flex-1">
              {props.children}
            </div>
          {/* </Suspense> */}
          <Footer />
      </div>
    </div>
  );
}