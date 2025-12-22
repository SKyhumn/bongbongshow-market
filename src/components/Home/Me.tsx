import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import type { User } from "../../types/User";
import { container } from "../../animation/Animation";
import { item } from "../../animation/Animation";
import { motion } from "framer-motion";

export default function Me(){
    const [user, setUser]=useState<User|null>(null);
    const [isLoading, setIsLoading]=useState<boolean>(true);
    const [error, setError]=useState<string|null>(null);

    // 내 정보 불러오기
    useEffect(()=>{
        const fetchMyInfo=async()=>{
            const token=localStorage.getItem("accessToken");
            try{
                const res=await axios.get(
                    "https://bongbong-market.shop/api/user/stats",
                    {
                        withCredentials:true,
                        headers:{
                            Authorization:`Bearer ${token}`,
                        }
                    }
                );
                setUser(res.data);
            } catch(err:any){
                setError('내 정보를 불러올 수 없어요...');
            } finally{
                setIsLoading(false);
            }
        }
        fetchMyInfo();

        const interval = setInterval(fetchMyInfo, 3000);

        return () => clearInterval(interval);
    },[]);


    // 로딩 중...
    if (isLoading) {
        return <div className="me">로딩 중...</div>;
    }

    // 로딩 실패
    if (error) {
        return <div className="me">{error}</div>;
    }

    return(
        <motion.div 
            className="me" 
            variants={container} 
            initial="hidden" 
            animate="show"
        >
            <motion.h1 variants={item}>내 전적</motion.h1>
            <div className="my-info">
                <motion.div 
                    className="changing-avatar" 
                    variants={item}
                >
                    <img src="/default-profile.jpeg" alt="profile"/>
                    <button className="blue-btn">프로필 사진 변경</button>
                </motion.div>

                <motion.div 
                    className="my-rank" 
                    variants={item}
                >
                    <h4>내 순위</h4>
                    <h1>{user?user?.rank:"-"}위</h1>
                </motion.div>
                
                <motion.div 
                    className="my-score" 
                    variants={item}
                >
                    <div className="win" key={user?.win}>
                        <h2>승</h2>
                        <h3>{user?user?.win:"-"}</h3>
                    </div>
                    <div className="lose" key={user?.lose}>
                        <h2>패</h2>
                        <h3>{user?user?.lose:"-"}</h3>
                    </div>
                    <div className="draw" key={user?.draw}>
                        <h2>무</h2>
                        <h3>{user?user?.draw:"-"}</h3>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}