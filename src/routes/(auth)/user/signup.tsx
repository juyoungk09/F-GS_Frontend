import { A, useHref, useNavigate } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import axios from "axios";
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
            passwordCondition : true,
            nameEntered : true,
            schoolNumEntered : true,
            introductionEntered : true,
            portfolio: null as File | null,
            profile: null as File | null
        })
    const InputBox = (props : any) => {
        return (
        <div class="flex flex-col gap-1">
            <div class="font-medium text-good_gray">{props.element}</div>
            <input class="inputbox" type={props.element === "비밀번호" ? "password" : "text"} spellcheck="false"
            value={props.inputVal} onInput={(e) => props.setinputVal(props.feild,e.currentTarget.value)}></input>
            <Show when={props.element == "비밀번호" && form.passwordEntered && form.passwordCondition == false}>
                <div class="font-medium text-red-700 text-xs leading-6">영어, 숫자, 특수문자 조합으로 8자 이상이어야 합니다</div>
            </Show>
            {!props.isEntered && (<div class="font-medium text-red-700 text-xs leading-6">{props.element}{props.failmessage}</div>)}
        </div>
        )
    }
    const handleSignUp= () => {
        console.log("ㄹㄷ")
        setForm("passwordCondition",true)
        setForm("emailEntered",form.emailInput.trim() !== "");
        setForm("passwordEntered",form.passwordInput.trim() !== "");
        setForm("passwordCondition",/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#.~_-])[A-Za-z\d@$!%*?&#.~_-]{8,}$/.test(form.passwordInput))
        setForm("nameEntered",form.nameInput.trim() !== "");
        setForm("schoolNumEntered",form.schoolNumInput.trim() !== "");
        setForm("introductionEntered",form.introductionInput.trim() !== "");
        if (form.emailEntered == true && form.passwordEntered == true && form.nameEntered == true && form.schoolNumEntered == true && form.introductionEntered == true){
            const formdata = new FormData();
            const url = "https://fg.sunrin.kr"
            formdata.append("name",form.nameInput)
            formdata.append("student_id",form.schoolNumInput)
            formdata.append("email",form.emailInput)
            formdata.append("self_introduction",form.introductionInput)
            formdata.append("password",form.passwordInput)
            formdata.append("portfolio",form.portfolio ?? "")
            formdata.append("profile",form.profile ?? "")
            axios.post(`${url}/api/users`,formdata)
            .then(res=>{
                console.log("회원가입 성공!",res.data)
                navigate("/user/login");
            })
            .catch(err=>{
                alert("에러")
                console.log("실패",err.response.data,form.emailInput)
                })   
                }
            }

    return (
        <main class="bg-primary_color_4  min-h-screen text-white flex flex-col gap-0">
            <div class="m-8">
                <A href="/" class="text-2xl font-bold flex items-center text-white hover:text-primary_color_2 transition-colors">
                    <img src="logo.svg" class="w-8 h-8" alt="logo" />
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
                                failmessage = "가 입력되지 않았습니다">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                                        <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
                                        <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
                                        </svg>
                                </InputBox>
                         <div class="flex flex-col gap-1">
                            <div class="font-wanted-sans font-medium">자기소개</div>
                            <textarea class="p-2 bg-[#2F2F2F] border-[#585858] border-2 rounded-md w-70 resize-none" rows={4}
                            maxlength={2999} value = {form.introductionInput} onInput={(e) => setForm("introductionInput",e.currentTarget.value)}></textarea>
                            {!form.introductionEntered && (<div class="font-medium text-red-700 text-xs leading-6">자기소개가 입력되지 않았습니다</div>)}
                        </div>
                        <div class="flex flex-col gap-1">
                            <div class="flex gap-2">
                                <div class="font-medium text-good_gray">포트폴리오</div>
                                <div class="font-medium text-red-700 text-xs leading-6">*선택</div>
                            </div>
                            <input class="p-1 bg-[#2F2F2F] border-[#585858] border-2 rounded-md w-70 resize-none h-8
                            text-[#9E9E9E]" type="file" onChange={(e)=>{
                                setForm("portfolio",e.target.files?.[0] ?? null)
                            }}></input>
                        </div>
                        <div class="flex flex-col gap-1">
                            <div class="flex gap-2">
                                <div class="font-medium text-good_gray">프로필 사진</div>
                                <div class="font-medium text-red-700 text-xs leading-6">*선택</div>
                            </div>
                            <input class="p-1 bg-[#2F2F2F] border-[#585858] border-2 rounded-md w-70 resize-none
                            h-8 text-[#9E9E9E]" type="file" accept=".jpg, .jpeg, .png, .webp"
                            onChange={(e)=>{
                                setForm("profile",e.target.files?.[0] ?? null)
                            }}></input>
                        </div>
                        <div class="flex flex-col gap-4">
                            <button class="bg-primary_color_3 text-[#111327] w-70 h-8 rounded-md
                            hover:bg-primary_color_2/100 hover:text-[#111327]/50 transition-colors "
                            onClick={handleSignUp}>회원가입</button>
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