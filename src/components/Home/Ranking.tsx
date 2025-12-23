import axios from "axios";
import Podium from "../Ranking/Podium";
import Top7 from "../Ranking/Top7";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { RankingUser } from "../../types/User/RankingUser";
import { motion } from "framer-motion";
import { container } from "../../animation/Animation";
import RankingModal from "../Modals/RankingModal";


export default function Ranking(){
    const [ranking, setRanking]=useState<RankingUser[]>([]);
    const [isLoading, setIsLoading]=useState(true);
    const [isModalOpen, setIsModalOpen]=useState<boolean>(false);

    const nav=useNavigate();

    // Ranking데이터 호출
    useEffect(()=>{
        const fetchRanking=async()=>{
            const token = localStorage.getItem("accessToken");

            if (!token) {
                nav("/sign-in", { replace: true });
                return;
            }

            try{
                const res=await axios.get(
                    "https://bongbong-market.shop/api/user/ranking",
                    {
                        withCredentials:true,
                        headers:{
                            Authorization:`Bearer ${token}`,
                        },
                    }
                );
                const sortedRanking=res.data.sort(
                    (a:RankingUser,b:RankingUser)=>a.rank-b.rank
                );
                setRanking(sortedRanking);
            } catch(err:any){
                nav("/sign-in",{ replace: true });
            } finally{
                setIsLoading(false);
            }
        };
        fetchRanking();

        const interval = setInterval(fetchRanking, 5000);

        return () => clearInterval(interval);
    }, []);


    // 로딩 중...
    if(isLoading){
        return(
            <div className="ranking">로딩 중...</div>
        );
    }

    const podium=ranking.slice(0,3);
    const top7=ranking.slice(3,10);

    const handleRankingModal=()=>{
        setIsModalOpen(true);
    }

    return(
        <motion.div 
            className="ranking" 
            variants={container} 
            initial="hidden" 
            animate="show"
        >
            <h1 className="ranking-title">랭킹 상위 10명</h1>
            <Podium data={podium}/>
            <Top7 data={top7}/>
            <button 
                onClick={handleRankingModal} 
                className="blue-btn"
            >
                랭킹 전체 보기
            </button>
            <RankingModal
                isOpen={isModalOpen}
                func={()=>setIsModalOpen(false)}
            />
        </motion.div>
    );
}