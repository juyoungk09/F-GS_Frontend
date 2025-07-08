import type { Component, JSX } from "solid-js";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MainLayout: Component<{ children?: JSX.Element | JSX.Element[] }> = (props) => {
  return (
    <div class="relative flex flex-col min-h-screen">
      <Header />
      <main class="min-h-screen">{props.children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
