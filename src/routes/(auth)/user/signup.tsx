import { A, useHref, useNavigate } from "@solidjs/router";
import logo from "/logo.svg"
import { createSignal } from "solid-js";
const Signup = () => {
    const navigate = useNavigate()
    const [emailInput,setEmailInput] = createSignal('');
    const [nicknameInput,setNicnameInput] = createSignal('');
    const [passwordInput,setPasswordInput] = createSignal('');
    const handleSignUp= () => {
        setEmailInput('');
        setNicnameInput('');
        setPasswordInput('');
        navigate("/user/login")
    }
    return (
        <main class="bg-primary_color_4 w-screen h-screen text-white flex flex-col gap-19">
            <div class="m-8">
                <A href="/" class="text-2xl font-bold flex items-center text-white hover:text-primary_color_2 transition-colors">
                    <img src={logo} class="w-8 h-8" alt="logo" />
                    <span class="ml-2">F&GS</span>
                </A>
            </div>
            <div class="w-full h-full flex justify-center">
                <div class="bg-[#1F1F1F] w-5/11 h-5/7 flex flex-col justify-center items-center gap-4 stroke-[#686868] rounded-xl border-[#686868] border-1">
                    <div class="flex flex-col gap-6">
                        <div class="flex flex-col gap-1">
                            <div class="font-medium text-good_gray">이메일</div>
                            <input class="p-2 bg-[#2F2F2F] border-[#585858] border-2 rounded-md w-70 h-8" type="text"
                            value={emailInput()} oninput={(e) => setEmailInput(e.currentTarget.value)}></input>
                        </div>
                        <div class="flex flex-col gap-1">
                            <div class="font-medium text-good_gray">닉네임</div>
                            <input class="p-2 bg-[#2F2F2F] border-[#585858] border-2 rounded-md w-70 h-8" type="text"
                            value={nicknameInput()} oninput={(e) => setNicnameInput(e.currentTarget.value)}></input>
                        </div>
                        <div class="flex flex-col gap-1">
                            <div class="font-medium text-good_gray">비밀번호</div>
                            <input class="p-2 bg-[#2F2F2F] border-[#585858] border-2 rounded-md w-70 h-8" type="text"
                            value={passwordInput()} oninput={(e) => setPasswordInput(e.currentTarget.value)}></input>
                        </div>
                        <button class="bg-primary_color_3 text-[#111327] w-70 h-8 rounded-md
                         hover:bg-primary_color_2/100 hover:text-[#111327]/50 transition-colors "
                        onclick={handleSignUp}>회원가입</button>
                    </div>
                    <div class="flex gap-1">
                        <span class="font-medium text-good_gray">계정이 이미 있나요?</span>
                        <A href="/user/login" class="hover:underline font-bold text-good_gray">로그인</A>
                    </div>
                </div>
            </div>
        </main>
        )
    }
export default Signup;