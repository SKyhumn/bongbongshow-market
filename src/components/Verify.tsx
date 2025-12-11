import axios from "axios";
import { useState } from "react";

export default function Verify({value}:{value:string}){
    const [isGsmEmail, setIsGsmEmail]=useState<boolean|null>(null);
    const [code, setCode]=useState<string>('');

    const isEmailFulled:boolean=value.trim()!=="";

    // 코드 받기 
    const receiveCode=async(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        setIsGsmEmail(null);

        const isNumber=/^\d{4}$/.test(value.slice(1,5));
        const isValidGsm=value.charAt(0)==="s"&&value.length===6&&isNumber

        if(!isValidGsm){
            setIsGsmEmail(false);
            return
        }
        
        const data={
            "email":`${value}@gsm.hs.kr`
        }

        try{
            const res=await axios.post("https://bongbong-market.shop/api/public/send-code",data,{
                headers:{
                    "Content-Type":"application/json",
                },
                withCredentials:true
            })
            console.log(res.data);
            console.log("인증코드 전송");
            setIsGsmEmail(true);
        } catch(err:any){
            console.log(err);
            setIsGsmEmail(false);
        }
    }

    // 인증하기
    const handleVerify=async(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();

        const data={
            "email":`${value}@gsm.hs.kr`,
            "code":code
        }

        try{
            const res=await axios.post("https://bongbong-market.shop/api/public/verify-code",data,{
                headers:{
                    "Content-Type":"application/json"
                },
                withCredentials:true
            })
            console.log(res.data);
            console.log("인증 성공")
        } catch(err:any){
            console.log(err);
            setIsGsmEmail(false);
        }
    }
    return(
        <div className="verifying-box">
            <button
                onClick={receiveCode} 
                disabled={isEmailFulled?false:true}
                className={isEmailFulled?"blue-btn":""} 
            >
                인증번호 보내기
            </button>
            {isGsmEmail!==null&&(
                <div>
                    <p className={isGsmEmail?"grey-text":"red-text"}>
                        {isGsmEmail?"인증번호를 전송했습니다":"다시 입력해주세요."}
                    </p>
                    {isGsmEmail?(
                    <div>
                        <input
                            type="text"
                            value={code}
                            placeholder="6자리 입력"
                            onChange={(e)=>setCode(e.target.value)}
                            className="verifying-input"
                        />
                        <button onClick={handleVerify} className="verifying-btn">인증하기</button>
                    </div>):""}
                </div>
            )}
        </div>
    );
}