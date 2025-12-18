import Podium from "../Ranking/Podium";
import TheRest from "../Ranking/TheRest";

export default function Ranking(){
    return(
        <div className="ranking">
            <Podium/>
            <TheRest/>
        </div>
    );
}