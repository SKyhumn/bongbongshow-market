import type { AuthProps } from "../../types/Auth/AuthProps";
import { useState } from "react";

export default function Password({value, onChangeValue}:AuthProps){
    const [visibility, setVisibility]=useState<boolean>(false);

    const handleVisibility=()=>{
        setVisibility(!visibility);
    }

    return(
        <div className="password-box">
            <p>비밀번호</p>
            <input 
                type={visibility?"text":"password"} 
                value={value} 
                placeholder="영문자 숫자 조합, 8자리 이상"
                onChange={(e)=>onChangeValue(e.target.value)}
            />
            <span>
                <img 
                    src={visibility?"no-show.svg":"show.svg"} 
                    onClick={handleVisibility}
                />
            </span>
        </div>
    );
}