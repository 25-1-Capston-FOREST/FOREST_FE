# FOREST_FE
AI 여가 추천 서비스 FOREST FrontEnd Repository입니다.

---

## 프론트엔드 주요 기능
- 로그인 및 인증: Google OAuth 기반 로그인 구현
- 메인 페이지: 최신 영화/공연/전시 콘텐츠 카드 UI 제공
- 챗봇 인터페이스: AI와의 대화를 통한 취향 수집
- 맞춤형 추천: 사용자 선호 기반 콘텐츠 추천 UI
- 찜하기: 콘텐츠 북마크 및 위시리스트 기능
- 상세 페이지: 콘텐츠별 상세 정보 및 리뷰 확인

---

## 사용 기술 스택
| 분야       | 기술                              |
|------------|-----------------------------------|
| 프레임워크 | React (Next.js)                   |
| 상태 관리  | useState, useEffect               |
| 인증       | @react-oauth/google               |
| 쿠키       | js-cookie                         |
| 스타일링   | Tailwind CSS                      |
| 배포       | Vercel                            |

---

## 프로젝트 구조
FOREST_FE/
├── .next/                  # Next.js 빌드 결과물
├── node_modules/           # 설치된 패키지 모듈
├── public/                 # 정적 파일 경로
│   ├── data/
│   └── images/
├── src/
│   ├── components/         # 재사용 가능한 UI 컴포넌트
│   │   ├── GoogleLoginButton.tsx
│   │   ├── Header.tsx
│   │   ├── KakaoMapImage.tsx
│   │   ├── Leisure.tsx
│   │   └── Mypagebar.tsx
│   ├── lib/                # API 통신 및 유틸
│   │   ├── api/            # 백엔드 API 통신 모듈
│   │   │   ├── book.tsx
│   │   │   ├── chatbot.tsx
│   │   │   ├── detail.tsx
│   │   │   ├── recommend.tsx
│   │   │   ├── review.tsx
│   │   │   ├── search.tsx
│   │   │   ├── useractivities.tsx
│   │   │   └── wish.tsx
│   │   └── axios.tsx       # axios 설정
│   └── pages/              # Next.js 페이지 라우팅
|       ├── ...
├── .env.local              # 환경변수 파일
├── package.json
├── tsconfig.json
├── README.md 
└── ...



<details> <summary><strong>📁 프로젝트 구조 (펼치기)</strong></summary>
text
복사
편집
FOREST_FE/
├── .next/                  # Next.js 빌드 결과물
├── node_modules/           # 설치된 패키지 모듈
├── public/                 # 정적 파일 경로
│   ├── data/
│   └── images/
├── src/
│   ├── components/         # 재사용 가능한 UI 컴포넌트
│   │   ├── GoogleLoginButton.tsx
│   │   ├── Header.tsx
│   │   ├── KakaoMapImage.tsx
│   │   ├── Leisure.tsx
│   │   └── Mypagebar.tsx
│   ├── lib/                # API 통신 및 유틸
│   │   ├── api/            # 백엔드 API 통신 모듈
│   │   │   ├── book.tsx
│   │   │   ├── chatbot.tsx
│   │   │   ├── detail.tsx
│   │   │   ├── recommend.tsx
│   │   │   ├── review.tsx
│   │   │   ├── search.tsx
│   │   │   ├── useractivities.tsx
│   │   │   └── wish.tsx
│   │   └── axios.tsx       # axios 설정
│   └── pages/              # Next.js 페이지 라우팅
├── .env.local              # 환경변수 파일
├── package.json
├── tsconfig.json
└── README.md
</details>
---

## 실행 방법
1. 패키지 설치  
   ```bash
   npm install  
   npm install @react-oauth/google  
   npm install js-cookie  
   npm install --save-dev @types/js-cookie  

2. 실행
   - 배포 주소 접속

   - 로컬 서버 실행
      ```bash
      npm run dev 
