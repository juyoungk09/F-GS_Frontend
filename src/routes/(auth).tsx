import { RouteSectionProps } from "@solidjs/router";
import { Suspense } from "solid-js";
import Loading from "~/components/layout/Loading";
import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";
export default function AuthLayout(props: RouteSectionProps) {
  const navigate = useNavigate();
  function getCookieClient(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(';').shift()!;
    return null;
  }
  onMount(() => {
    const token = getCookieClient("access_token");
      if (token) {
        // 이전 페이지 없으면 메인으로 이동
        console.log("이미 로그인 되어있습니다.");
        window.history.length > 1 ? navigate(-1) : navigate("/");
      }
    });
  return (
        <Suspense fallback={<Loading />}>
            {props.children}
        </Suspense>
  );
}