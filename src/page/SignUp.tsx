import axios from "axios";
import Name from "../components/Name";
import Email from "../components/Email";
import Password from "../components/Password";
import BackButton from "../components/BackButton";
import Verify from "../components/Verify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp(){
    const [name, setName]=useState<string>('');
    const [email, setEmail]=useState<string>('');
    const [verified, setVerified]=useState<boolean>(false);
    const [password, setPassword]=useState<string>('');

    const isAlright=name.trim()!==""&&verified&&password.trim()!=="";

    const nav=useNavigate();

    const handleSignUp=async(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();

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
        } catch(err:any){

        }
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
        </div>
    );
}