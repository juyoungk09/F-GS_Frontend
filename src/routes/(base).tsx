import { RouteSectionProps } from "@solidjs/router";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Sidebar from "~/components/Sidebar";


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