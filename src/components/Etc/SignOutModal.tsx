import type { SignOutModal } from "../../types/SignOutModalProps";

export default function SignOutModal({isOpen, yesFunc, noFunc}:SignOutModal){
    if (!isOpen) return null;
    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>로그아웃 하시겠습니까?</h2>
                <button onClick={noFunc} className="red-btn">
                    아니오
                </button>
                <button onClick={yesFunc} className="blue-btn">
                    예
                </button>
            </div>
        </div>
    );
}