import axios from "axios";
import Email from "../components/Auth/Email";
import Password from "../components/Auth/Password";
import Modal from "../components/Modals/Modal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SignIn } from "../types/Auth/SignInType";

export default function SignIn(){
    const [email, setEmail]=useState<string>('');
    const [password, setPassword]=useState<string>('');
    const [isModalOpen, setIsModalOpen]=useState<boolean>(false);
    const [modalMessage, setModalMessage]=useState<string>('');
    const [modalFunc, setModalFunc]=useState<()=>void>(()=>{});

    const isValid:boolean=email.trim()!==""&&password.trim()!=="";

    const nav=useNavigate();

    // 회원가입 페이지로
    const goSignUpPage=()=>nav('/sign-up');

    // 재설정용 이메일 인증 페이지로
    const goVerifyToReset=()=>nav('/reset-password');

    // 로그인 확인
    const handleSignIn=async(e:React.FormEvent)=>{
        e.preventDefault();

        const data:SignIn={
            "email":`${email}@gsm.hs.kr`,
            "password":password
        };

        try{
            const res=await axios.post(
                "https://bongbong-market.shop/api/public/signin",
                data,
                {
                    withCredentials:true,
                    headers:{
                        "Content-Type":"application/json",
                    },
                }
            );
            localStorage.setItem("accessToken",res.data.accessToken);
            setModalMessage("로그인에 성공했습니다.");
            setModalFunc(() => {
                return () => {
                    setIsModalOpen(false);
                    nav('/home'); // 모달 닫으면 홈으로 이동
                };
            });
            setIsModalOpen(true);
        } catch(err:any){
            setModalMessage('로그인에 실패했습니다.');
            setIsModalOpen(true);
            setModalFunc(() => () => setIsModalOpen(false)); // 모달 닫기만
        }
    }

    return(
        <div className="sign-in-page">
            <form onSubmit={handleSignIn}>
                <h1>로그인</h1>
                <Email value={email} onChangeValue={(v)=>setEmail(v)}/>
                <Password value={password} onChangeValue={(v)=>setPassword(v)}/>
                <button 
                    type="submit" 
                    disabled={!isValid} 
                    className={isValid?"blue-btn":""}
                >
                    로그인
                </button>
                <button onClick={goSignUpPage}>회원 가입</button>
                <p 
                    onClick={goVerifyToReset} 
                    className="forgot-password"
                >
                    비밀번호를 잊으셨나요?
                </p>
            </form>
            <Modal 
                message={modalMessage} 
                isOpen={isModalOpen}
                func={modalFunc}
            />
        </div>
    );
}