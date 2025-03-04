import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";


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


    // if (token) {
    //   const decoded = JSON.parse(atob(token.split(".")[1])); // JWT 토큰 디코딩
    //   setUserName(decoded.name);
    //   console.log("사용자 이름: " + Cookies.get("username"));
    //   setIsLogin(true);
    //   console.log("상태: 로그인");
    // }
    // else {
    //   setIsLogin(false);
    //   setUserName("");
    // }
  }, []);

  // 구글 로그인 페이지 URL 생성
  const googleLoginPage = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&scope=email profile`;

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      // 백엔드 로그아웃 API 요청
      const response = await axios.post("http://localhost:3001/logout", {}, {
        withCredentials: true, // 쿠키를 함께 보내려면 필요
      });

      console.log("로그아웃 성공:", response.data);

      // 백엔드에서 로그아웃 처리 후 프론트엔드 상태 처리
      Cookies.remove("jwt"); // 클라이언트에서 JWT 쿠키 삭제
      setIsLogin(false); // 로그인 상태 업데이트
      setUserName(""); // 사용자 이름 초기화

      console.log(isLogin); //여기서 false 뜸뜸
      console.log(userName);

    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  if (!clientID) {
    console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID가 설정되지 않았습니다.");
    return null;
  }
  useEffect(() => {
    if (!isLogin) {
      // 상태가 false로 변경된 후에 리디렉션
      router.push("/");
    }
  }, [isLogin]);


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