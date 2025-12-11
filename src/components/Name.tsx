import type { AuthProps } from "../types/AuthProps";

export default function Name({value, onChangeValue}:AuthProps){
    return(
        <div className="name-box">
            <p>이름</p>
            <input 
                type="text" 
                value={value} 
                onChange={(e)=>onChangeValue(e.target.value)}
            />
        </div>
    );
}