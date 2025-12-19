import axios from "axios";
import Modal from "../Etc/Modal";
import SignOutModal from "../Etc/SignOutModal";
import WithDrawModal from "../Etc/WithdrawModal";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header(){
    const [modalMessage, setModalMessage]=useState<string>('');
    const [isModalOpen, setIsModalOpen]=useState<boolean>(false);
    const [isSignOutModalOpen, setIsSignOutModalOpen]=useState<boolean>(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen]=useState<boolean>(false);

    const nav=useNavigate();

    // 로그아웃 기능
    const handleSignOutModal=()=>{
      setIsSignOutModalOpen(true);
    }

    const handleSignOut=async()=>{
      setIsSignOutModalOpen(false);
      try{
        await axios.post("https://bongbong-market.shop/api/public/logout",
          {},
          {
            withCredentials:true
          }
        )
        nav('/sign-in');
      } catch(err:any){
        console.log(err);
        setIsModalOpen(true);
        setModalMessage("로그아웃에 실패했습니다.");
      }
    }

    //회원 탈퇴 기능
    const handleWithdrawModal=()=>{
      setIsWithdrawModalOpen(true);
    }

    const handleWithdraw=async()=>{
      setIsWithdrawModalOpen(false);
      const token = localStorage.getItem("accessToken");

      try{
        await axios.delete("https://bongbong-market.shop/api/user/delete",
          {
            withCredentials:true,
            headers:{
              Authorization:`Bearer ${token}`,
            }
          }
        );
        nav('/sign-in');
      } catch(err:any){
        console.log(err);
        setIsModalOpen(true);
        setModalMessage("회원 탈퇴에 실패했습니다.");
      }
    }

    return(
        <div id="header">
          <h1>BBShowRanking</h1>
          <div id="nav">
            <p onClick={handleSignOutModal}>로그아웃</p>
            <p onClick={handleWithdrawModal}>회원 탈퇴</p>
          </div>
          <Modal
            message={modalMessage}
            isOpen={isModalOpen}
            func={()=>setIsModalOpen(false)}
          />
          <SignOutModal
            isOpen={isSignOutModalOpen}
            yesFunc={handleSignOut}
            noFunc={()=>setIsSignOutModalOpen(false)}
          />
          <WithDrawModal
            isOpen={isWithdrawModalOpen}
            yesFunc={handleWithdraw}
            noFunc={()=>setIsWithdrawModalOpen(false)}
          />
        </div>
    );
}