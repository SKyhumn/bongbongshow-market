import axios from "axios";
import Email from "../components/Email";
import Password from "../components/Password";
import BackButton from "../components/BackButton";
import Modal from "../components/Modal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SignIn } from "../types/SignInType";

export default function SignIn(){
    const [email, setEmail]=useState<string>('');
    const [password, setPassword]=useState<string>('');
    const [isModalOpen, setIsModalOpen]=useState<boolean>(false);
    const [message, setMessage]=useState<string>('');

    const isValid:boolean=email.trim()!==""&&password.trim()!=="";

    const nav=useNavigate();

    // 홈페이지로
    const goHomePage=()=>nav('/');

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
            nav('/');
        } catch(err:any){
            setMessage('로그인에 실패했습니다.');
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
                <button type="submit" className={isValid?"blue-btn":""}>
                    로그인
                </button>
                <button onClick={goSignUpPage}>회원가입</button>
                <p className="forgot-password">비밀번호를 잊으셨나요?</p>
            </form>
            <Modal 
                message={message} 
                isOpen={isModalOpen}
                onClose={()=>setIsModalOpen(false)}
            />
        </div>
    );
}