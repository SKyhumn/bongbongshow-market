import Header from "../components/Home/Header";
import Me from "../components/Home/Me";
import Ranking from "../components/Home/Ranking";

export default function Home(){
    return( 
        <div className="home-page">
            <Header/>
            <div id="content">
                <div className="box1">
                    <Me/>
                </div>
                <div className="box2">
                    <h1 className="ranking-title">랭킹</h1>
                    <Ranking/>
                </div>
            </div>
        </div>
    );
}