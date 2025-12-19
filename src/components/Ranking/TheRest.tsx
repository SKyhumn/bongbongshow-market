import type { RankingUser } from "../../types/RankingUser";

interface TheRestProps {
    data:RankingUser[];
}

export default function TheRest({data}:TheRestProps){
    return(
        <div className="the-rest">
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
                                alt={`${dt.name} 프로필`}
                            />
                            <h2>{dt.name}</h2>
                        </div>
                        <h4>{dt.winCount}승</h4>
                    </div>
                )
            })}
        </div>
    );
}