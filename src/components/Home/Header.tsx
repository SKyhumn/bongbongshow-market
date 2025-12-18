import { useNavigate } from "react-router-dom";

export default function Header(){
    const nav=useNavigate();


    return(
        <div id="header">
          <h1>BBShowRanking</h1>
          <p>로그아웃</p>
        </div>
    );
}