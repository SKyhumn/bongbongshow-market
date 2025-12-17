import axios from "axios";
import First from "../Rank/First";
import Second from "../Rank/Second";
import Third from "../Rank/Third";
import { useState } from "react";
import { useEffect } from "react";

export default function GoodPlayers(){

    return(
        <div className="good-players">
            <h1>랭킹</h1>
            <div className="podium">
                <First/>
                <Second/>
                <Third/>
            </div>
        </div>
    );
}