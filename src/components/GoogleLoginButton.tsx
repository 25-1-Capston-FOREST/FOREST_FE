import { GoogleOAuthProvider } from "@react-oauth/google";
import Image from "next/image";

const GoogleLoginButton = () => {
  const clientID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectURI = "https://forest-fe-fuw6-git-main-kim-minsus-projects.vercel.app/auth/google/callback"; // 리디렉션 URI

  if (!clientID) {
    console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID가 설정되지 않았습니다.");
    return null;
  }

  // 구글 로그인 페이지 URL 생성
  const googleLoginPage = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&scope=email profile`;

  return (
    <a href={googleLoginPage}>
      <button className="text-[18px] font-semibold mt-[20px] flex bg-white w-[353px] h-[67px] rounded-[6px] flex-row items-center justify-between">
        <Image src="/images/logo_google.svg" alt="logo" width={25} height={25} className="absolute ml-3" />
        <h6 className="px-[3px] flex-1">        Sign in with Google</h6>
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