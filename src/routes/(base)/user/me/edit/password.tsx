import { useNavigate } from "@solidjs/router"
import axios from "axios"
import { createSignal } from "solid-js"

const Edit_Password = () => {
    const url = "https://fg.sunrin.kr"
    const [currentPassword,setCurrentPassword] = createSignal('')
    const [newPassword,setNewPassword] = createSignal('')
    const navigate = useNavigate()
    function handlePasswordChange(){
        const password = {
            new_password: newPassword(),
            old_password: currentPassword()
        }
        axios.put(`${url}/api/users/private/password`,password,{
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
        })
        .then((res) => {
            console.log("비번 변경 성공!")
            navigate("/user/me/edit")
        })
        .catch((err) => {
            alert("비번 변경 실패")
            console.log("비번 변경 실패",err)
        })
    }
    return(
        <main class="min-h-screen flex flex-col gap-10 items-center justify-center">
                <div class="px-50 flex flex-col gap-10">
                    <div class="flex flex-col mb-auto gap-6 items-center">
                        <div class="flex flex-col gap-10 items-center">
                            <div class="flex flex-col gap-3">
                                <div class="text-lg font-bold text-black">현재 비밀번호</div>
                                <input class="flex-none bg-[#FCFBFC] text-xl rounded-xl px-4 w-100 h-12" type="password"
                                onInput={(e) => setCurrentPassword(e.target.value)}>
                                </input>
                            </div>
                            <div class="flex flex-col gap-3">
                                <div class="text-lg font-bold text-black">새로운 비밀번호</div>
                                <input class="flex-none bg-[#FCFBFC] text-xl rounded-xl px-4 w-100 h-12" type="password"
                                onInput={(e) => setNewPassword(e.target.value)}>
                                </input>
                            </div>
                            <div class="flex flex-col gap-5 items-center">
                                <button class="bg-primary_color_3 text-[#111327] w-70 h-10 rounded-lg
                                hover:bg-primary_color_2/100 hover:text-[#111327]/50 transition-colors" onClick={handlePasswordChange}
                                >비밀번호 변경</button>
                                <button class="w-40 bg-red-700 text-white p-2 rounded-xl hover:bg-red-400 transition-colors"
                                onClick={() => navigate("/user/me/edit")}>취소</button>

                            </div>
                        </div>
                    </div>
                </div>
        </main>
    )
}

export default Edit_Password