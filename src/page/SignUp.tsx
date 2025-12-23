import axios from "axios";
import Name from "../components/Auth/Name";
import Email from "../components/Auth/Email";
import Password from "../components/Auth/Password";
import BackButton from "../components/Common/BackButton";
import Verify from "../components/Verify/Verify";
import Modal from "../components/Modals/Modal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SignUp } from "../types/Auth/SignUpType";

export default function SignUp(){
    const [name, setName]=useState<string>('');
    const [email, setEmail]=useState<string>('');
    const [verified, setVerified]=useState<boolean>(false);
    const [password, setPassword]=useState<string>('');
    const [isModalOpen, setIsModalOpen]=useState<boolean>(false);
    const [modalMessage, setModalMessage]=useState<string>('');
    const [successed, setSuccessed]=useState<boolean>(false);

    const isPasswordValid = (pw: string) => {
        // 최소 8자리, 영문자 + 숫자 포함
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(pw);
    }       

    const isAlright:boolean=
        name.trim()!==""&&
        verified&&
        password.trim()!=="";

    const nav=useNavigate();

    // 회원가입
    const handleSignUp=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setSuccessed(false);

        if(!isPasswordValid(password)){
            setIsModalOpen(true);
            setModalMessage("비밀번호는 8자리 이상, 영문자 숫자 모두 포함해야 합니다.");
            return;
        }

        const data:SignUp={
            "email":`${email}@gsm.hs.kr`,
            "password":password,
            "name":name
        }

        try{
            await axios.post("https://bongbong-market.shop/api/public/signup",
                data,
                {
                    withCredentials:true,
                    headers:{
                        "Content-Type":"application/json"
                    },
                }
            );
            setIsModalOpen(true);
            setModalMessage('회원 가입에 성공했습니다.');
            setSuccessed(true);
        } catch(err:any){
            setIsModalOpen(true);
            setModalMessage('회원 가입에 실패했습니다.');
            setSuccessed(false);
        }
    }

    // 성공 후 닫기 누르면 모달 닫히고 로그인 페이지로
    const success=()=>{
        setIsModalOpen(false);
        setModalMessage('');
        goSignInPage();
    }

    // 실패 후 닫기 누르면 모달만 닫힘
    const failed=()=>{
        setIsModalOpen(false);
        setModalMessage('');
    }

    // 로그인 페이지로
    const goSignInPage=()=>nav('/sign-in');

    return(
        <div className="sign-up-page">
            <BackButton onClick={goSignInPage}/>
            <form onSubmit={handleSignUp}>
                <h1>회원 가입</h1>
                <Name value={name} onChangeValue={(v)=>setName(v)}/>
                <Email value={email} onChangeValue={(v)=>setEmail(v)}/>
                <Verify value={email} onVerified={()=>setVerified(true)}/>
                <Password value={password} onChangeValue={(v)=>setPassword(v)}/>
                <button 
                    type="submit"
                    disabled={!isAlright} 
                    className={isAlright?"blue-btn":""}
                >
                    회원 가입
                </button>
            </form>
            <Modal
                message={modalMessage}
                isOpen={isModalOpen}
                func={successed?success:failed}
            />
        </div>
    );
}
