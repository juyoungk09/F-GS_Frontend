import { createStore } from "solid-js/store";

export interface User {
  id: number;
  name: string;
  email: string;
  profile_path: string;
}

const [user, setUser] = createStore<Partial<User>>({
  id: 0,
  name: "",
  email: "",
  profile_path: "",
});

const BASE_URL = "https://fg.sunrin.kr/api";

export { user, setUser, BASE_URL };