import type { Component } from "solid-js";
import { A } from "@solidjs/router";
const Header: Component = () => {
  return (
    <header class="sticky top-0 z-50 w-full bg-gray-800 text-white p-4 hover:">
      <div class="flex items-center">
        <img src="/F&GS.svg" alt="Logo" class="h-8 w-8 inline-block mr-2" />
        <h1 class="text-xl font-bold">F&GS</h1>
      </div>
      <nav class="mt-2">
        <ul class="flex overflow-hidden space-x-4">
          <li><A href="/" class="text-white hover:text-gray-300">Home</A></li>
          <li><A href="/chat" class="text-white hover:text-gray-300">Chat</A></li>
          <li><A href="/create-post" class="text-white hover:text-gray-300">Create-Post</A></li>
          <li><A href="/login" class="text-white hover:text-gray-300">Login</A></li>
          <li><A href="/signup" class="text-white hover:text-gray-300">Signup</A></li>
          <li><A href="/post/:Minkiiscrazyyyyyyyyyyy" class="text-white hover:text-gray-300">Post</A></li>
          <li><A href="*" class="text-white hover:text-gray-300">404</A></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
