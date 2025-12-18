import Header from "../components/Home/Header";
import Me from "../components/Home/Me";
import Ranking from "../components/Home/Ranking";
import Modal from "../components/Etc/Modal";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function Home(){
    const loc=useLocation();
    const [isModalOpen, setIsModalOpen]=useState<boolean>(false);
    const [modalMessage, setModalMessage]=useState<string>('');

    // 모달 보이기 및 메세지 띄우기
    useEffect(()=>{
        if(loc.state?.loginSuccess){
            setModalMessage('로그인에 성공했습니다.');
            setIsModalOpen(true);
        }
    },[loc.state]);

    return( 
        <div className="home-page">
            <Header/>
            <div id="content">
                <div className="box1">
                    <Me/>
                </div>
                <div className="box2">
                    <h1 className="ranking-title">랭킹</h1>
                    <Ranking/>
                </div>
            </div>
            <Modal
                message={modalMessage}
                isOpen={isModalOpen}
                func={()=>setIsModalOpen(false)}
            />
        </div>
    );
}