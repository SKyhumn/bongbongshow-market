import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header(){
    const [isModalOpen, setIsModalOpen]=useState<boolean>(false);
    const [modalMessage, setModalMessage]=useState<string>('');

    const nav=useNavigate();

    const handleSignOut=async()=>{
      try{
        const res=await axios.post("https://bongbong-market.shop/api/public/logout",
          {},
          {
            withCredentials:true
          }
        );
        nav('/sign-in');
      } catch(err:any){
        console.log(err);

      }
    }

    return(
        <div id="header">
          <h1>BBShowRanking</h1>
          <p onClick={handleSignOut}>로그아웃</p>
        </div>
    );
}