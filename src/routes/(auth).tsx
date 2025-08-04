import { RouteSectionProps } from "@solidjs/router";
import { Suspense } from "solid-js";

export default function AuthLayout(props: RouteSectionProps) {
  return (
        <Suspense fallback={<div>Loading...</div>}>
            {props.children}
        </Suspense>
  );
}