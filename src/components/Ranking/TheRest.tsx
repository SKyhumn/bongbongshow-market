import type { RankingUser } from "../../types/RankingUser";
import { motion } from "framer-motion";
import { item } from "../../animation/Animation";

interface TheRestProps {
    data:RankingUser[];
}

export default function TheRest({data}:TheRestProps){
    return(
        <motion.div 
            className="the-rest" 
            variants={item} 
            initial="hidden"
            animate="show"
        >
            {data.map(dt=>{
                const profileSrc =
                    dt.profileImage && dt.profileImage.trim() !== ""
                    ? dt.profileImage
                    : "/default-profile.jpeg";

                return(
                    <div className="rank-item" key={dt.rank}>
                        <div className="user">
                            <h2>{dt.rank}위</h2>
                            <img 
                                src={profileSrc}
                                alt={`${dt.name} profile`}
                            />
                            <h2>{dt.name}</h2>
                        </div>
                        <h4>{dt.winCount}승</h4>
                    </div>
                )
            })}
        </motion.div>
    );
}