import { A, useHref, useNavigate } from "@solidjs/router";
import logo from "/logo.svg"
import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
const Login = () => {
    const InputBox = (props) => {
        return (
        <div class="flex flex-col gap-1">
            <div class="font-wanted-sans font-medium">{props.element}</div>
            <input class="inputbox" type="text"
            value={props.inputVal} onInput={(e) => props.setinputVal(props.feild,e.currentTarget.value)}></input>
            {!props.isEntered && (<div class="font-medium text-red-700 text-xs leading-6">{props.element}{props.failmessage}</div>)}
        </div>
        )
    }
    const [form,setForm] = createStore({
        emailInput: "",
        passwordInput : "",
        emailEntered : true,
        passwordEntered : true
    })
    const navigate = useNavigate()
    const handleLogin = () => {
        setForm("emailEntered",form.emailInput.trim() !== "")
        setForm("passwordEntered",form.passwordInput.trim() !== "")
        if (form.emailEntered == true && form.passwordEntered == true)
            navigate("/");
    }
    return (
        <main class="bg-primary_color_4 w-screen h-screen text-white flex flex-col gap-10">
            <div class="m-8">
                <A href="/" class="text-2xl font-bold flex items-center text-white hover:text-primary_color_2 transition-colors">
                    <img src={logo} class="w-8 h-8" alt="logo"/>
                    <span class="ml-2">F&GS</span>
                </A>
            </div>
            <div class="w-full h-full flex justify-center">
                <div class="bg-[#1F1F1F] px-50 h-6/7 flex flex-col gap-10 items-center stroke-[#686868] rounded-xl border-[#686868] border-1">
                    <div class="font-bold text-4xl mt-auto">F-GS에 로그인하기</div>
                    <div class="flex flex-col mb-auto gap-6">
                        <div class="flex flex-col gap-5">
                            <InputBox
                                element = "이메일"
                                inputVal={form.emailInput}
                                setinputVal={setForm}
                                feild = "emailInput"
                                isEntered = {form.emailEntered}
                                failmessage = "이 입력되지 않았습니다"/>
                            <InputBox
                                element = "비밀번호"
                                inputVal={form.passwordInput}
                                setinputVal={setForm}
                                feild = "passwordInput"
                                isEntered = {form.passwordEntered}
                                failmessage = "가 입력되지 않았습니다"/>
                        <button class="bg-primary_color_3 text-[#111327] w-70 h-8 rounded-md
                            hover:bg-primary_color_2/100 hover:text-[#111327]/50 transition-colors"
                            onclick={handleLogin}>로그인</button>
                        <div class="flex gap-1 mx-auto">
                            <span class="font-wanted-sans font-medium">계정이 필요한가요?</span>
                            <A href="/user/signup" class="font-wanted-sans hover:underline font-bold">회원가입</A>
                        </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Login;
