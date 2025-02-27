import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Image from "next/image";


const GoogleLoginButton = () => {
  const clientID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectURI = "http://localhost:3000/auth/google/callback"; // 리디렉션 URI
  const [isLogin, setIsLogin] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  // 로그인 상태 확인
  useEffect(() => {
    const token = Cookies.get("jwt"); // 쿠키에서 jwt 토큰 확인
    console.log("로그인 버튼에서 토큰: " + token);

    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1])); // JWT 토큰 디코딩
      setUserName(decoded.name);
      console.log("사용자 이름: " + Cookies.get("username"));
      setIsLogin(true);
      console.log("상태: 로그인");
    }
    else {
      setIsLogin(false);
      setUserName("");
    }
  }, []);

  // 구글 로그인 페이지 URL 생성
  const googleLoginPage = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&scope=email profile`;

  // 로그아웃 처리
  const handleLogout = () => {
    console.log("구글 로그아웃 실행");
    Cookies.remove("jwt"); // 쿠키에서 jwt 삭제
    
    setIsLogin(false);
    setUserName("");

    console.log("로그아웃 후 상태:");
    console.log("isLogin:", isLogin); // 로그아웃 후 상태 확인
    console.log("userName:", userName); // 사용자 이름 확인


    router.push("/"); // 홈 페이지로 리다이렉트
    
  };

  if (!clientID) {
    console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID가 설정되지 않았습니다.");
    return null;
  }

  return (
    <div>
      {isLogin ? (
        <div>
          <p>{userName}님, 환영합니다!</p>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        <a href={googleLoginPage}>
          <button className="flex bg-[#E2E2E2] w-[348px] h-[50px] rounded-[17px] flex-row items-center justify-between">
            <Image src="/images/logo_google.svg" alt="logo" width={28} height={28} className="absolute ml-3">
            </Image>
            <h6 className="px-[3px] flex-1">
              구글로 로그인하기
            </h6>
          </button>
        </a>
      )}
    </div>
  );
};

export default function GoogleLoginWrapper() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <GoogleLoginButton />
    </GoogleOAuthProvider>
  );
}