# 봉봉쇼랭킹(로봇 가위바위보 유저 랭킹 웹앱)

AI 기반 로봇과 가위바위보를 즐기고  
게임 결과와 승패 기록을 즉시 UI로 확인할 수 있는  
React 기반 인터랙티브 웹 애플리케이션입니다.

## 💻 preview

메인페이지, 로그인, 회원가입 화면 예시입니다.

![메인페이지](./src/assets/main.png)
![로그인](./src/assets/sign-in.png)
![회원가입](./src/assets/sign-up.png)
![비밀번호 재설정](./src/assets/reset-password.png)

## ✨ Features

- 승/패 판정 및 결과 저장
- 로그인 후 자기 순위 확인 가능
- 회원가입 및 비밀번호 재설정 가능
- 프론트엔드에서 유저 순위 실시간 업데이트 및 UI 반영
  
## 🛠️ Tech Stack

- Vite: 빠른 개발 환경 구성과 빠른 HMR 지원
- React: 상태 변화에 따른 UI 렌더링
- TypeScript: 데이터 타입 지정 및 버그 최소화
- React Router Dom: 페이지 전환
- Axios: 서버와 데이터 송수신
- CSS / Framer Motion: UI 스타일링 및 애니메이션 구현

## ⚙️ User Flow

1. 로그인 화면에서 계정 입력 후 로그인
2. 서버에서 사용자 정보와 순위 데이터 불러오기
3. 메인 페이지에서 사용자 정보 및 상위 10명 순위 확인하기
4. 전체 순위 확인 버튼으로 전체 유저 순위 확인

## 🚀 Future Improvements

- 모바일 사용자를 위한 반응형 UI 개선
- 사용자 편의를 위한 UI 개선