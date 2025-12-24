import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import type { User } from "../../types/User/User";
import { container } from "../../animation/Animation";
import { item } from "../../animation/Animation";
import { motion } from "framer-motion";
import Modal from "../Modals/Modal";
import { QrReader } from "react-qr-reader";

export default function Me(){
    const [user, setUser]=useState<User|null>(null);
    const [isLoading, setIsLoading]=useState<boolean>(true);
    const [error, setError]=useState<string|null>(null);
    const [isModalOpen, setIsModalOpen]=useState<boolean>(false);
    const [modalMessage, setModalMessage]=useState<string>('');
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isQrOpen, setIsQrOpen] = useState<boolean>(false);
    const [isProcessingQr, setIsProcessingQr] = useState<boolean>(false);

    useEffect(()=>{
        const fetchMyInfo=async()=>{
            const token=localStorage.getItem("accessToken");
            try{
                const res=await axios.get(
                    "/api/user/stats",
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

    if (isLoading) {
        return <div className="me">로딩 중...</div>
    }

    if (error) {
        return <div className="me">{error}</div>
    }

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
                "/api/user/profile-image",
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

    const handleScan = async (result: any) => {
        if (result && !isProcessingQr) {
            setIsProcessingQr(true);
            const qrUuid = result?.text;

            try {
                const token = localStorage.getItem("accessToken");
                await axios.post(
                    "/api/user/qr/authorize",
                    { qrCode: qrUuid },
                    {
                        withCredentials: true,
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setModalMessage("키오스크 로그인이 완료되었습니다!");
                setIsQrOpen(false);
            } catch (err) {
                setModalMessage("QR 인증에 실패했습니다.");
            } finally {
                setIsModalOpen(true);
                setIsProcessingQr(false);
                setIsQrOpen(false);
            }
        }
    };

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
                        src={preview||user?.profileImage||"/default-profile.jpeg"}
                        alt="profile"
                    />

                    <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'10px', width:'100%'}}>
                        <button
                            className="blue-btn"
                            onClick={()=>fileInputRef.current?.click()}
                            disabled={uploading}
                            style={{width:'100%', maxWidth:'200px'}}
                        >
                            {uploading?"업로드 중...":"프로필 사진 변경"}
                        </button>

                        <button
                            className="blue-btn"
                            style={{backgroundColor: '#ff6b6b', width:'100%', maxWidth:'200px'}}
                            onClick={() => setIsQrOpen(true)}
                        >
                            📷 QR 로그인
                        </button>
                    </div>
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
                    <h1>{user?user?.rank:"-"}위</h1>
                </motion.div>

                <motion.div
                    className="my-score"
                    variants={item}
                >
                    <div className="win" key={user?.win}>
                        <h2>승</h2>
                        <h3>{user?user?.win:"-"}</h3>
                    </div>
                    <div className="lose" key={user?.lose}>
                        <h2>패</h2>
                        <h3>{user?user?.lose:"-"}</h3>
                    </div>
                    <div className="draw" key={user?.draw}>
                        <h2>무</h2>
                        <h3>{user?user?.draw:"-"}</h3>
                    </div>
                </motion.div>
            </div>

            {isQrOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                    <h3 style={{color:'white', marginBottom:'20px'}}>키오스크 QR을 스캔하세요</h3>
                    <div style={{width: '300px', height: '300px', backgroundColor: 'black'}}>
                        <QrReader
                            onResult={handleScan}
                            constraints={{
                                facingMode: { ideal: 'environment' }
                            }}
                            videoId="video"
                            scanDelay={500}
                            containerStyle={{width: '100%', height: '100%'}}
                            videoStyle={{width: '100%', height: '100%', objectFit: 'cover'}}
                        />
                    </div>
                    <button
                        className="blue-btn"
                        style={{marginTop: '30px', backgroundColor: '#555'}}
                        onClick={() => setIsQrOpen(false)}
                    >
                        닫기
                    </button>
                </div>
            )}

            <Modal
                message={modalMessage}
                isOpen={isModalOpen}
                func={()=>setIsModalOpen(false)}
            />
        </motion.div>
    );
}