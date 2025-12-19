import axios from "axios";
import Modal from "../Etc/Modal";
import { useState } from "react";
import type { VerifyProps } from "../../types/VerifyProps";

export default function Verify({value, onVerified}:VerifyProps){
    const [isGsmEmail, setIsGsmEmail]=useState<boolean|null>(null);
    const [code, setCode]=useState<string>('');
    const [verified, setVerified]=useState<boolean>(false);
    const [isModalOpen, setIsModalOpen]=useState<boolean>(false);
    const [modalMessage, setModalMessage]=useState<string>('');

    const isEmailFulled:boolean=value.trim()!=="";

    // 코드 받기 
    const receiveCode=async(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        setIsGsmEmail(null);

        const isNumber = /^\d{4}$/.test(value.slice(1,5));
        const isValidGsm =
            value.charAt(0) === "s" &&
            value.length === 6 &&
            isNumber;

        if(!isValidGsm){
            setIsGsmEmail(false);
            setIsModalOpen(true);
            setModalMessage('이메일을 다시 입력해주세요.');
            return;
        }
        
        const data={
            "email":`${value}@gsm.hs.kr`
        }

        try{
            await axios.post("https://bongbong-market.shop/api/public/send-code",
                data,
                {
                    headers:{
                        "Content-Type":"application/json",
                    }
                }
            );
            setIsGsmEmail(true);
        } catch(err:any){
            setIsGsmEmail(false);
            setIsModalOpen(true);
            setModalMessage('이메일을 다시 입력해주세요.');
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
            await axios.post("https://bongbong-market.shop/api/public/verify-code",
                data,
                {
                    withCredentials:true,
                    headers:{
                        "Content-Type":"application/json"
                    }
                }
            )
            onVerified();
            verifiedTrue();
            setIsModalOpen(true);
            setModalMessage('인증이 완료되었습니다.');
        } catch(err:any){
            setCode('');
            setIsGsmEmail(false);
            setIsModalOpen(true);
            setModalMessage('인증에 실패했습니다.');
        }
    }

    const verifiedTrue=()=>{
        setVerified(true);
        setIsGsmEmail(true);
    }
    return(
        <div className="verifying-box">
            <button
                onClick={receiveCode} 
                disabled={!isEmailFulled||verified}
                className={isEmailFulled?"blue-btn":""} 
            >
                인증번호 보내기
            </button>
            {isGsmEmail!==null&&(
                <div>
                    {isGsmEmail===true&&(
                        <div>
                            <p className="grey-text">인증번호를 전송했습니다</p>
                            <input
                                type="text"
                                value={code}
                                placeholder="6자리 입력"
                                onChange={(e)=>setCode(e.target.value)}
                                className="verifying-input"
                            />
                            <button 
                                onClick={handleVerify} 
                                disabled={verified} 
                                className="verifying-btn"
                            >
                                인증하기
                            </button>
                        </div>
                    )}
                </div>
            )}
            {verified&&<p className="grey-text">인증이 완료됐습니다.</p>}
            <Modal 
                message={modalMessage} 
                isOpen={isModalOpen} 
                func={()=>setIsModalOpen(false)}
            />
        </div>
    );
}