import axios from "axios";
import Email from "../components/Auth/Email";
import Password from "../components/Auth/Password";
import VerifyToResetPassword from "../components/Verify/VerifyToResetPassword";
import Modal from "../components/Modals/Modal";
import BackButton from "../components/Common/BackButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ResetPasswordType } from "../types/Auth/ResetPasswordType";

export default function VerifyCodeForReseting(){
    const [email, setEmail]=useState<string>('');
    const [password, setPassword]=useState<string>('');
    const [verified, setVerified]=useState<boolean>(false);
    const [isModalOpen, setIsModalOpen]=useState<boolean>(false);
    const [modalMessage, setModalMessage]=useState<string>('');
    const [successed, setSuccessed]=useState<boolean>(false);

    const nav=useNavigate();

    let isPasswordTypedIn:boolean=password.trim()!=="";

    // 로그인 페이지로
    const goSignInPage=()=>nav('/sign-in');

    // 비밀번호 바꾸기
    const handleResetPassword=async(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();

        const isPasswordValid:boolean=/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password);

        if(!isPasswordValid){
            setModalMessage("비밀번호는 8자리 이상, 영문자 숫자 모두 포함해야 합니다.");
            setIsModalOpen(true);
            return;
        }

        const data:ResetPasswordType={
            "email":`${email}@gsm.hs.kr`,
            "newPassword":password
        }

        try{
            await axios.post(
                "https://bongbong-market.shop/api/public/reset-password",
                data,
                {
                    withCredentials:true,
                    headers:{
                        "Content-Type":"application/json",
                    },
                }
            );
            setModalMessage("비밀번호 재설정에 성공했습니다.");
            setIsModalOpen(true);
            setSuccessed(true);
        } catch(err:any){
            setModalMessage("비밀번호 재설정에 실패했습니다.");
            setIsModalOpen(true);
            setSuccessed(false);
        }
    }

    const success=()=>{
        setIsModalOpen(false);
        nav('/sign-in');
    }
    
    const failed=()=>{
        setIsModalOpen(false);
    }

    return(
        <div className="reset-password">
            <BackButton onClick={goSignInPage}/>
            <form>
                <h1>이메일 인증하기</h1>
                <Email value={email} onChangeValue={(v)=>setEmail(v)}/>
                <VerifyToResetPassword value={email} onVerified={()=>setVerified(true)}/>
                {verified&&(
                    <>
                        <Password value={password} onChangeValue={(v)=>setPassword(v)}/>
                        <button 
                            onClick={handleResetPassword}
                            disabled={!isPasswordTypedIn} 
                            className={isPasswordTypedIn?"blue-btn":""}
                        >
                            확인
                        </button>
                    </>
                )}
                <Modal
                    message={modalMessage}
                    isOpen={isModalOpen}
                    func={successed?success:failed}
                />
            </form>
        </div>
    );
}