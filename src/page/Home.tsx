import Header from "../components/Header";

export default function Home(){
    return( 
        <div className="home-page">
            <Header/>
            <div className="content">
                <div className="box1"></div>
                <div className="box2"></div>
                <div className="box3"></div>
            </div>
        </div>
    );
}