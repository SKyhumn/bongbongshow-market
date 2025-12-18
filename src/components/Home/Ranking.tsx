import axios from "axios";
import Podium from "../Ranking/Podium";
import TheRest from "../Ranking/TheRest";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { RankingUser } from "../../types/RankingUser";


export default function Ranking(){
    const [ranking, setRanking]=useState<RankingUser[]>([]);

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
                console.log(ranking);
            } catch(err:any){
                nav("/sign-in",{ replace: true });
            }
        };
        fetchRanking();

        const interval = setInterval(fetchRanking, 5000);

        return () => clearInterval(interval);
    }, []);

    const podium=ranking.filter(user=>user.rank<=3);
    const theRest=ranking.filter(user=>user.rank>3);

    return(
        <div className="ranking">
            <Podium data={podium}/>
            <TheRest data={theRest}/>
        </div>
    );
}