import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import type { User } from "../../types/User";

export default function Me(){
    const [user, setUser]=useState<User>();

    return(
        <div className="me">
            <h1>내 전적</h1>
            <div className="my-info">
                <div className="changing-avatar">
                    <img src="/default-profile.jpeg" alt="profile"/>
                    <button className="blue-btn">프로필 사진 변경</button>
                </div>

                <div className="my-rank">
                    <h4>내 순위</h4>
                    <h1>5위</h1>
                </div>
                
                <div className="my-score">
                    <div className="win">
                        <h2>승</h2>
                        <h3>0</h3>
                    </div>
                    <div className="lose">
                        <h2>패</h2>
                        <h3>0</h3>
                    </div>
                    <div className="draw">
                        <h2>무</h2>
                        <h3>0</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}