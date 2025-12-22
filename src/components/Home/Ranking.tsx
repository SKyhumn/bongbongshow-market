import axios from "axios";
import Podium from "../Ranking/Podium";
import TheRest from "../Ranking/TheRest";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { RankingUser } from "../../types/RankingUser";
import { motion } from "framer-motion";
import { container } from "../../animation/Animation";


export default function Ranking(){
    const [ranking, setRanking]=useState<RankingUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const nav=useNavigate();

    useEffect(()=>{
        const fetchRanking=async()=>{
            const token = localStorage.getItem("accessToken");

            if (!token) {
                nav("/sign-in", { replace: true });
                return;
            }

            try{
                const res=await axios.get(
                    "https://bongbong-market.shop/api/user/ranking/all",
                    {
                        withCredentials:true,
                        headers:{
                            Authorization:`Bearer ${token}`,
                        },
                    }
                );
                setRanking(res.data);
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

    if(isLoading){
        return(
            <div className="ranking">로딩 중...</div>
        );
    }

    const podium=ranking.filter(user=>user.rank<=3);
    const theRest=ranking.filter(user=>user.rank>3);

    return(
        <motion.div 
            className="ranking" 
            variants={container} 
            initial="hidden" 
            animate="show"
        >
            <Podium data={podium}/>
            <TheRest data={theRest}/>
        </motion.div>
    );
}