import axios from "axios";
import Name from "../components/Name";
import Email from "../components/Email";
import Password from "../components/Password";
import BackButton from "../components/BackButton";
import Verify from "../components/Verify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

export default function SignUp(){
    const [name, setName]=useState<string>('');
    const [email, setEmail]=useState<string>('');
    const [verified, setVerified]=useState<boolean>(false);
    const [password, setPassword]=useState<string>('');
    const [isModalOpen, setIsModalOpen]=useState<boolean>(false);
    const [modalMessage, setModalMessage]=useState<string>('');
    const [successed, setSuccessed]=useState<boolean>(false);

    const isAlright=name.trim()!==""&&verified&&password.trim()!=="";

    const nav=useNavigate();

    // 회원가입
    const handleSignUp=async(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        setSuccessed(false);

        const data={
            "email":`${email}@gsm.hs.kr`,
            "password":password,
            "name":name
        }

        try{
            const res=await axios.post("https://bongbong-market.shop/api/public/signup",
                data,
                {
                    withCredentials:true,
                    headers:{
                        "Content-Type":"application/json"
                    },
                }
            );
            console.log(res.data);
            console.log("회원가입 성공");
            setIsModalOpen(true);
            setModalMessage('회원가입에 성공했습니다.');
            setSuccessed(true);
        } catch(err:any){
            setIsModalOpen(true);
            setModalMessage('회원가입에 실패했습니다.');
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
    const goSignInPage=()=>{
        nav('/sign-in')
    }

    return(
        <div className="sign-up-page">
            <BackButton onClick={goSignInPage}/>
            <form>
                <h1>회원가입</h1>
                <Name value={name} onChangeValue={(v)=>setName(v)}/>
                <Email value={email} onChangeValue={(v)=>setEmail(v)}/>
                <Verify value={email} onVerified={()=>setVerified(true)}/>
                <Password value={password} onChangeValue={(v)=>setPassword(v)}/>
                <button 
                    type="submit"
                    onClick={handleSignUp}
                    disabled={!isAlright} 
                    className={isAlright?"blue-btn":""}
                >
                    회원가입
                </button>
            </form>
            <Modal
                message={modalMessage}
                isOpen={isModalOpen}
                func={successed==true?success:failed}
            />
        </div>
    );
}