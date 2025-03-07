import { GoogleOAuthProvider } from "@react-oauth/google";
import Image from "next/image";

const GoogleLoginButton = () => {
  const clientID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectURI = "http://localhost:3000/auth/google/callback"; // 리디렉션 URI

  if (!clientID) {
    console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID가 설정되지 않았습니다.");
    return null;
  }

  // 구글 로그인 페이지 URL 생성
  const googleLoginPage = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&scope=email profile`;

  return (
    <a href={googleLoginPage}>
      <button className="mt-[20px] flex bg-[#E2E2E2] w-[348px] h-[50px] rounded-[17px] flex-row items-center justify-between">
        <Image src="/images/logo_google.svg" alt="logo" width={28} height={28} className="absolute ml-3" />
        <h6 className="px-[3px] flex-1">구글로 로그인하기</h6>
      </button>
    </a>
  );
};

export default function GoogleLoginWrapper() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <GoogleLoginButton />
    </GoogleOAuthProvider>
  );
}