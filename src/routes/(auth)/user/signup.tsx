import { A, useHref, useNavigate } from "@solidjs/router";
import logo from "/logo.svg"
import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
const Signup = () => {
    const navigate = useNavigate()
    const [form,setForm] = createStore({
            emailInput: "",
            passwordInput : "",
            nameInput : "",
            schoolNumInput : "",
            introductionInput : "",
            emailEntered : true,
            passwordEntered : true,
            nameEntered : true,
            schoolNumEntered : true,
            introductionEntered : true
        })
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
    const handleSignUp= () => {
        setForm("emailEntered",form.emailInput.trim() !== "");
        setForm("passwordEntered",form.passwordInput.trim() !== "");
        setForm("nameEntered",form.nameInput.trim() !== "");
        setForm("schoolNumEntered",form.schoolNumInput.trim() !== "");
        setForm("introductionEntered",form.introductionInput.trim() !== "");
        if (form.emailEntered == true && form.passwordEntered == true && form.nameEntered == true && form.schoolNumEntered == true && form.introductionEntered == true
        ) navigate("/user/login");
        
    }
    return (
        <main class="bg-primary_color_4 w-auto h-auto text-white flex flex-col gap-0">
            <div class="m-8">
                <A href="/" class="text-2xl font-bold flex items-center text-white hover:text-primary_color_2 transition-colors">
                    <img src={logo} class="w-8 h-8" alt="logo" />
                    <span class="ml-2">F&GS</span>
                </A>
            </div>
            <div class="mb-25 w-auto h-auto flex justify-center ">
                <div class="bg-[#1F1F1F] px-25 h-auto flex flex-col justify-center items-center
                gap-9 stroke-[#686868] rounded-xl border-[#686868] border-1">
                    <div class="font-bold text-3xl mt-15">계정을 만들어 함께할 팀원을 찾아보세요!</div>
                    <div class="flex flex-col gap-7 mb-auto h-auto">
                        <InputBox
                                element = "이름"
                                inputVal={form.nameInput}
                                setinputVal={setForm}
                                feild = "nameInput"
                                isEntered = {form.nameEntered}
                                failmessage = "이 입력되지 않았습니다"/>
                        <InputBox
                                element = "학번"
                                inputVal={form.schoolNumInput}
                                setinputVal={setForm}
                                feild = "schoolNumInput"
                                isEntered = {form.schoolNumEntered}
                                failmessage = "이 입력되지 않았습니다"/>
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
                         <div class="flex flex-col gap-1">
                            <div class="font-wanted-sans font-medium">자기소개</div>
                            <textarea class="p-2 bg-[#2F2F2F] border-[#585858] border-2 rounded-md w-70 resize-none" rows={4} maxlength={2999}
                            value = {form.introductionInput} onInput={(e) => setForm("introductionInput",e.currentTarget.value)}></textarea>
                            {!form.passwordEntered && (<div class="font-medium text-red-700 text-xs leading-6">자기소개가 입력되지 않았습니다</div>)}
                        </div>
                        <div class="flex flex-col gap-1">
                            <div class="flex gap-2">
                                <div class="font-medium text-good_gray">포트폴리오</div>
                                <div class="font-medium text-red-700 text-xs leading-6">*선택</div>
                            </div>
                            <input class="p-1 bg-[#2F2F2F] border-[#585858] border-2 rounded-md w-70 resize-none h-8
                            text-[#9E9E9E]" type="file"></input>
                        </div>
                        <div class="flex flex-col gap-1">
                            <div class="flex gap-2">
                                <div class="font-medium text-good_gray">프로필 사진</div>
                                <div class="font-medium text-red-700 text-xs leading-6">*선택</div>
                            </div>
                            <input class="p-1 bg-[#2F2F2F] border-[#585858] border-2 rounded-md w-70 resize-none
                            h-8 text-[#9E9E9E]" type="file" accept=".jpg, .jpeg, .png, .webp"></input>
                        </div>
                        <div class="flex flex-col gap-4">
                            <button class="bg-primary_color_3 text-[#111327] w-70 h-8 rounded-md
                            hover:bg-primary_color_2/100 hover:text-[#111327]/50 transition-colors "
                            onclick={handleSignUp}>회원가입</button>
                            <div class="flex gap-1 mx-auto mb-10">
                                <span class="font-medium text-good_gray">계정이 이미 있나요?</span>
                                <A href="/user/login" class="hover:underline font-bold text-good_gray">로그인</A>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        )
    }
export default Signup;