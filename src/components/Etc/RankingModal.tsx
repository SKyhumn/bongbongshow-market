import { useState, useEffect } from "react";
import axios from "axios";
import type { RankingModalProps } from "../../types/RankingModalProps";
import type { RankingUser } from "../../types/RankingUser";

export default function RankingModal({ isOpen, func }: RankingModalProps) {
    const [data, setData] = useState<RankingUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");

        if (!token) {
            setError("로그인이 필요합니다.");
            setIsLoading(false);
            return;
        }   

        let isMounted = true;

        const fetchData = async () => {
            try {
                const res = await axios.get(
                    "https://bongbong-market.shop/api/user/ranking/all", 
                    {
                        withCredentials: true,
                        headers:{ 
                            Authorization: `Bearer ${token}` 
                        },
                    }
                );
            if (isMounted) setData(res.data);
            } catch(err:any) {
                if (isMounted) setError("랭킹을 불러올 수 없습니다.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={func}>
        <div className="modal-content ranking-modal" onClick={(e) => e.stopPropagation()}>
            {isLoading && (
                <>
                    <p>로딩 중...</p>
                    <div className="the-rest">
                    </div>
                </>
            )}
            {error && <p>{error}</p>}
            {!isLoading && !error && (
                <>
                    <h1>전체 랭킹</h1>
                    <div className="the-rest">
                    {data.map((dt) => (
                        <div className="rank-item" key={dt.name}>
                            <div className="user">
                                <h4>{dt.rank}위</h4>
                                <img 
                                    src={dt.profileImage||"/default-profile.jpeg"} 
                                    alt={`${dt.name} profile`} 
                                />
                                <h4>{dt.name}</h4>
                            </div>
                            <h4>{dt.winCount}승</h4>
                        </div>
                    ))}
                    </div>
                </>
            )}
            <button onClick={func} className="blue-btn">
                닫기
            </button>
        </div>
    </div>
  );
}
