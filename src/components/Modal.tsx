import type{ ModalProps } from "../types/ModalProps";

export default function Modal({message, isOpen, onClose}:ModalProps){
    if (!isOpen) return null;
    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{message}</h2>
                <button 
                    onClick={onClose}
                    className="blue-btn"
                >
                    닫기
                </button>
            </div>
        </div>
    );
}