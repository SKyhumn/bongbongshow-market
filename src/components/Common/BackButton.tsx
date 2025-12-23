import type { BackButtonProps } from "../../types/BackButtonProps";
import img from "../../images/back-btn.svg"

export default function BackButton({onClick}:BackButtonProps){

    return(
        <div className="back-btn">
            <img 
                src={img}
                onClick={onClick}
            />
        </div>
    );
}