# 봉봉쇼랭킹(로봇 가위바위보 유저 랭킹 웹앱)

AI 기반 로봇과 가위바위보를 즐기고  
게임 결과와 승패 기록을 즉시 UI로 확인할 수 있는  
React 기반 인터랙티브 웹 애플리케이션입니다.

## 💡 기획 배경
웹 프론트엔드 개발자 + 웹 백엔드/AI 개발자 + 하드웨어 개발자 + 게임 기획/개발자가 모여서
사용자가 로봇과 가위바위보 해서 승부를 가리고 웹 화면에 사용자 전적과 랭킹을 띄우도록 구현했습니다.

## 🚀 주요 기능

- **메인페이지**

![메인페이지](https://github.com/SKyhumn/bongbongshow-market/blob/main/frontend/src/assets/main.png)

- 가위바위보 후 내 전적 확인하기
- 사용자 전적 랭킹 확인
- QR 인증 후 가위바위보 게임 본격적으로 시작
  - 타 기기의 게임 시작 프로그램에서 띄운 QR 코드를 웹 클라이언트에서 인증 => 게임 시작
- 프로필 사진 변경

## 🧭 서비스 흐름

로그인 => 전적 확인 및 랭킹 확인 => 타 기기의 게임 프로그램에 있는 QR코드 인증 => 로봇이랑 가위바위보 시작 & 타 기기에서 AI가 사용자 손 동작을 인식
  
## 🛠️ 기술 스택

- **Client Development**
  
    ![React](https://img.shields.io/badge/react-%2361DAFB?style=for-the-badge&logo=react&logoColor=black)
    ![TypeScript](https://img.shields.io/badge/typescript-%233178C6?style=for-the-badge&logo=typescript&logoColor=white)
    ![HTML5](https://img.shields.io/badge/html5-%23E34F26?style=for-the-badge&logo=html5&logoColor=white)
    ![CSS](https://img.shields.io/badge/CSS-663399?style=for-the-badge&logo=css&logoColor=white)
    
- **Server Development**

    ![Spring](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
    ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

- **Developement Tools**
  
    ![Vite](https://img.shields.io/badge/Vite-9135FF?style=for-the-badge&logo=vite&logoColor=white)
    ![Git](https://img.shields.io/badge/Git-F03C2E?style=for-the-badge&logo=git&logoColor=white)
    ![GitHub](https://img.shields.io/badge/GitHub-%23181717?style=for-the-badge&logo=github&logoColor=white)

- **Deploy**

  - AWS EC2: 서버 배포용

## 🤔 트러블 슈팅

### 프로필 사진 변경 문제

```
- 문제: 사진 변경 시 사진이 바로 반영이 안 되었던 문제
- 해결: `URL.createObjectURL(file)`로 로컬 blob URL을 생성해 preview 상태에 저장, 서버 응답을 기다리지 않고 즉시 화면에 렌더링되도록 처리
```

## 향후 개선

- 모바일 사용자를 위한 반응형 UI 개선
- 사용자 편의를 위한 UI 개선
