import type { RankingUser } from "../../types/RankingUser";

interface PodiumProps {
    data:RankingUser[];
}

const profileSrc=(img?:string)=>
    img && img.trim() !== "" ? img : "/default-profile.jpeg";

export default function Podium({data}:PodiumProps){
    const first:RankingUser|undefined=data.find(u=>u.rank===1);
    const second:RankingUser|undefined=data.find(u=>u.rank===2);
    const third:RankingUser|undefined=data.find(u=>u.rank===3);

    return(
        <div className="podium">
            <div className="second">
                <img 
                    src={second&&profileSrc(second.profileImage)} 
                    className="avatar"
                />
                <h3>{second&&second.name}</h3>
                <h4>{second&&second.winCount}승</h4>
                <div className="podium-item">
                    <h2>2위</h2>
                </div>
            </div>

            <div className="first">
                <img 
                    src={first&&profileSrc(first.profileImage)} 
                    className="avatar"
                />
                <h3>{first&&first.name}</h3>
                <h4>{first&&first.winCount}승</h4>
                <div className="podium-item">
                    <h2>1위</h2>
                </div>
            </div>

            <div className="third">
                <img 
                    src={third&&profileSrc(third&&third.profileImage)} 
                    className="avatar"
                />
                <h3>{third&&third.name}</h3>
                <h4>{third&&third.winCount}승</h4>
                <div className="podium-item">
                    <h2>3위</h2>
                </div>
            </div>
        </div>
    );
}