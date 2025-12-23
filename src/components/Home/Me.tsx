import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import type { User } from "../../types/User/User";
import { container } from "../../animation/Animation";
import { item } from "../../animation/Animation";
import { motion } from "framer-motion";
import Modal from "../Modals/Modal";
import baseImg from "../../images/default-profile.jpeg"

export default function Me(){
    const [user, setUser]=useState<User|null>(null);
    const [isLoading, setIsLoading]=useState<boolean>(true);
    const [error, setError]=useState<string|null>(null);
    const [isModalOpen, setIsModalOpen]=useState<boolean>(false);
    const [modalMessage, setModalMessage]=useState<string>('');
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // 내 정보 불러오기
    useEffect(()=>{
        const fetchMyInfo=async()=>{
            const token=localStorage.getItem("accessToken");
            try{
                const res=await axios.get(
                    "https://bongbong-market.shop/api/user/stats",
                    {
                        withCredentials:true,
                        headers:{
                            Authorization:`Bearer ${token}`,
                        }
                    }
                );
                setUser(res.data);
            } catch(err:any){
                setError('내 정보를 불러올 수 없어요...');
            } finally{
                setIsLoading(false);
            }
        }
        fetchMyInfo();

        const interval = setInterval(fetchMyInfo, 3000);

        return () => clearInterval(interval);
    },[]);


    // 로딩 중...
    if (isLoading) {
        return <div className="me">로딩 중...</div>
    }

    // 로딩 실패
    if (error) {
        return <div className="me">{error}</div>
    }

    // 프로필 사진 바꾸기
    const handleImgChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.[0];
        if (!file || !user) return;

        if(file.size>2*1024*1024){
            setModalMessage("사진은 2MB 이하만 가능합니다.");
            setIsModalOpen(true);
            e.target.value="";
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        uploadProfileImg(file);

        e.target.value = "";
    }

    const uploadProfileImg=async(file:File)=>{
        const token=localStorage.getItem("accessToken");
        const formData=new FormData();
        formData.append("file",file);

        try{
            setUploading(true);

            await axios.post(
                "https://bongbong-market.shop/api/user/profile-image",
                formData,
                {
                    withCredentials:true,
                    headers:{
                        Authorization:`Bearer ${token}`,
                    },
                }
            );
        } catch(err:any){
            setPreview(null);
            setModalMessage("이미지 변경에 실패했습니다.");
            setIsModalOpen(true);

        } finally{
            setUploading(false);
        }
    }

    return(
        <motion.div 
            className="me" 
            variants={container} 
            initial="hidden" 
            animate="show"
        >
            <motion.h1 variants={item}>내 전적</motion.h1>
            <div className="my-info">
                <motion.div 
                    className="changing-avatar" 
                    variants={item}
                >
                    <img 
                        src={preview||user?.profileImage||baseImg} 
                        alt="profile"
                    />
                    <button 
                        className="blue-btn" 
                        onClick={()=>fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading?"업로드 중...":"프로필 사진 변경"}
                    </button>
                </motion.div>

                <input 
                    type="file" 
                    accept="image/*"
                    ref={fileInputRef}
                    style={{display:"none"}}
                    onChange={handleImgChange}
                />

                <motion.div 
                    className="my-rank" 
                    variants={item}
                >
                    <h4>내 순위</h4>
                    <h1>{user?user?.rank:"0"}위</h1>
                </motion.div>
                
                <motion.div 
                    className="my-score" 
                    variants={item}
                >
                    <div className="win" key={user?.win}>
                        <h2>승</h2>
                        <h3>{user?user?.win:"0"}</h3>
                    </div>
                    <div className="lose" key={user?.lose}>
                        <h2>패</h2>
                        <h3>{user?user?.lose:"0"}</h3>
                    </div>
                    <div className="draw" key={user?.draw}>
                        <h2>무</h2>
                        <h3>{user?user?.draw:"0"}</h3>
                    </div>
                </motion.div>
            </div>
            <Modal
                message={modalMessage}
                isOpen={isModalOpen}
                func={()=>setIsModalOpen(false)}
            />
        </motion.div>
    );
}