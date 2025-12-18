import axios from "axios";
import Email from "../components/Authentication/Email";
import Password from "../components/Authentication/Password";
import BackButton from "../components/Etc/BackButton";
import Modal from "../components/Etc/Modal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SignIn } from "../types/SignInType";

export default function SignIn(){
    const [email, setEmail]=useState<string>('');
    const [password, setPassword]=useState<string>('');
    const [isModalOpen, setIsModalOpen]=useState<boolean>(false);
    const [modalMessage, setModalMessage]=useState<string>('');

    const isValid:boolean=email.trim()!==""&&password.trim()!=="";

    const nav=useNavigate();

    // 홈페이지로
    const goHomePage=()=>nav('/home');

    // 회원가입 페이지로
    const goSignUpPage=()=>nav('/sign-up');

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
            console.log(res.data);
            localStorage.setItem("accessToken",res.data.accessToken);
            console.log(res.data.accessToken);
            // 홈페이지로 로그인 성공 보내기
            nav('/home',{state:{loginSuccess:true}});
        } catch(err:any){
            setModalMessage('로그인에 실패했습니다.');
            setIsModalOpen(true);
            console.log(err);
        }
    }

    return(
        <div className="sign-in-page">
            <BackButton onClick={goHomePage}/>
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
                <button onClick={goSignUpPage}>회원가입</button>
                <p className="forgot-password">비밀번호를 잊으셨나요?</p>
            </form>
            <Modal 
                message={modalMessage} 
                isOpen={isModalOpen}
                func={()=>setIsModalOpen(false)}
            />
        </div>
    );
}