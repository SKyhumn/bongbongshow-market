import { useNavigate } from "react-router-dom";

export default function Header(){
    const nav=useNavigate();

    const goSignInPage=()=>{
      nav('/sign-in');
    }

    return(
        <div id="header">
          <h1>RSPUR</h1>
          <p onClick={goSignInPage}>로그인</p>
        </div>
    );
}