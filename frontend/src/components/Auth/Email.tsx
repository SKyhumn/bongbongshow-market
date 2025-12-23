import type { AuthProps } from "../../types/Auth/AuthProps";

export default function Email({value, onChangeValue}:AuthProps){

    return(
        <div className="email-box">
            <p>이메일</p>
            <input 
                type="text" 
                value={value} 
                onChange={(e)=>onChangeValue(e.target.value)}
            />
            <span>@gsm.hs.kr</span>
        </div>
    );
}