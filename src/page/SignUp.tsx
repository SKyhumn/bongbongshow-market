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
    const [password, setPassword]=useState<string>('');

    const nav=useNavigate();

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
                <Verify value={email}/>
                <Password value={password} onChangeValue={(v)=>setPassword(v)}/>
                <button>회원가입</button>
            </form>
        </div>
    );
}