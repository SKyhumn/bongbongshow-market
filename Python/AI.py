import sys
import time
import tkinter as tk
from tkinter import messagebox
import qrcode
from PIL import Image, ImageTk
import cv2
import mediapipe as mp
import requests
import serial
import json

# ==========================================
# 1. 설정 파트
# ==========================================
USE_ARDUINO = True

BLUETOOTH_PORT = 'COM6'
BAUD_RATE = 9600
ser = None

# 서버 주소
BASE_URL = "https://bongbong-market.shop//api"
QR_INIT_URL = f"{BASE_URL}/public/qr/init"
QR_POLL_URL = f"{BASE_URL}/public/qr/poll"
GAME_URL = f"{BASE_URL}/common/play"

SEND_COOLDOWN = 1.0
last_send_time = 0

if USE_ARDUINO:
    try:
        ser = serial.Serial(BLUETOOTH_PORT, BAUD_RATE, timeout=1)
        print(f"✅ 아두이노 연결 성공: {BLUETOOTH_PORT}")
    except Exception as e:
        print(f"⚠️ 아두이노 연결 실패: {e}")
        ser = None
else:
    print("🚫 [테스트 모드] 아두이노 연결 생략")


# ==========================================
# 2. QR 로그인 GUI
# ==========================================
def qr_login_gui():
    token_storage = {"accessToken": None}

    # 1. UUID 발급 요청
    try:
        print("🌐 서버에 QR 세션 요청 중...")
        response = requests.get(QR_INIT_URL)
        if response.status_code != 200:
            messagebox.showerror("오류", "서버와 통신할 수 없습니다.")
            return None

        qr_uuid = response.text.strip().replace('"', '')
        print(f"🔑 QR UUID 발급됨: {qr_uuid}")

    except Exception as e:
        messagebox.showerror("오류", f"서버 연결 실패: {e}")
        return None

    # 2. GUI 생성
    root = tk.Tk()
    root.title("QR 로그인")
    root.geometry("400x450")

    lbl_info = tk.Label(root, text="모바일 앱으로 QR을 스캔해주세요", font=("Arial", 14))
    lbl_info.pack(pady=20)

    # QR 생성
    qr = qrcode.QRCode(box_size=10, border=4)
    qr.add_data(qr_uuid)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    tk_img = ImageTk.PhotoImage(img)
    lbl_qr = tk.Label(root, image=tk_img)
    lbl_qr.pack()

    lbl_status = tk.Label(root, text="대기 중...", fg="blue", font=("Arial", 10))
    lbl_status.pack(pady=10)

    # 3. 로그인 확인 (Polling)
    def check_login_status():
        try:
            res = requests.get(f"{QR_POLL_URL}?uuid={qr_uuid}")

            if res.status_code == 200:
                data = res.text.strip()
                print(f"[디버깅] 서버 응답: {data}") # 확인용 출력

                if data == "WAITING" or data == '"WAITING"':
                    lbl_status.config(text="승인 대기 중... (앱에서 스캔해주세요)")
                    root.after(1000, check_login_status)
                else:
                    # 로그인 성공
                    try:
                        token_data = json.loads(data)
                        token_storage["accessToken"] = token_data.get("accessToken")
                        print("✅ 로그인 성공! 토큰 수신 완료.")
                        messagebox.showinfo("성공", "로그인되었습니다!")
                        root.destroy()
                    except json.JSONDecodeError:
                        # JSON 변환 실패 시 (혹시 모를 에러 방지)
                        print(f"⚠️ JSON 변환 실패, 데이터: {data}")
                        root.after(1000, check_login_status)

            elif res.status_code == 400:
                lbl_status.config(text="QR 만료됨. 재시작 필요.", fg="red")
            else:
                root.after(1000, check_login_status)

        except Exception as e:
            print(f"Polling 에러: {e}")
            root.after(1000, check_login_status)

    def on_closing():
        root.destroy()
        sys.exit()

    root.protocol("WM_DELETE_WINDOW", on_closing)
    root.after(1000, check_login_status)
    root.mainloop()

    return token_storage["accessToken"]


# ==========================================
# 3. 메인 실행
# ==========================================
access_token = qr_login_gui()

if access_token is None:
    print("❌ 로그인 실패. 종료합니다.")
    sys.exit()

print("\n🎮 게임을 시작합니다!")

# ==========================================
# 4. 게임 루프
# ==========================================
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils


def is_finger_open(hand, tip, pip):
    return hand.landmark[tip].y < hand.landmark[pip].y


def get_hand_orientation(hand, label):
    idx_x = hand.landmark[5].x
    pinky_x = hand.landmark[17].x
    if label == "Right":
        return "Palm" if pinky_x > idx_x else "Back"
    else:
        return "Palm" if pinky_x < idx_x else "Back"


def is_thumb_open(hand, label):
    thumb_tip = hand.landmark[4].x
    thumb_ip = hand.landmark[3].x
    orientation = get_hand_orientation(hand, label)
    if label == "Left":
        if orientation == "Palm":
            return thumb_tip > thumb_ip
        else:
            return thumb_tip < thumb_ip
    else:
        if orientation == "Palm":
            return thumb_tip < thumb_ip
        else:
            return thumb_tip > thumb_ip


def get_rps_gesture(hand, label):
    thumb = is_thumb_open(hand, label)
    index = is_finger_open(hand, 8, 6)
    middle = is_finger_open(hand, 12, 10)
    ring = is_finger_open(hand, 16, 14)
    pinky = is_finger_open(hand, 20, 18)
    fingers = [thumb, index, middle, ring, pinky]

    if fingers == [False, False, False, False, False]: return "rock"
    if fingers == [False, True, True, False, False] or fingers == [True, True, False, False, False]: return "scissors"
    if fingers == [True, True, True, True, True]: return "paper"
    return "unknown"


cap = cv2.VideoCapture(1, cv2.CAP_DSHOW)

print("\n📷 카메라 시작 (ESC: 종료, SPACE: 결과 전송)")

with mp_hands.Hands(max_num_hands=1, min_detection_confidence=0.5, min_tracking_confidence=0.5) as hands:
    while True:
        ret, frame = cap.read()
        if not ret: break

        frame = cv2.flip(frame, 1)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = hands.process(rgb)
        current_gesture = "No hand"

        if result.multi_hand_landmarks:
            for hand_landmarks, hand_info in zip(result.multi_hand_landmarks, result.multi_handedness):
                label = hand_info.classification[0].label
                mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
                current_gesture = get_rps_gesture(hand_landmarks, label)

        cv2.putText(frame, f"Gesture: {current_gesture}", (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 0), 3)
        cv2.imshow("BongBong Market Game", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == 27: break  # ESC

        if key == 32:  # SPACE
            aiMove = "unknown"
            if ser is not None and ser.in_waiting > 0:
                raw_data = ser.read().decode().strip()
                if raw_data == '0':
                    aiMove = "rock"
                elif raw_data == '1':
                    aiMove = "scissors"
                elif raw_data == '2':
                    aiMove = "paper"
            elif ser is None:
                import random

                aiMove = random.choice(["rock", "scissors", "paper"])

            current_time = time.time()
            if current_time - last_send_time >= SEND_COOLDOWN:
                if current_gesture in ["rock", "scissors", "paper"]:
                    last_send_time = current_time
                    try:
                        res = requests.post(GAME_URL,
                                            json={"userMove": current_gesture, "aiMove": aiMove},
                                            headers={"Authorization": f"Bearer {access_token}",
                                                     "Content-Type": "application/json"})
                        if res.status_code == 200:
                            data = res.json()
                            print(f"🎉 결과: {data.get('result')} (나:{data.get('userMove')}, AI:{data.get('aiMove')})")
                    except Exception as e:
                        print(f"❌ 전송 실패: {e}")

cap.release()
cv2.destroyAllWindows()