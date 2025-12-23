import type { BackButtonProps } from "../../types/BackButtonProps";

export default function BackButton({onClick}:BackButtonProps){

    return(
        <div className="back-btn">
            <img 
                src="../src/assets/icon/back-btn.svg" 
                onClick={onClick}
            />
        </div>
    );
}