import { RouteSectionProps } from "@solidjs/router";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import Sidebar from "~/components/layout/Sidebar";


export default function Layout(props: RouteSectionProps) {
  return (
    <div class="bg-gray-100 flex flex-col min-h-screen">
        <Header />
        <Sidebar />
        <div class="flex-1">
          {props.children}
        </div>
        <Footer />
    </div>
  );
}